package org.jahia.se.modules.widenprovider;

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
        try {
            if (!ehCacheProvider.getCacheManager().cacheExists("tmdb-cache")) {
                ehCacheProvider.getCacheManager().addCache("tmdb-cache");
            }
            cache = ehCacheProvider.getCacheManager().getCache("tmdb-cache");
        } catch (IllegalStateException | CacheException e) {
            logger.error("Error while initializing cache for IMDB", e);
        }
    }


    @Override
    public List<String> getChildren(String s) throws RepositoryException {
        return null;
    }

    @Override
    public ExternalData getItemByIdentifier(String identifier) throws ItemNotFoundException {
        try {
            if (identifier.equals("root")) {
                return new ExternalData(identifier, "/", "jnt:contentFolder", new HashMap<String, String[]>());
            }else{
                //TODO manage cache here
                Map<String, String[]> properties = null;

                String path = "/"+this.widenVersion+"/"+ASSET_ENTRY+"/"+identifier;

                Map<String, String> query = new LinkedHashMap<String, String>();
                query.put("expand ","embeds,thumbnails,file_properties");

                try {
                    JSONObject asset = queryWiden(path,query);
                    properties = new HashMap<String, String[]>();
                    properties.put("wden:id", new String[]{asset.getString("id")});
                    properties.put("wden:external_id", new String[]{asset.getString("external_id")});
                    properties.put("wden:filename", new String[]{asset.getString("filename")});
                    properties.put("wden:created_date", new String[]{asset.getString("created_date")});
                    properties.put("wden:last_update_date", new String[]{asset.getString("last_update_date")});
                    properties.put("wden:deleted_date", new String[]{asset.optString("deleted_date")});
                    properties.put("wden:thumbnail", new String[]{asset.optJSONObject("thumbnails").optJSONObject("160px").optString("url")});
                    properties.put("wden:embed", new String[]{asset.getJSONObject("embeds").getJSONObject("templated").optString("url")});

//                    if (asset.has("id"))
//                        properties.put("wden:id", new String[]{asset.getString("id")});
//                    if (movie.has("release_date")) {
//                        properties.put("release_date", new String[]{movie.getString("release_date") + "T00:00:00.000+00:00"});
//                    }
                } catch (JSONException | RepositoryException e) {
                    logger.error("Error while getting asset", e);
                }
                ExternalData data = new ExternalData(identifier, "/"+identifier, "wdennt:asset", properties);
                return data;
            }
        } catch (Exception e) {
            throw new ItemNotFoundException(e);
        }
    }

    @Override
    public ExternalData getItemByPath(String path) throws PathNotFoundException {
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
        return null;
    }

    @Override
    public boolean isSupportsHierarchicalIdentifiers() {
        return false;
    }

    @Override
    public boolean isSupportsUuid() {
        return false;
    }

    @Override
    public boolean itemExists(String s) {
        return false;
    }

    private JSONObject queryWiden(String path, Map<String, String> query) throws RepositoryException {
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
                logger.debug("Request {} executed in {} ms",url, (System.currentTimeMillis() - l));
            }
        } catch (Exception e) {
            logger.error("Error while querying TMDB", e);
            throw new RepositoryException(e);
        }
    }
}
