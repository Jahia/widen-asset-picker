package org.jahia.se.modules.edp.dam.widen.cache;

public abstract class AbstractCacheEntry {

    private String id;
    private String external_id;
    private String filename;
    private String created_date;
    private String last_update_date;
    private String deleted_date;
    private String wdenThumbnail;

    public String getWdenId() { return title; }
    public void setTitle(String title){ this.title = title;}

    public String getTitle() { return title; }
    public void setTitle(String title){ this.title = title;}








    properties.put("jcr:title", new String[]{widenAsset.getString("filename")});
                    properties.put("wden:id", new String[]{widenAsset.getString("id")});
                    properties.put("wden:externalId", new String[]{widenAsset.getString("external_id")});
                    properties.put("wden:filename", new String[]{widenAsset.getString("filename")});
                    properties.put("wden:createdDate", new String[]{widenAsset.getString("created_date")});
                    properties.put("wden:updatedDate", new String[]{widenAsset.getString("last_update_date")});
                    properties.put("wden:deletedDate", new String[]{widenAsset.optString("deleted_date")});

                    if(widenAsset.getJSONObject("thumbnails").optJSONObject("300px")!=null)
            properties.put("wden:thumbnail", new String[]{widenAsset.optJSONObject("thumbnails").optJSONObject("300px").optString("url")});

}
