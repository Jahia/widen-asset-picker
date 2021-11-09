package org.jahia.se.modules.edp.dam.widen.edp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;
//import org.apache.commons.httpclient.HttpClient;
//import org.apache.commons.httpclient.HttpsURL;
//import org.apache.commons.httpclient.methods.GetMethod;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.NameValuePair;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.message.BasicNameValuePair;
import org.apache.hc.core5.net.URIBuilder;
import org.apache.http.HttpHeaders;
//import org.apache.http.impl.client.HttpClients;

import org.jahia.modules.external.ExternalData;
import org.jahia.modules.external.ExternalDataSource;
import org.jahia.se.modules.edp.dam.widen.model.WidenAsset;
import org.jahia.se.modules.edp.dam.widen.service.WidenProviderConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.ItemNotFoundException;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
import java.net.URI;
import java.util.*;

//,ExternalDataSource.Searchable.class not used for now, needed if you want to use AugSearch with external asset
public class WidenDataSource implements ExternalDataSource{
    private static final Logger LOGGER = LoggerFactory.getLogger(WidenDataSource.class);

    private static final String ASSET_ENTRY = "assets";
    private static final String ASSET_ENTRY_EXPAND = "embeds,thumbnails,file_properties";

    private final ObjectMapper mapper = new ObjectMapper();
    private final WidenProviderConfig widenProviderConfig;
    private final WidenCacheManager widenCacheManager;
    private final CloseableHttpClient httpClient;

    public WidenDataSource(WidenProviderConfig widenProviderConfig, WidenCacheManager widenCacheManager) {
        this.widenProviderConfig = widenProviderConfig;
        this.widenCacheManager = widenCacheManager;
        // instantiate HttpClient
        this.httpClient = HttpClients.createDefault();
    }

    @Override
    public List<String> getChildren(String s) throws RepositoryException {
        List<String> child = new ArrayList<String>();
        return child;
    }

    @Override
    public ExternalData getItemByIdentifier(String identifier) throws ItemNotFoundException {
        try {
            if (identifier.equals("root")) {
                return new ExternalData(identifier, "/", "jnt:contentFolder", new HashMap<String, String[]>());
            }else{
                synchronized (this){
                    WidenAsset widenAsset = widenCacheManager.getWidenAsset(identifier);
                    if(widenAsset == null){
                        LOGGER.debug("no cacheEntry for : "+identifier);
                        String path = "/"+widenProviderConfig.getApiVersion()+"/"+ASSET_ENTRY+"/"+identifier;
                        Map<String, String> query = new LinkedHashMap<String, String>();
                        query.put("expand",ASSET_ENTRY_EXPAND);
                        widenAsset = queryWiden(path,query);
                        widenCacheManager.cacheWidenAsset(widenAsset);
                    }
                    ExternalData data = new ExternalData(identifier, "/"+identifier, widenAsset.getJahiaNodeType(), widenAsset.getProperties());
                    return data;
                }
            }
        } catch (Exception e) {
            throw new ItemNotFoundException(e);
        }
    }

    @Override
    public ExternalData getItemByPath(String path) throws PathNotFoundException {
        String[] splitPath = path.split("/");
        try {
            if (path.endsWith("j:acl")) {
                throw new PathNotFoundException(path);
            }

            if (splitPath.length <= 1) {
                return getItemByIdentifier("root");

            } else if (splitPath.length == 2) {
                return getItemByIdentifier(splitPath[1]);

            }
        } catch (ItemNotFoundException e) {
            throw new PathNotFoundException(e);
        }
        throw new PathNotFoundException();
    }

    @Override
    public Set<String> getSupportedNodeTypes() {
        return Sets.newHashSet(
                "jnt:contentFolder",
                "wdennt:image",
                "wdennt:video",
                "wdennt:pdf",
                "wdennt:document",
                "wdennt:widen"
        );
    }

    @Override
    public boolean isSupportsHierarchicalIdentifiers() {
        return false;
    }

    @Override
    public boolean isSupportsUuid() {
        return false;
    }

    @Override
    public boolean itemExists(String s) {
        return false;
    }

    private WidenAsset queryWiden(String path, Map<String, String> query) throws RepositoryException {
        LOGGER.debug("Query Widen with path : {} and query : {}",path,query);
        try {
            String schema = widenProviderConfig.getApiProtocol();
            String endpoint = widenProviderConfig.getApiEndPoint();
            String widenSite = widenProviderConfig.getApiSite();
            String widenToken = widenProviderConfig.getApiToken();
            List<NameValuePair> parameters = new ArrayList<>(query.size());

            for (Map.Entry<String, String> entry : query.entrySet()) {
                parameters.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
//            HttpsURL url = new HttpsURL(endpoint, 443, path);
            URIBuilder builder = new URIBuilder()
                    .setScheme(schema)
                    .setHost(endpoint)
                    .setPath(path)
                    .setParameters(parameters);

//            url.setQuery(
//                query.keySet().toArray(new String[query.size()]),
//                query.values().toArray(new String[query.size()])
//            );

            URI uri = builder.build();

            long l = System.currentTimeMillis();
            HttpGet getMethod = new HttpGet(uri);
//            GetMethod getMethod = new GetMethod(url.toString());


            //NOTE Widen return content in ISO-8859-1 even if Accept-Charset = UTF-8 is set.
            //Need to use appropriate charset later to read the inputstream response.
            getMethod.setHeader(HttpHeaders.AUTHORIZATION,"Bearer "+widenSite+"/"+widenToken);
//            getMethod.setRequestHeader("Content-Type","application/json");
//            getMethod.setRequestHeader("Accept-Charset","ISO-8859-1");
//            getMethod.setRequestHeader("Accept-Charset","UTF-8");
            CloseableHttpResponse resp = null;
            try {
//                httpClient.executeMethod(getMethod);
                resp = httpClient.execute(getMethod);
//                return new JSONObject(EntityUtils.toString(resp.getEntity()));
                WidenAsset widenAsset = mapper.readValue(EntityUtils.toString(resp.getEntity()),WidenAsset.class);

//                BufferedReader streamReader = new BufferedReader(new InputStreamReader(getMethod.getResponseBodyAsStream(),"UTF-8"));
//                StringBuilder responseStrBuilder = new StringBuilder();
//
//                String inputStr;
//                while ((inputStr = streamReader.readLine()) != null)
//                    responseStrBuilder.append(inputStr);
//
//                WidenAsset widenAsset = mapper.readValue(responseStrBuilder.toString(),WidenAsset.class);

                return widenAsset;

            } finally {
                if (resp != null) {
                    resp.close();
                }
//                getMethod.releaseConnection();
                LOGGER.debug("Request {} executed in {} ms",uri, (System.currentTimeMillis() - l));
            }
        } catch (Exception e) {
            LOGGER.error("Error while querying Widen", e);
            throw new RepositoryException(e);
        }
    }
}
