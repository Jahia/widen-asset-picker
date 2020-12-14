package org.jahia.se.modules.edp.dam.widen;

import com.google.common.collect.Sets;
import net.sf.ehcache.Element;
import org.apache.commons.httpclient.HttpsURL;
import org.apache.commons.httpclient.methods.GetMethod;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.external.ExternalData;
import org.jahia.modules.external.ExternalDataSource;
import org.jahia.osgi.BundleUtils;
import org.jahia.se.modules.edp.dam.widen.cache.WidenCacheManager;
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
    private static final String FILE_TYPE_IMAGE = "image";
    private static final String FILE_TYPE_VIDEO = "video";
    private static final String FILE_TYPE_PDF = "pdf";
    private static final String CONTENT_TYPE_IMAGE = "wdennt:image";
    private static final String CONTENT_TYPE_VIDEO = "wdennt:video";
    private static final String CONTENT_TYPE_PDF = "wdennt:pdf";
    private static final String CONTENT_TYPE_DOC = "wdennt:document";

    private WidenCacheManager widenCacheManager;

    public MountPoint getStoreMountPoint() {
        return wdenStoreMountPoint;
    }
    
    private MountPoint wdenStoreMountPoint;
    private JahiaTemplatesPackage jahiaTemplatesPackage;

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


                Map<String, String[]> properties = null;
                String contentType = CONTENT_TYPE_DOC;

                try {
                    JSONObject widenAsset;

                    //TODO manage cache here
                    if (cache.get("/"+identifier) != null) {
                        LOGGER.info("***** WidenDataSource ***** get Asset {} from cache",identifier);
                        widenAsset = new JSONObject((String) cache.get("/"+identifier).getObjectValue());
                    } else {
                        String path = "/"+this.widenVersion+"/"+ASSET_ENTRY+"/"+identifier;
                        Map<String, String> query = new LinkedHashMap<String, String>();
                        query.put("expand","embeds,thumbnails,file_properties");
                        //TODO manage language
                        widenAsset = queryWiden(path,query);
                        cache.put(new Element("/"+identifier, widenAsset.toString()));
                    }

                    LOGGER.debug("***** WidenDataSource ***** widenAsset : "+widenAsset);

                    properties = new HashMap<String, String[]>();
                    properties.put("jcr:title", new String[]{widenAsset.getString("filename")});
                    properties.put("wden:id", new String[]{widenAsset.getString("id")});
                    properties.put("wden:externalId", new String[]{widenAsset.getString("external_id")});
                    properties.put("wden:filename", new String[]{widenAsset.getString("filename")});
                    properties.put("wden:createdDate", new String[]{widenAsset.getString("created_date")});
                    properties.put("wden:updatedDate", new String[]{widenAsset.getString("last_update_date")});
                    properties.put("wden:deletedDate", new String[]{widenAsset.optString("deleted_date")});

                    if(widenAsset.getJSONObject("thumbnails").optJSONObject("300px")!=null)
                        properties.put("wden:thumbnail", new String[]{widenAsset.optJSONObject("thumbnails").optJSONObject("300px").optString("url")});

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
//                            LOGGER.info("***** WidenDataSource ***** imageProps : "+imageProps);

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
//                            LOGGER.info("***** WidenDataSource ***** videoProps : "+videoProps);
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

//                    LOGGER.info("***** WidenDataSource ***** properties : "+properties);

                } catch (JSONException | RepositoryException e) {
                    LOGGER.error("Error while getting widenAsset", e);
                }
                ExternalData data = new ExternalData(identifier, "/"+identifier, contentType, properties);

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

    private JSONObject queryWiden(String path, Map<String, String> query) throws RepositoryException {
        LOGGER.info("***** WidenDataSource ***** queryWiden is called for path : "+path+" and query : "+query);
        try {
            HttpsURL url = new HttpsURL(this.widenEndpoint, 443, path);

//            Map<String, String> m = new LinkedHashMap<String, String>();
//            for (int i = 0; i < params.length; i += 2) {
//                m.put(params[i], params[i + 1]);
//            }

            url.setQuery(query.keySet().toArray(new String[query.size()]), query.values().toArray(new String[query.size()]));

            long l = System.currentTimeMillis();
            GetMethod getMethod = new GetMethod(url.toString());

            //NOTE Widen return content in ISO-8859-1 even if Accept-Charset = UTF-8 is set.
            //Need to use appropriate charset later to read the inputstream response.
            getMethod.setRequestHeader("Authorization","Bearer "+this.widenSite+"/"+this.widenToken);
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

//                return new JSONObject(getMethod.getResponseBodyAsString());
                return new JSONObject(responseStrBuilder.toString());
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
