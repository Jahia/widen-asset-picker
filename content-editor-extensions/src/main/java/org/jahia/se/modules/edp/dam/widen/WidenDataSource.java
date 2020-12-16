package org.jahia.se.modules.edp.dam.widen;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;
import net.sf.ehcache.Element;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpsURL;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.http.HttpHeaders;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.external.ExternalData;
import org.jahia.modules.external.ExternalDataSource;
import org.jahia.osgi.BundleUtils;
import org.jahia.se.modules.edp.dam.widen.cache.WidenCacheManager;
import org.jahia.se.modules.edp.dam.widen.model.WidenAsset;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.ItemNotFoundException;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

//,ExternalDataSource.Searchable.class not used for now, needed if you want to use AugSearch with external asset
@Component(service = {WidenDataSource.class, ExternalDataSource.class}, immediate = true)
public class WidenDataSource implements ExternalDataSource{
    private static final Logger LOGGER = LoggerFactory.getLogger(WidenDataSource.class);

    private static final String ASSET_ENTRY = "assets";
    private static final String ASSET_ENTRY_EXPAND = "embeds,thumbnails,file_properties";
//    private static final String FILE_TYPE_IMAGE = "image";
//    private static final String FILE_TYPE_VIDEO = "video";
//    private static final String FILE_TYPE_PDF = "pdf";
//    private static final String CONTENT_TYPE_IMAGE = "wdennt:image";
//    private static final String CONTENT_TYPE_VIDEO = "wdennt:video";
//    private static final String CONTENT_TYPE_PDF = "wdennt:pdf";
//    private static final String CONTENT_TYPE_DOC = "wdennt:document";

    private WidenCacheManager widenCacheManager;

    public MountPoint getStoreMountPoint() {
        return wdenStoreMountPoint;
    }
    
    private MountPoint wdenStoreMountPoint;
    private HttpClient httpClient;

    private JahiaTemplatesPackage jahiaTemplatesPackage;

    public WidenDataSource() {
        // instantiate HttpClient
        httpClient = new HttpClient();
    }

    @Reference(service = WidenCacheManager.class)
    public void setStoreCacheManager(WidenCacheManager widenCacheManager) {
        this.widenCacheManager = widenCacheManager;
    }

    @Activate
    public void onActivate(BundleContext bundleContext) {
//        storeIsReady = false;
        jahiaTemplatesPackage = BundleUtils.getModule(bundleContext.getBundle());
    }

    @Deactivate
    public void onDeactivate() {
//        disconnect();
//        storeIndexer = null;
    }

    public void reload(MountPoint wdenStoreMountPoint){
        this.wdenStoreMountPoint = wdenStoreMountPoint;
    }

    public void setHttpClient(HttpClient httpClient) {
        this.httpClient = httpClient;
    }

    @Override
    public List<String> getChildren(String s) throws RepositoryException {
        LOGGER.info("***** WidenDataSource ***** getChildren is called with params : "+s);
        List<String> child = new ArrayList<String>();
        return child;
    }

    @Override
    public ExternalData getItemByIdentifier(String identifier) throws ItemNotFoundException {
        LOGGER.info("***** WidenDataSource ***** getItemByIdentifier is called with identifier : "+identifier);
        try {
            if (identifier.equals("root")) {
                return new ExternalData(identifier, "/", "jnt:contentFolder", new HashMap<String, String[]>());
            }else{
                WidenAsset widenAsset = widenCacheManager.getWidenAsset(identifier);
                if(widenAsset == null){
                    String path = "/"+wdenStoreMountPoint.getVersion()+"/"+ASSET_ENTRY+"/"+identifier;
                    Map<String, String> query = new LinkedHashMap<String, String>();
                    query.put("expand",ASSET_ENTRY_EXPAND);
                    widenAsset = queryWiden(path,query);
                    widenCacheManager.cacheWidenAsset(widenAsset);
                }
                LOGGER.debug("***** WidenDataSource ***** widenAsset : "+widenAsset);

                ExternalData data = new ExternalData(identifier, "/"+identifier, widenAsset.getJahiaNodeType(), widenAsset.getProperties());

//                LOGGER.info("***** WidenDataSource ***** getItemByIdentifier data.getId() : "+data.getId());
//                LOGGER.info("***** WidenDataSource ***** getItemByIdentifier data.getPath() : "+data.getPath());
//                LOGGER.info("***** WidenDataSource ***** getItemByIdentifier data.getName() : "+data.getName());
//                LOGGER.info("***** WidenDataSource ***** getItemByIdentifier data.getType() : "+data.getType());
                return data;
            }
        } catch (Exception e) {
            throw new ItemNotFoundException(e);
        }
    }

