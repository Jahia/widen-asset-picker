package org.jahia.se.modules.edp.dam.widen.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class WidenAssetDeserializer extends StdDeserializer<WidenAsset> {
    private static final String PREFIX = "wden:";
    private static final String THUMBNAIL_SIZE_KEY = "300px";

    private static final String FILE_TYPE_IMAGE = "image";
    private static final String FILE_TYPE_VIDEO = "video";
    private static final String FILE_TYPE_PDF = "pdf";

    private static final String CONTENT_TYPE_IMAGE = "wdennt:image";
    private static final String CONTENT_TYPE_VIDEO = "wdennt:video";
    private static final String CONTENT_TYPE_PDF = "wdennt:pdf";
    private static final String CONTENT_TYPE_DOC = "wdennt:document";


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

        widenAsset.addProperties(PREFIX+"deletedDate",widenNode.get("deleted_date").asText());

        widenAsset.addProperties(PREFIX+"templatedUrl",widenNode.get("embeds").get("templated").get("url").textValue());

        if(widenNode.get("thumbnails").get(THUMBNAIL_SIZE_KEY)!=null)
            widenAsset.addProperties(PREFIX+"thumbnail",widenNode.get("thumbnails").get(THUMBNAIL_SIZE_KEY).get("url").textValue());

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

        JsonNode filePropsNode = widenNode.get("file_properties");
        String fileType = filePropsNode.get("format_type").textValue();
        widenAsset.addProperties(PREFIX+"format",filePropsNode.get("format").textValue());
        widenAsset.addProperties(PREFIX+"type",fileType);
        widenAsset.addProperties(PREFIX+"sizeKB",filePropsNode.get("size_in_kbytes").longValue());

//        widenAsset.setFormat(filePropsNode.get("format").textValue());
//        widenAsset.setType(fileType);
//        widenAsset.setSizeKB(filePropsNode.get("size_in_kbytes").longValue());

        switch (fileType){
            case FILE_TYPE_IMAGE :
                widenAsset.setJahiaNodeType(CONTENT_TYPE_IMAGE);
                extendFileProps(filePropsNode,widenAsset,"image_properties");

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
                extendFileProps(filePropsNode,widenAsset,"video_properties");

                JsonNode playerNode = widenNode.get("embeds").get("video_player");
                JsonNode streamNode = widenNode.get("embeds").get("video_stream");
                JsonNode posterNode = widenNode.get("embeds").get("video_poster");

                if(!playerNode.isNull())
                    widenAsset.addProperties(PREFIX+"videoPlayer",playerNode.get("url").textValue());
//                    widenAsset.setVideoPlayer(playerNode.get("url").textValue());

                if(!streamNode.isNull()){
                    widenAsset.addProperties(PREFIX+"videoStreamURL",streamNode.get("url").textValue());
                    widenAsset.addProperties(PREFIX+"videoStreamHTML",streamNode.get("html").textValue());

//                    widenAsset.setVideoStreamURL(streamNode.get("url").textValue());
//                    widenAsset.setVideoStreamHTML(streamNode.get("html").textValue());
                 }

                if(!posterNode.isNull())
                    widenAsset.addProperties(PREFIX+"videoPoster",posterNode.get("url").textValue());
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

                JsonNode html5ViewerNode = widenNode.get("embeds").get("document_html5_viewer");
                JsonNode viewerNode = widenNode.get("embeds").get("document_viewer");
                JsonNode thumbnailNode = widenNode.get("embeds").get("document_thumbnail");
                JsonNode originalNode = widenNode.get("embeds").get("original");

                if(!html5ViewerNode.isNull())
                    widenAsset.addProperties(PREFIX+"viewerHtml5",html5ViewerNode.get("url").textValue());
//                    widenAsset.setViewerHtml5(html5ViewerNode.get("url").textValue());

                if(!viewerNode.isNull())
                    widenAsset.addProperties(PREFIX+"viewer",viewerNode.get("url").textValue());
//                    widenAsset.setViewer(viewerNode.get("url").textValue());

                if(!thumbnailNode.isNull())
                    widenAsset.addProperties(PREFIX+"docThumbnail",thumbnailNode.get("url").textValue());
//                    widenAsset.setDocThumbnail(thumbnailNode.get("url").textValue());

                if(!originalNode.isNull()) {
                    widenAsset.addProperties(PREFIX+"docURL",originalNode.get("url").textValue());
                    widenAsset.addProperties(PREFIX+"docHTMLLink",originalNode.get("html").textValue());
//                    widenAsset.setDocURL(originalNode.get("url").textValue());
//                    widenAsset.setDocHTMLLink(originalNode.get("html").textValue());
                }
                break;
            default:
                widenAsset.setJahiaNodeType(CONTENT_TYPE_DOC);
                break;
        }


        return widenAsset;
    }

    private void extendFileProps(JsonNode filePropsNode, WidenAsset widenAsset, String propsKey){
        if(propsKey != null && propsKey.length() !=0){
            JsonNode complementNode = filePropsNode.get(propsKey);
            if(!complementNode.isNull()){
                Double width = complementNode.get("width").doubleValue();
                Double height = complementNode.get("height").doubleValue();
                Double aspectRatio = complementNode.get("aspect_ratio").doubleValue();
                Double duration = complementNode.get("duration").asDouble();

                if(!width.isNaN())
                    widenAsset.addProperties(PREFIX+"width",width);
//                    widenAsset.setWidth(width);
                if(!height.isNaN())
                    widenAsset.addProperties(PREFIX+"height",height);
//                    widenAsset.setHeight(height);
                if(!aspectRatio.isNaN())
                    widenAsset.addProperties(PREFIX+"aspectRatio",aspectRatio);
//                    widenAsset.setAspectRatio(aspectRatio);
                if(!duration.isNaN())
                    widenAsset.addProperties(PREFIX+"duration",duration);
            }
        }
    }
}
