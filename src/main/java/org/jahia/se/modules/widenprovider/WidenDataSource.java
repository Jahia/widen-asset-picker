package org.jahia.se.modules.widenprovider;

import com.google.common.collect.Sets;
import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.jahia.modules.external.ExternalData;
import org.jahia.modules.external.ExternalDataSource;
import org.jahia.services.cache.ehcache.EhCacheProvider;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.ItemNotFoundException;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import java.util.*;

public class WidenDataSource implements ExternalDataSource {

    private static final Logger logger = LoggerFactory.getLogger(WidenDataSource.class);

    private static String ASSET_ENTRY = "assets";
    private static String widenEndpoint;
    private static String widenSite;
    private static String widenToken;
    private static String widenVersion;

    private EhCacheProvider ehCacheProvider;
    private Ehcache cache;
    private HttpClient httpClient;

    public WidenDataSource() {
        // instantiate HttpClient
        httpClient = new HttpClient();
    }

    public void setWidenEndpoint(String widenEndpoint) {
        this.widenEndpoint = widenEndpoint;
    }

    public void setWidenSite(String widenSite) {
        this.widenSite = widenSite;
    }

    public void setWidenToken(String widenToken) {
        this.widenToken = widenToken;
    }

    public void setWidenVersion(String widenVersion) {
        this.widenVersion = widenVersion;
    }

    public void setCacheProvider(EhCacheProvider ehCacheProvider) {
        this.ehCacheProvider = ehCacheProvider;
    }

    public void setHttpClient(HttpClient httpClient) {
        this.httpClient = httpClient;
    }

    public void start() {
        logger.info("***** WidenDataSource ***** start for remote site : "+this.widenSite);
        try {
            if (!ehCacheProvider.getCacheManager().cacheExists("widen-cache")) {
                ehCacheProvider.getCacheManager().addCache("widen-cache");
            }
            cache = ehCacheProvider.getCacheManager().getCache("widen-cache");
        } catch (IllegalStateException | CacheException e) {
            logger.error("Error while initializing cache for IMDB", e);
        }
    }


    @Override
    public List<String> getChildren(String s) throws RepositoryException {
        logger.info("***** WidenDataSource ***** getChildren is called with params : "+s);
        return null;
    }

    @Override
    public ExternalData getItemByIdentifier(String identifier) throws ItemNotFoundException {
        logger.info("***** WidenDataSource ***** getItemByIdentifier is called with identifier : "+identifier);
        try {
            if (identifier.equals("root")) {
                return new ExternalData(identifier, "/", "jnt:contentFolder", new HashMap<String, String[]>());
            }else{
                //TODO manage cache here
                Map<String, String[]> properties = null;

                String path = "/"+this.widenVersion+"/"+ASSET_ENTRY+"/"+identifier;

                Map<String, String> query = new LinkedHashMap<String, String>();
                query.put("expand","embeds,thumbnails,file_properties");

                try {

                    JSONObject asset = queryWiden(path,query);
                    logger.info("***** WidenDataSource ***** asset : "+asset);
                    properties = new HashMap<String, String[]>();
                    properties.put("jcr:title", new String[]{asset.getString("filename")});
                    properties.put("wden:id", new String[]{asset.getString("id")});
                    properties.put("wden:external_id", new String[]{asset.getString("external_id")});
                    properties.put("wden:filename", new String[]{asset.getString("filename")});
                    properties.put("wden:created_date", new String[]{asset.getString("created_date")});
                    properties.put("wden:last_update_date", new String[]{asset.getString("last_update_date")});
                    properties.put("wden:deleted_date", new String[]{asset.optString("deleted_date")});
                    properties.put("wden:thumbnail", new String[]{asset.optJSONObject("thumbnails").optJSONObject("160px").optString("url")});
                    properties.put("wden:embed", new String[]{asset.getJSONObject("embeds").getJSONObject("templated").optString("url")});

                    properties.put("wden:format", new String[]{asset.getJSONObject("file_properties").getString("format")});
                    properties.put("wden:type", new String[]{asset.getJSONObject("file_properties").getString("format_type")});
                    properties.put("wden:sizeKB", new String[]{asset.getJSONObject("file_properties").getString("size_in_kbytes")});

//                    JSONObject vProperties = asset.getJSONObject("file_properties").optJSONObject("video_properties");
//                    JSONObject iProperties = asset.getJSONObject("file_properties").optJSONObject("image_properties");
//
//                    if(iProperties.length() != 0){
//                        Iterator<String> keys = iProperties.keys();
//                        while(keys.hasNext()) {
//                            String key = keys.next();
//                            properties.put("wden:"+key, new String[]{iProperties.getString(key)});
//                        }
//                    }
//
//                    properties.put("wden:", new String[]{asset.getJSONObject("file_properties").optJSONObject("video_properties").getString("format")});


                } catch (JSONException | RepositoryException e) {
                    logger.error("Error while getting asset", e);
                }
                ExternalData data = new ExternalData(identifier, "/"+identifier, "wdennt:asset", properties);

//                logger.info("***** WidenDataSource ***** getItemByIdentifier data.getId() : "+data.getId());
//                logger.info("***** WidenDataSource ***** getItemByIdentifier data.getPath() : "+data.getPath());
//                logger.info("***** WidenDataSource ***** getItemByIdentifier data.getName() : "+data.getName());
//                logger.info("***** WidenDataSource ***** getItemByIdentifier data.getType() : "+data.getType());
                return data;
            }
        } catch (Exception e) {
            throw new ItemNotFoundException(e);
        }
    }

    @Override
    public ExternalData getItemByPath(String path) throws PathNotFoundException {
        logger.info("***** WidenDataSource ***** getItemByPath is called with path : "+path);
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
        logger.info("***** WidenDataSource ***** getSupportedNodeTypes is called ");
        return Sets.newHashSet("jnt:contentFolder", "wdennt:asset");//"wdennt:assetProperties", "wdennt:fileProperties"
    }

    @Override
    public boolean isSupportsHierarchicalIdentifiers() {
        logger.info("***** WidenDataSource ***** isSupportsHierarchicalIdentifiers is called ");
        return false;
    }

    @Override
    public boolean isSupportsUuid() {
        logger.info("***** WidenDataSource ***** isSupportsUuid is called ");
        return false;
    }

    @Override
    public boolean itemExists(String s) {
        logger.info("***** WidenDataSource ***** itemExists is called with params : "+s);
        return false;
    }

    private JSONObject queryWiden(String path, Map<String, String> query) throws RepositoryException {
        logger.info("***** WidenDataSource ***** queryWiden is called for path : "+path+" and query : "+query);
        try {
            HttpsURL url = new HttpsURL(this.widenEndpoint, 443, path);

//            Map<String, String> m = new LinkedHashMap<String, String>();
//            for (int i = 0; i < params.length; i += 2) {
//                m.put(params[i], params[i + 1]);
//            }

            url.setQuery(query.keySet().toArray(new String[query.size()]), query.values().toArray(new String[query.size()]));
            long l = System.currentTimeMillis();
            GetMethod getMethod = new GetMethod(url.toString());
            getMethod.setRequestHeader(new Header("Authorization","Bearer "+this.widenSite+"/"+this.widenToken));
            try {
                httpClient.executeMethod(getMethod);
                return new JSONObject(getMethod.getResponseBodyAsString());
            } finally {
                getMethod.releaseConnection();
                logger.info("Request {} executed in {} ms",url, (System.currentTimeMillis() - l));
            }
        } catch (Exception e) {
            logger.error("Error while querying TMDB", e);
            throw new RepositoryException(e);
        }
    }


}
