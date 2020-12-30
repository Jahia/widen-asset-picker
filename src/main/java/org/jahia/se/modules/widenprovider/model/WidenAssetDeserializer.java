package org.jahia.se.modules.widenprovider.model;

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
    private static final String DOCUMENT_ORIGINAL_HTML_LINK_PATH =  "/embeds/original/html";

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

        widenAsset.setId(widenNode.get("id").textValue());
        widenAsset.addProperty(PREFIX+"id",widenNode.get("id").textValue());
        widenAsset.addProperty(PREFIX+"externalId",widenNode.get("external_id").textValue());
        widenAsset.addProperty(PREFIX+"filename",widenNode.get("filename").textValue());
        widenAsset.addProperty("jcr:title",widenNode.get("filename").textValue());
        widenAsset.addProperty(PREFIX+"createdDate",widenNode.get("created_date").textValue());
        widenAsset.addProperty(PREFIX+"updatedDate",widenNode.get("last_update_date").textValue());
        widenAsset.addProperty(PREFIX+"deletedDate",widenNode.get("deleted_date").textValue());

        JsonNode templatedURLNode = widenNode.at(TEMPLATED_URL_PATH);
        if(!(templatedURLNode==null || templatedURLNode.isNull()))
            widenAsset.addProperty(PREFIX+"templatedUrl",templatedURLNode.textValue());

        JsonNode thumbnailURLNode = widenNode.at(THUMBNAIL_URL_PATH);
        if(!(thumbnailURLNode==null || thumbnailURLNode.isNull()))
            widenAsset.addProperty(PREFIX+"thumbnail",thumbnailURLNode.textValue());

        String fileType = widenNode.at(FILE_TYPE_PATH).textValue();
        widenAsset.addProperty(PREFIX+"format",widenNode.at(FILE_FORMAT_PATH).textValue());
        widenAsset.addProperty(PREFIX+"type",fileType);
        widenAsset.addProperty(PREFIX+"sizeKB",widenNode.at(FILE_SIZE_PATH).longValue());

        switch (fileType){
            case FILE_TYPE_IMAGE :
                widenAsset.setJahiaNodeType(CONTENT_TYPE_IMAGE);
                extendFileProps(widenNode,widenAsset,FILE_IMAGE_PROPS_PATH);
                break;

            case FILE_TYPE_VIDEO:
                widenAsset.setJahiaNodeType(CONTENT_TYPE_VIDEO);
                extendFileProps(widenNode,widenAsset,FILE_VIDEO_PROPS_PATH);

                JsonNode playerURLNode = widenNode.at(VIDEO_PLAYER_URL_PATH);
                JsonNode streamURLNode = widenNode.at(VIDEO_STREAM_URL_PATH);
                JsonNode streamHTMLNode = widenNode.at(VIDEO_STREAM_HTML_PATH);
                JsonNode posterURLNode = widenNode.at(VIDEO_POSTER_URL_PATH);

                if(!(playerURLNode==null || playerURLNode.isNull()))
                    widenAsset.addProperty(PREFIX+"videoPlayer",playerURLNode.textValue());

                if(!(streamURLNode == null || streamURLNode.isNull()))
                    widenAsset.addProperty(PREFIX+"videoStreamURL",streamURLNode.textValue());

                if(!(streamHTMLNode == null || streamHTMLNode.isNull()))
                    widenAsset.addProperty(PREFIX+"videoStreamHTML",streamHTMLNode.textValue());

                if(!(posterURLNode == null || posterURLNode.isNull()))
                    widenAsset.addProperty(PREFIX+"videoPoster",posterURLNode.textValue());
                break;

            case FILE_TYPE_PDF:
                widenAsset.setJahiaNodeType(CONTENT_TYPE_PDF);

                JsonNode html5ViewerURLNode = widenNode.at(DOCUMENT_HTML5_VIEWER_URL_PATH);
                JsonNode viewerURLNode = widenNode.at(DOCUMENT_VIEWER_URL_PATH);
                JsonNode docThumbnailURLNode = widenNode.at(DOCUMENT_THUMBNAIL_URL_PATH);
                JsonNode originalURLNode = widenNode.at(DOCUMENT_ORIGINAL_URL_PATH);
                JsonNode originalHTMLLinkNode = widenNode.at(DOCUMENT_ORIGINAL_HTML_LINK_PATH);

                if(!(html5ViewerURLNode==null || html5ViewerURLNode.isNull()))
                    widenAsset.addProperty(PREFIX+"viewerHtml5",html5ViewerURLNode.textValue());

                if(!(viewerURLNode==null || viewerURLNode.isNull()))
                    widenAsset.addProperty(PREFIX+"viewer",viewerURLNode.textValue());

                if(!(docThumbnailURLNode==null || docThumbnailURLNode.isNull()))
                    widenAsset.addProperty(PREFIX+"docThumbnail",docThumbnailURLNode.textValue());

                if(!(originalURLNode==null || originalURLNode.isNull()))
                    widenAsset.addProperty(PREFIX+"docURL",originalURLNode.textValue());

                if(!(originalHTMLLinkNode==null || originalHTMLLinkNode.isNull()))
                    widenAsset.addProperty(PREFIX+"docHTMLLink",originalHTMLLinkNode.textValue());
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
                    widenAsset.addProperty(PREFIX+"duration",durationNode.doubleValue());

                if( !(width==null || width.isNaN()) )
                    widenAsset.addProperty(PREFIX+"width",width);

                if( !(height==null || height.isNaN()) )
                    widenAsset.addProperty(PREFIX+"height",height);

                if( !(aspectRatio==null || aspectRatio.isNaN()))
                    widenAsset.addProperty(PREFIX+"aspectRatio",aspectRatio);
            }
        }
    }
}
