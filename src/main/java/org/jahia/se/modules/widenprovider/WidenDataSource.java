package org.jahia.se.modules.widenprovider;

import com.google.common.collect.Sets;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.config.PersistenceConfiguration;
import net.sf.ehcache.store.MemoryStoreEvictionPolicy;
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

    private static final String ASSET_ENTRY = "assets";
    private static final String FILE_TYPE_IMAGE = "image";
    private static final String FILE_TYPE_VIDEO = "video";
    private static final String FILE_TYPE_PDF = "pdf";
    private static final String CONTENT_TYPE_IMAGE = "wdennt:image";
    private static final String CONTENT_TYPE_VIDEO = "wdennt:video";
    private static final String CONTENT_TYPE_PDF = "wdennt:pdf";
    private static final String CONTENT_TYPE_DOC = "wdennt:document";

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
//        logger.info("***** WidenDataSource ***** start for remote site : "+this.widenSite);
        try {
            if (!ehCacheProvider.getCacheManager().cacheExists("widen-cache")) {

                int maxEntriesLocalHeap = 1000;

                Cache widenCache = new Cache(
                    new CacheConfiguration("widen-cache", maxEntriesLocalHeap)
                    .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.LFU)
                    .eternal(false)
                    .timeToLiveSeconds(180)
                    .timeToIdleSeconds(60)
                    .diskExpiryThreadIntervalSeconds(0)
//                    .persistence(
//                        new PersistenceConfiguration()
//                        .strategy(PersistenceConfiguration.Strategy.LOCALTEMPSWAP)
//                    )
                );
                ehCacheProvider.getCacheManager().addCache(widenCache);
            }
            cache = ehCacheProvider.getCacheManager().getCache("widen-cache");
        } catch (IllegalStateException | CacheException e) {
            logger.error("Error while initializing cache for IMDB", e);
        }
    }


    @Override
    public List<String> getChildren(String s) throws RepositoryException {
        logger.info("***** WidenDataSource ***** getChildren is called with params : "+s);
        List<String> child = new ArrayList<String>();
        return child;
    }

    @Override
    public ExternalData getItemByIdentifier(String identifier) throws ItemNotFoundException {
        logger.info("***** WidenDataSource ***** getItemByIdentifier is called with identifier : "+identifier);
        try {
            if (identifier.equals("root")) {
                return new ExternalData(identifier, "/", "jnt:contentFolder", new HashMap<String, String[]>());
            }else{


                Map<String, String[]> properties = null;
                String contentType = CONTENT_TYPE_DOC;

                try {
                    JSONObject widenAsset;

                    //TODO manage cache here
                    if (cache.get("/"+identifier) != null) {
                        logger.info("***** WidenDataSource ***** get Asset {} from cache",identifier);
                        widenAsset = new JSONObject((String) cache.get("/"+identifier).getObjectValue());
                    } else {
//                        try {
                            String path = "/"+this.widenVersion+"/"+ASSET_ENTRY+"/"+identifier;
                            Map<String, String> query = new LinkedHashMap<String, String>();
                            query.put("expand","embeds,thumbnails,file_properties");
                            //TODO manage language
                            widenAsset = queryWiden(path,query);
                            cache.put(new Element("/"+identifier, widenAsset.toString()));

//                        } catch (RepositoryException | IllegalArgumentException | IllegalStateException | CacheException e) {
//                            logger.error("Error while getting movie", e);
//                            widenAsset = new JSONObject();
//                        }
                    }


//                    logger.info("***** WidenDataSource ***** widenAsset : "+widenAsset);

                    properties = new HashMap<String, String[]>();
                    properties.put("jcr:title", new String[]{widenAsset.getString("filename")});
                    properties.put("wden:id", new String[]{widenAsset.getString("id")});
                    properties.put("wden:externalId", new String[]{widenAsset.getString("external_id")});
                    properties.put("wden:filename", new String[]{widenAsset.getString("filename")});
                    properties.put("wden:createdDate", new String[]{widenAsset.getString("created_date")});
                    properties.put("wden:updatedDate", new String[]{widenAsset.getString("last_update_date")});
                    properties.put("wden:deletedDate", new String[]{widenAsset.optString("deleted_date")});

//                    if(widenAsset.getJSONObject("thumbnails").optJSONObject("160px")!=null)
//                        properties.put("wden:thumbnail", new String[]{widenAsset.optJSONObject("thumbnails").optJSONObject("160px").optString("url")});

                    JSONObject fileProps = widenAsset.getJSONObject("file_properties");
                    String fileType = fileProps.getString("format_type");
                    properties.put("wden:format", new String[]{fileProps.getString("format")});
                    properties.put("wden:type", new String[] {fileType});
                    properties.put("wden:sizeKB", new String[]{fileProps.getString("size_in_kbytes")});

                    properties.put("wden:templatedUrl", new String[]{widenAsset.getJSONObject("embeds").getJSONObject("templated").optString("url")});

                    switch (fileType){
                        case FILE_TYPE_IMAGE :
                            contentType = CONTENT_TYPE_IMAGE;

                            JSONObject imageProps = widenAsset.getJSONObject("file_properties").optJSONObject("image_properties");
//                            logger.info("***** WidenDataSource ***** imageProps : "+imageProps);

                            if(imageProps != null && imageProps.length() != 0){
                                String width = imageProps.optString("width");
                                String height = imageProps.optString("height");
                                String aspectRatio = imageProps.optString("aspect_ratio");

                                if(width!=null && width!="null")
                                    properties.put("wden:width", new String[]{width});
                                if(height!=null && height!="null")
                                    properties.put("wden:height", new String[]{height});
                                if(aspectRatio!=null && aspectRatio!="null")
                                    properties.put("wden:aspectRatio", new String[]{aspectRatio});

//                                Iterator<String> keys = imageProps.keys();
//                                while(keys.hasNext()) {
//                                    String key = keys.next();
////                                    logger.info("***** WidenDataSource ***** put properties["+key+"] with value : "+imageProps.get(key));
//                                    properties.put("wden:"+key, new String[]{imageProps.getString(key)});
//                                }
                            }

                            break;
                        case FILE_TYPE_VIDEO:
                            contentType = CONTENT_TYPE_VIDEO;

                            if(widenAsset.getJSONObject("embeds").optJSONObject("video_player")!=null)
                                properties.put("wden:videoPlayer", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("video_player").optString("url")});

                            if(widenAsset.getJSONObject("embeds").optJSONObject("video_stream")!=null){
                                properties.put("wden:videoStreamURL", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("video_stream").optString("url")});
                                properties.put("wden:videoStreamHTML", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("video_stream").optString("html")});
                            }


                            if(widenAsset.getJSONObject("embeds").optJSONObject("video_poster")!=null)
                                properties.put("wden:videoPoster", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("video_poster").optString("url")});


                            JSONObject videoProps = widenAsset.getJSONObject("file_properties").optJSONObject("video_properties");
//                            logger.info("***** WidenDataSource ***** videoProps : "+videoProps);
                            if(videoProps != null && videoProps.length() != 0){

                                String width = videoProps.optString("width");
                                String height = videoProps.optString("height");
                                String aspectRatio = videoProps.optString("aspect_ratio");
                                String duration = videoProps.optString("duration");

                                if(width!=null && width!="null")
                                    properties.put("wden:width", new String[]{width});
                                if(height!=null && height!="null")
                                    properties.put("wden:height", new String[]{height});
                                if(aspectRatio!=null && aspectRatio!="null")
                                    properties.put("wden:aspectRatio", new String[]{aspectRatio});
                                if(duration!=null && duration!="null")
                                    properties.put("wden:duration", new String[]{duration});
                            }

                            break;
                        case FILE_TYPE_PDF:
                            contentType = CONTENT_TYPE_PDF;

                            if(widenAsset.getJSONObject("embeds").optJSONObject("document_html5_viewer")!=null)
                                properties.put("wden:viewerHtml5", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("document_html5_viewer").optString("url")});

                            if(widenAsset.getJSONObject("embeds").optJSONObject("document_viewer")!=null)
                                properties.put("wden:viewer", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("document_viewer").optString("url")});

                            if(widenAsset.getJSONObject("embeds").optJSONObject("document_thumbnail")!=null)
                                properties.put("wden:docThumbnail", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("document_thumbnail").optString("url")});

                            if(widenAsset.getJSONObject("embeds").optJSONObject("original")!=null) {
                                properties.put("wden:docURL", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("original").optString("url")});
                                properties.put("wden:docHTMLLink", new String[]{widenAsset.getJSONObject("embeds").optJSONObject("original").optString("html")});
                            }
                            break;
                    }

//                    logger.info("***** WidenDataSource ***** properties : "+properties);

                } catch (JSONException | RepositoryException e) {
                    logger.error("Error while getting widenAsset", e);
                }
                ExternalData data = new ExternalData(identifier, "/"+identifier, contentType, properties);

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
//        logger.info("***** WidenDataSource ***** getItemByPath is called with path : "+path);
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
//        logger.info("***** WidenDataSource ***** getSupportedNodeTypes is called ");
        return Sets.newHashSet("jnt:contentFolder", "wdennt:image","wdennt:video","wdennt:pdf","wdennt:document","wdennt:widen");
    }

    @Override
    public boolean isSupportsHierarchicalIdentifiers() {
//        logger.info("***** WidenDataSource ***** isSupportsHierarchicalIdentifiers is called ");
        return false;
    }

    @Override
    public boolean isSupportsUuid() {
//        logger.info("***** WidenDataSource ***** isSupportsUuid is called ");
        return false;
    }

    @Override
    public boolean itemExists(String s) {
//        logger.info("***** WidenDataSource ***** itemExists is called with params : "+s);
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
            logger.error("Error while querying Widen", e);
            throw new RepositoryException(e);
        }
    }


}