    @Override
    public ExternalData getItemByPath(String path) throws PathNotFoundException {
//        LOGGER.info("***** WidenDataSource ***** getItemByPath is called with path : "+path);
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
//        LOGGER.info("***** WidenDataSource ***** getSupportedNodeTypes is called ");
        return Sets.newHashSet("jnt:contentFolder", "wdennt:image","wdennt:video","wdennt:pdf","wdennt:document","wdennt:widen");
    }

    @Override
    public boolean isSupportsHierarchicalIdentifiers() {
//        LOGGER.info("***** WidenDataSource ***** isSupportsHierarchicalIdentifiers is called ");
        return false;
    }

    @Override
    public boolean isSupportsUuid() {
//        LOGGER.info("***** WidenDataSource ***** isSupportsUuid is called ");
        return false;
    }

    @Override
    public boolean itemExists(String s) {
//        LOGGER.info("***** WidenDataSource ***** itemExists is called with params : "+s);
        return false;
    }

    private WidenAsset queryWiden(String path, Map<String, String> query) throws RepositoryException {
        LOGGER.info("***** WidenDataSource ***** queryWiden is called for path : "+path+" and query : "+query);
        try {
            String endpoint = wdenStoreMountPoint.getEndpoint();
            String widenSite = wdenStoreMountPoint.getSite();
            String widenToken = wdenStoreMountPoint.getToken();

            HttpsURL url = new HttpsURL(endpoint, 443, path);

            url.setQuery(
                query.keySet().toArray(new String[query.size()]),
                query.values().toArray(new String[query.size()])
            );

            long l = System.currentTimeMillis();
            GetMethod getMethod = new GetMethod(url.toString());

            //NOTE Widen return content in ISO-8859-1 even if Accept-Charset = UTF-8 is set.
            //Need to use appropriate charset later to read the inputstream response.
            getMethod.setRequestHeader(HttpHeaders.AUTHORIZATION,"Bearer "+widenSite+"/"+widenToken);
//            getMethod.setRequestHeader("Content-Type","application/json");
//            getMethod.setRequestHeader("Accept-Charset","ISO-8859-1");
            // getMethod.setRequestHeader("Accept-Charset","UTF-8");

            LOGGER.debug("***** WidenDataSource ***** getMethod.getRequestHeaders : "+Arrays.deepToString(getMethod.getRequestHeaders()));
            try {
                httpClient.executeMethod(getMethod);

                LOGGER.debug("***** WidenDataSource ***** getMethod.getResponseCharSet : "+getMethod.getResponseCharSet());
                LOGGER.debug("***** WidenDataSource ***** getMethod.getResponseBodyAsString : "+getMethod.getResponseBodyAsString());

                BufferedReader streamReader = new BufferedReader(new InputStreamReader(getMethod.getResponseBodyAsStream(),"UTF-8"));
                StringBuilder responseStrBuilder = new StringBuilder();

                String inputStr;
                while ((inputStr = streamReader.readLine()) != null)
                    responseStrBuilder.append(inputStr);

                LOGGER.debug("***** WidenDataSource ***** UTF-8 response : "+responseStrBuilder.toString());
                ObjectMapper mapper = new ObjectMapper();
                WidenAsset widenAsset = mapper.readValue(responseStrBuilder.toString(),WidenAsset.class);
                return widenAsset;
//                return new JSONObject(getMethod.getResponseBodyAsString());
//                return new JSONObject(responseStrBuilder.toString());
            } finally {
                getMethod.releaseConnection();
                LOGGER.info("Request {} executed in {} ms",url, (System.currentTimeMillis() - l));
            }
        } catch (Exception e) {
            LOGGER.error("Error while querying Widen", e);
            throw new RepositoryException(e);
        }
    }
}
