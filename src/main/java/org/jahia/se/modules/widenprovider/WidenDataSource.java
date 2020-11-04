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
                //TODO manage cache here
                Map<String, String[]> properties = null;
                String contentType = CONTENT_TYPE_DOC;
                String path = "/"+this.widenVersion+"/"+ASSET_ENTRY+"/"+identifier;

                Map<String, String> query = new LinkedHashMap<String, String>();
                query.put("expand","embeds,thumbnails,file_properties");

                try {

                    JSONObject asset = queryWiden(path,query);
//                    logger.info("***** WidenDataSource ***** asset : "+asset);

                    properties = new HashMap<String, String[]>();
                    properties.put("jcr:title", new String[]{asset.getString("filename")});
                    properties.put("wden:id", new String[]{asset.getString("id")});
                    properties.put("wden:externalId", new String[]{asset.getString("external_id")});
                    properties.put("wden:filename", new String[]{asset.getString("filename")});
                    properties.put("wden:createdDate", new String[]{asset.getString("created_date")});
                    properties.put("wden:updatedDate", new String[]{asset.getString("last_update_date")});
                    properties.put("wden:deletedDate", new String[]{asset.optString("deleted_date")});

//                    if(asset.getJSONObject("thumbnails").optJSONObject("160px")!=null)
//                        properties.put("wden:thumbnail", new String[]{asset.optJSONObject("thumbnails").optJSONObject("160px").optString("url")});

                    JSONObject fileProps = asset.getJSONObject("file_properties");
                    String fileType = fileProps.getString("format_type");
                    properties.put("wden:format", new String[]{fileProps.getString("format")});
                    properties.put("wden:type", new String[] {fileType});
                    properties.put("wden:sizeKB", new String[]{fileProps.getString("size_in_kbytes")});

                    properties.put("wden:templatedUrl", new String[]{asset.getJSONObject("embeds").getJSONObject("templated").optString("url")});

                    switch (fileType){
                        case FILE_TYPE_IMAGE :
                            contentType = CONTENT_TYPE_IMAGE;

                            JSONObject imageProps = asset.getJSONObject("file_properties").optJSONObject("image_properties");
//                            logger.info("***** WidenDataSource ***** imageProps : "+imageProps);

                            if(imageProps != null && imageProps.length() != 0){
                                properties.put("wden:width", new String[]{imageProps.optString("width")});
                                properties.put("wden:height", new String[]{imageProps.optString("height")});
                                properties.put("wden:aspectRatio", new String[]{imageProps.optString("aspect_ratio")});

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

                            if(asset.getJSONObject("embeds").optJSONObject("video_player")!=null)
                                properties.put("wden:videoPlayer", new String[]{asset.getJSONObject("embeds").optJSONObject("video_player").optString("url")});

                            if(asset.getJSONObject("embeds").optJSONObject("video_stream")!=null){
                                properties.put("wden:videoStreamURL", new String[]{asset.getJSONObject("embeds").optJSONObject("video_stream").optString("url")});
                                properties.put("wden:videoStreamHTML", new String[]{asset.getJSONObject("embeds").optJSONObject("video_stream").optString("html")});
                            }


                            if(asset.getJSONObject("embeds").optJSONObject("video_poster")!=null)
                                properties.put("wden:videoPoster", new String[]{asset.getJSONObject("embeds").optJSONObject("video_poster").optString("url")});


                            JSONObject videoProps = asset.getJSONObject("file_properties").optJSONObject("video_properties");
//                            logger.info("***** WidenDataSource ***** videoProps : "+videoProps);
                            if(videoProps != null && videoProps.length() != 0){
                                properties.put("wden:width", new String[]{videoProps.optString("width")});
                                properties.put("wden:height", new String[]{videoProps.optString("height")});
                                properties.put("wden:aspectRatio", new String[]{videoProps.optString("aspect_ratio")});
                                properties.put("wden:duration", new String[]{videoProps.optString("duration")});
                            }

                            break;
                        case FILE_TYPE_PDF:
                            contentType = CONTENT_TYPE_PDF;

                            if(asset.getJSONObject("embeds").optJSONObject("document_html5_viewer")!=null)
                                properties.put("wden:viewerHtml5", new String[]{asset.getJSONObject("embeds").optJSONObject("document_html5_viewer").optString("url")});

                            if(asset.getJSONObject("embeds").optJSONObject("document_viewer")!=null)
                                properties.put("wden:viewer", new String[]{asset.getJSONObject("embeds").optJSONObject("document_viewer").optString("url")});

                            if(asset.getJSONObject("embeds").optJSONObject("document_thumbnail")!=null)
                                properties.put("wden:docThumbnail", new String[]{asset.getJSONObject("embeds").optJSONObject("document_thumbnail").optString("url")});

                            if(asset.getJSONObject("embeds").optJSONObject("original")!=null) {
                                properties.put("wden:docURL", new String[]{asset.getJSONObject("embeds").optJSONObject("original").optString("url")});
                                properties.put("wden:docHTMLLink", new String[]{asset.getJSONObject("embeds").optJSONObject("original").optString("html")});
                            }
                            break;
                    }

//                    logger.info("***** WidenDataSource ***** properties : "+properties);

                } catch (JSONException | RepositoryException e) {
                    logger.error("Error while getting asset", e);
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
