package org.jahia.se.modules.edp.dam.widen.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class WidenAssetDeserializer extends StdDeserializer<WidenAsset> {
    private static final String PREFIX = "wden:";

    private static final String FILE_TYPE_IMAGE = "image";
    private static final String FILE_TYPE_VIDEO = "video";
    private static final String FILE_TYPE_PDF = "pdf";

    private static final String CONTENT_TYPE_IMAGE = "wdennt:image";
    private static final String CONTENT_TYPE_VIDEO = "wdennt:video";
    private static final String CONTENT_TYPE_PDF = "wdennt:pdf";
    private static final String CONTENT_TYPE_DOC = "wdennt:document";

    private static final String TEMPLATED_URL_PATH = "/embeds/templated/url";

    private static final String THUMBNAIL_URL_PATH = "/thumbnails/300px/url";

    private static final String FILE_FORMAT_PATH =      "/file_properties/format";
    private static final String FILE_TYPE_PATH =        "/file_properties/format_type";
    private static final String FILE_SIZE_PATH =        "/file_properties/size_in_kbytes";
    private static final String FILE_IMAGE_PROPS_PATH = "/file_properties/image_properties";
    private static final String FILE_VIDEO_PROPS_PATH = "/file_properties/video_properties";

    private static final String VIDEO_PLAYER_URL_PATH =     "/embeds/video_player/url";
    private static final String VIDEO_STREAM_URL_PATH =     "/embeds/video_stream/url";
    private static final String VIDEO_STREAM_HTML_PATH =    "/embeds/video_stream/html";
    private static final String VIDEO_POSTER_URL_PATH =     "/embeds/video_poster/url";

    private static final String DOCUMENT_HTML5_VIEWER_URL_PATH =    "/embeds/document_html5_viewer/url";
    private static final String DOCUMENT_VIEWER_URL_PATH =          "/embeds/document_viewer/url";
    private static final String DOCUMENT_THUMBNAIL_URL_PATH =       "/embeds/document_thumbnail/url";
    private static final String DOCUMENT_ORIGINAL_URL_PATH =        "/embeds/original/url";
    private static final String DOCUMENT_ORIGINAL_HTML_LINK_PATH =  "/embeds/original/url";

    public WidenAssetDeserializer() {
        this(null);
    }

    public WidenAssetDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public WidenAsset deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
        throws IOException, JsonProcessingException {
        JsonNode widenNode = jsonParser.getCodec().readTree(jsonParser);
        WidenAsset widenAsset = new WidenAsset();

        widenAsset.addProperties(PREFIX+"id",widenNode.get("id").textValue());
        widenAsset.setId(widenNode.get("id").textValue());
        widenAsset.addProperties(PREFIX+"externalId",widenNode.get("external_id").textValue());
        widenAsset.addProperties(PREFIX+"filename",widenNode.get("filename").textValue());
        widenAsset.addProperties(PREFIX+"createdDate",widenNode.get("created_date").textValue());
        widenAsset.addProperties(PREFIX+"updatedDate",widenNode.get("last_update_date").textValue());
        widenAsset.addProperties(PREFIX+"deletedDate",widenNode.get("deleted_date").textValue());

        JsonNode templatedURLNode = widenNode.at(TEMPLATED_URL_PATH);
        if(!(templatedURLNode==null || templatedURLNode.isNull()))
            widenAsset.addProperties(PREFIX+"templatedUrl",templatedURLNode.textValue());
//        widenAsset.addProperties(PREFIX+"templatedUrl",widenNode.get("embeds").get("templated").get("url").textValue());

        JsonNode thumbnailURLNode = widenNode.at(THUMBNAIL_URL_PATH);
        if(!(thumbnailURLNode==null || thumbnailURLNode.isNull()))
            widenAsset.addProperties(PREFIX+"thumbnail",thumbnailURLNode.textValue());
//            widenAsset.addProperties(PREFIX+"thumbnail",widenNode.get("thumbnails").get(THUMBNAIL_SIZE_KEY).get("url").textValue());

//        widenAsset.setId(widenNode.get("id").textValue());
//        widenAsset.setExternalId(widenNode.get("external_id").textValue());
//        widenAsset.setFilename(widenNode.get("filename").textValue());
//        widenAsset.setCreatedDate(widenNode.get("created_date").textValue());
//        widenAsset.setUpdatedDate(widenNode.get("last_update_date").textValue());
//        widenAsset.setDeletedDate(widenNode.get("deleted_date").textValue());
//
//        widenAsset.setTemplatedUrl(widenNode.get("embeds").get("templated").get("url").textValue());
//
//        if(widenNode.get("thumbnails").get(THUMBNAIL_SIZE_KEY)!=null)
//            widenAsset.setThumbnail(widenNode.get("thumbnails").get(THUMBNAIL_SIZE_KEY).get("url").textValue());

//        JsonNode filePropsNode = widenNode.get("file_properties");
        String fileType = widenNode.at(FILE_TYPE_PATH).textValue();
        widenAsset.addProperties(PREFIX+"format",widenNode.at(FILE_FORMAT_PATH).textValue());
        widenAsset.addProperties(PREFIX+"type",fileType);
        widenAsset.addProperties(PREFIX+"sizeKB",widenNode.at(FILE_SIZE_PATH).longValue());

//        widenAsset.setFormat(filePropsNode.get("format").textValue());
//        widenAsset.setType(fileType);
//        widenAsset.setSizeKB(filePropsNode.get("size_in_kbytes").longValue());

        switch (fileType){
            case FILE_TYPE_IMAGE :
                widenAsset.setJahiaNodeType(CONTENT_TYPE_IMAGE);
                extendFileProps(widenNode,widenAsset,FILE_IMAGE_PROPS_PATH);

//                JsonNode imageProps = widenNode.get("file_properties").get("image_properties");
//                if(!imageProps.isNull()){
//                    Double width = imageProps.get("width").doubleValue();
//                    Double height = imageProps.get("height").doubleValue();
//                    Double aspectRatio = imageProps.get("aspect_ratio").doubleValue();
//
//                    if(!width.isNaN())
//                        widenAsset.setWidth(width);
//                    if(!height.isNaN())
//                        widenAsset.setHeight(height);
//                    if(!aspectRatio.isNaN())
//                        widenAsset.setAspectRatio(aspectRatio);
//                }
                break;
            case FILE_TYPE_VIDEO:
                widenAsset.setJahiaNodeType(CONTENT_TYPE_VIDEO);
                extendFileProps(widenNode,widenAsset,FILE_VIDEO_PROPS_PATH);

//                JsonNode playerNode = widenNode.get("embeds").get("video_player");
//                JsonNode streamNode = widenNode.get("embeds").get("video_stream");
//                JsonNode posterNode = widenNode.get("embeds").get("video_poster");

                JsonNode playerURLNode = widenNode.at(VIDEO_PLAYER_URL_PATH);
                JsonNode streamURLNode = widenNode.at(VIDEO_STREAM_URL_PATH);
                JsonNode streamHTMLNode = widenNode.at(VIDEO_STREAM_HTML_PATH);
                JsonNode posterURLNode = widenNode.at(VIDEO_POSTER_URL_PATH);

                if(!(playerURLNode==null || playerURLNode.isNull()))
                    widenAsset.addProperties(PREFIX+"videoPlayer",playerURLNode.textValue());
//                    widenAsset.setVideoPlayer(playerNode.get("url").textValue());

                if(!(streamURLNode == null || streamURLNode.isNull()))
                    widenAsset.addProperties(PREFIX+"videoStreamURL",streamURLNode.textValue());

                if(!(streamHTMLNode == null || streamHTMLNode.isNull()))
                    widenAsset.addProperties(PREFIX+"videoStreamHTML",streamHTMLNode.textValue());

//                    widenAsset.setVideoStreamURL(streamNode.get("url").textValue());
//                    widenAsset.setVideoStreamHTML(streamNode.get("html").textValue());

                if(!(posterURLNode == null || posterURLNode.isNull()))
                    widenAsset.addProperties(PREFIX+"videoPoster",posterURLNode.textValue());

//                    widenAsset.setVideoPlayer(posterNode.get("url").textValue());

//                JsonNode videoProps = widenNode.get("file_properties").get("video_properties");
//                if(!videoProps.isNull()){
//                    Double width = videoProps.get("width").doubleValue();
//                    Double height = videoProps.get("height").doubleValue();
//                    Double aspectRatio = videoProps.get("aspect_ratio").doubleValue();
//
//                    if(!width.isNaN())
//                        widenAsset.setWidth(width);
//                    if(!height.isNaN())
//                        widenAsset.setHeight(height);
//                    if(!aspectRatio.isNaN())
//                        widenAsset.setAspectRatio(aspectRatio);
//                }

                break;
            case FILE_TYPE_PDF:
                widenAsset.setJahiaNodeType(CONTENT_TYPE_PDF);

//                JsonNode html5ViewerNode = widenNode.get("embeds").get("document_html5_viewer");
//                JsonNode viewerNode = widenNode.get("embeds").get("document_viewer");
//                JsonNode thumbnailNode = widenNode.get("embeds").get("document_thumbnail");
//                JsonNode originalNode = widenNode.get("embeds").get("original");

                JsonNode html5ViewerURLNode = widenNode.at(DOCUMENT_HTML5_VIEWER_URL_PATH);
                JsonNode viewerURLNode = widenNode.at(DOCUMENT_VIEWER_URL_PATH);
                JsonNode docThumbnailURLNode = widenNode.at(DOCUMENT_THUMBNAIL_URL_PATH);
                JsonNode originalURLNode = widenNode.at(DOCUMENT_ORIGINAL_URL_PATH);
                JsonNode originalHTMLLinkNode = widenNode.at(DOCUMENT_ORIGINAL_HTML_LINK_PATH);

                if(!(html5ViewerURLNode==null || html5ViewerURLNode.isNull()))
                    widenAsset.addProperties(PREFIX+"viewerHtml5",html5ViewerURLNode.textValue());
//                    widenAsset.setViewerHtml5(html5ViewerNode.get("url").textValue());

                if(!(viewerURLNode==null || viewerURLNode.isNull()))
                    widenAsset.addProperties(PREFIX+"viewer",viewerURLNode.textValue());
//                    widenAsset.setViewer(viewerNode.get("url").textValue());

                if(!(docThumbnailURLNode==null || docThumbnailURLNode.isNull()))
                    widenAsset.addProperties(PREFIX+"docThumbnail",docThumbnailURLNode.textValue());
//                    widenAsset.setDocThumbnail(thumbnailNode.get("url").textValue());

                if(!(originalURLNode==null || originalURLNode.isNull()))
                    widenAsset.addProperties(PREFIX+"docURL",originalURLNode.textValue());

                if(!(originalHTMLLinkNode==null || originalHTMLLinkNode.isNull()))
                    widenAsset.addProperties(PREFIX+"docHTMLLink",originalHTMLLinkNode.textValue());
//                    widenAsset.setDocURL(originalNode.get("url").textValue());
//                    widenAsset.setDocHTMLLink(originalNode.get("html").textValue());
                break;
            default:
                widenAsset.setJahiaNodeType(CONTENT_TYPE_DOC);
                break;
        }


        return widenAsset;
    }

    private void extendFileProps(JsonNode rootNode, WidenAsset widenAsset, String path){
        if( !(path == null || path.length() ==0) ){
            JsonNode propsNode = rootNode.at(path);
            if(!(propsNode == null || propsNode.isNull()) ){
                Double width = propsNode.get("width").doubleValue();
                Double height = propsNode.get("height").doubleValue();
                Double aspectRatio = propsNode.get("aspect_ratio").doubleValue();

                JsonNode durationNode = propsNode.get("duration");
                if(!(durationNode == null || durationNode.isNull()))
                    widenAsset.addProperties(PREFIX+"duration",durationNode.doubleValue());

                if( !(width==null || width.isNaN()) )
                    widenAsset.addProperties(PREFIX+"width",width);
//                    widenAsset.setWidth(width);
                if( !(height==null || height.isNaN()) )
                    widenAsset.addProperties(PREFIX+"height",height);
//                    widenAsset.setHeight(height);
                if( !(aspectRatio==null || aspectRatio.isNaN()))
                    widenAsset.addProperties(PREFIX+"aspectRatio",aspectRatio);
//                    widenAsset.setAspectRatio(aspectRatio);

            }
        }
    }
}
