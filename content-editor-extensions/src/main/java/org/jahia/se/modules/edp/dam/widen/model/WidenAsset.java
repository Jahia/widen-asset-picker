package org.jahia.se.modules.edp.dam.widen.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import java.util.HashMap;
import java.util.Map;

@JsonDeserialize(using = WidenAssetDeserializer.class)
public class WidenAsset {

    private String jahiaNodeType;
    private String id;
    private final Map<String, String[]> properties;

    public WidenAsset(){
        properties=new HashMap<>();
    }

    public String getJahiaNodeType() {
        return jahiaNodeType;
    }

    public void setJahiaNodeType(String jahiaNodeType) {
        this.jahiaNodeType = jahiaNodeType;
    }

    public String getId() { return id; }
    public void setId(String id){ this.id = id;}

    public Map<String, String[]> getProperties() {
        return properties;
    }

    public void addProperties(String name,Object value){
        properties.put(name, new String[]{value.toString()});
    }



//    private String externalId;
//    private String filename;
//    private String createdDate;
//    private String updatedDate;
//    private String deletedDate;
//    private String thumbnail;
//    //fileProperties
//    private String format;
//    private String type;
//    private Long sizeKB;
//    //imageFileProperties
//    private Double width;
//    private Double height;
//    private Double aspectRatio;
//    //videoFileProperties
//    private Double duration;
//    //embed
//    private String templatedUrl;
//    //embedVideo
//    private String videoPlayer;
//    private String videoStreamURL;
//    private String videoStreamHTML;
//    private String videoPoster;
//    //embedPdf
//    private String viewerHtml5;
//    private String viewer;
//    private String docThumbnail;
//    private String docURL;
//    private String docHTMLLink;



//

//
//    public String getExternalId() { return externalId; }
//    public void setExternalId(String eid){ this.externalId = eid;}
//
//    public String getFilename() { return filename; }
//    public void setFilename(String filename){ this.filename = filename;}
//
//    public String getCreatedDate() { return createdDate; }
//    public void setCreatedDate(String createdDate){ this.createdDate = createdDate;}
//
//    public String getUpdatedDate() { return updatedDate; }
//    public void setUpdatedDate(String updatedDate){ this.updatedDate = updatedDate;}
//
//    public String getDeletedDate() { return deletedDate; }
//    public void setDeletedDate(String deletedDate){ this.deletedDate = deletedDate;}
//
//    public String getThumbnail() {
//        return thumbnail;
//    }
//
//    public String getFormat() {
//        return format;
//    }
//
//    public String getType() {
//        return type;
//    }
//
//    public Long getSizeKB() {
//        return sizeKB;
//    }
//
//    public Double getWidth() {
//        return width;
//    }
//
//    public Double getHeight() {
//        return height;
//    }
//
//    public Double getAspectRatio() {
//        return aspectRatio;
//    }
//
//    public Double getDuration() {
//        return duration;
//    }
//
//    public String getTemplatedUrl() {
//        return templatedUrl;
//    }
//
//    public String getVideoPlayer() {
//        return videoPlayer;
//    }
//
//    public String getVideoStreamURL() {
//        return videoStreamURL;
//    }
//
//    public String getVideoStreamHTML() {
//        return videoStreamHTML;
//    }
//
//    public String getVideoPoster() {
//        return videoPoster;
//    }
//
//    public String getViewerHtml5() {
//        return viewerHtml5;
//    }
//
//    public String getViewer() {
//        return viewer;
//    }
//
//    public String getDocThumbnail() {
//        return docThumbnail;
//    }
//
//    public String getDocURL() {
//        return docURL;
//    }
//
//    public String getDocHTMLLink() {
//        return docHTMLLink;
//    }
//
//    public void setThumbnail(String thumbnail) {
//        this.thumbnail = thumbnail;
//    }
//
//    public void setFormat(String format) {
//        this.format = format;
//    }
//
//    public void setType(String type) {
//        this.type = type;
//    }
//
//    public void setSizeKB(Long sizeKB) {
//        this.sizeKB = sizeKB;
//    }
//
//    public void setWidth(Double width) {
//        this.width = width;
//    }
//
//    public void setHeight(Double height) {
//        this.height = height;
//    }
//
//    public void setAspectRatio(Double aspectRatio) {
//        this.aspectRatio = aspectRatio;
//    }
//
//    public void setDuration(Double duration) {
//        this.duration = duration;
//    }
//
//    public void setTemplatedUrl(String templatedUrl) {
//        this.templatedUrl = templatedUrl;
//    }
//
//    public void setVideoPlayer(String videoPlayer) {
//        this.videoPlayer = videoPlayer;
//    }
//
//    public void setVideoStreamURL(String videoStreamURL) {
//        this.videoStreamURL = videoStreamURL;
//    }
//
//    public void setVideoStreamHTML(String videoStreamHTML) {
//        this.videoStreamHTML = videoStreamHTML;
//    }
//
//    public void setVideoPoster(String videoPoster) {
//        this.videoPoster = videoPoster;
//    }
//
//    public void setViewerHtml5(String viewerHtml5) {
//        this.viewerHtml5 = viewerHtml5;
//    }
//
//    public void setViewer(String viewer) {
//        this.viewer = viewer;
//    }
//
//    public void setDocThumbnail(String docThumbnail) {
//        this.docThumbnail = docThumbnail;
//    }
//
//    public void setDocURL(String docURL) {
//        this.docURL = docURL;
//    }
//
//    public void setDocHTMLLink(String docHTMLLink) {
//        this.docHTMLLink = docHTMLLink;
//    }
}
