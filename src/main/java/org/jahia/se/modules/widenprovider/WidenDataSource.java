package org.jahia.se.modules.widenprovider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;
import com.google.common.net.HttpHeaders;
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.store.MemoryStoreEvictionPolicy;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.GetMethod;
import org.jahia.modules.external.ExternalData;
import org.jahia.modules.external.ExternalDataSource;
import org.jahia.se.modules.widenprovider.model.WidenAsset;
import org.jahia.services.cache.CacheHelper;
import org.jahia.services.cache.ModuleClassLoaderAwareCacheEntry;
import org.jahia.services.cache.ehcache.EhCacheProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.ItemNotFoundException;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

public class WidenDataSource implements ExternalDataSource {

    private static final Logger LOGGER = LoggerFactory.getLogger(WidenDataSource.class);

    private static final String CACHE_NAME = "cacheWiden";
    private static final int TIME_TO_LIVE_SECONDS = 28800;
    private static final int TIME_TO_IDLE_SECONDS = 3600;

    private static final String ASSET_ENTRY = "assets";
    private static final String ASSET_ENTRY_EXPAND = "embeds,thumbnails,file_properties";

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
//        LOGGER.info("***** WidenDataSource ***** start for remote site : "+this.widenSite);
        try {
            if (!ehCacheProvider.getCacheManager().cacheExists(CACHE_NAME)) {

                CacheConfiguration cacheConfiguration = new CacheConfiguration();
                cacheConfiguration.setName(CACHE_NAME);
                cacheConfiguration.memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.LFU);
                cacheConfiguration.setEternal(false);
                cacheConfiguration.timeToLiveSeconds(TIME_TO_LIVE_SECONDS);
                cacheConfiguration.setTimeToIdleSeconds(TIME_TO_IDLE_SECONDS);
                Cache widenCache = new Cache(cacheConfiguration);
                widenCache.setName(CACHE_NAME);

                ehCacheProvider.getCacheManager().addCache(widenCache);
//                ehCacheProvider.getCacheManager().addCache(CACHE_NAME);
            }
            cache = ehCacheProvider.getCacheManager().getCache(CACHE_NAME);
        } catch (IllegalStateException | CacheException e) {
            LOGGER.error("Error while initializing cache for Widen", e);
        }
    }

    @Override
    public List<String> getChildren(String s) throws RepositoryException {
        LOGGER.debug("***** WidenDataSource ***** getChildren is called with params : "+s);
        List<String> child = new ArrayList<String>();
        return child;
    }

    @Override
    public ExternalData getItemByIdentifier(String identifier) throws ItemNotFoundException {
        LOGGER.debug("***** WidenDataSource ***** getItemByIdentifier is called with identifier : "+identifier);
        try {
            if (identifier.equals("root")) {
                return new ExternalData(identifier, "/", "jnt:contentFolder", new HashMap<String, String[]>());
            }else{
                WidenAsset widenAsset = (WidenAsset) CacheHelper.getObjectValue(cache, identifier);//widenCacheManager.getWidenAsset(identifier);
                if(widenAsset == null){
                    LOGGER.debug("***** WidenDataSource ***** no cacheEntry for : "+identifier);
                    String path = "/"+this.widenVersion+"/"+ASSET_ENTRY+"/"+identifier;
                    Map<String, String> query = new LinkedHashMap<String, String>();
                    query.put("expand",ASSET_ENTRY_EXPAND);
                    widenAsset = queryWiden(path,query);
                    cache.put(new Element(widenAsset.getId(),new ModuleClassLoaderAwareCacheEntry(widenAsset, CACHE_NAME)));
                }
                LOGGER.debug("***** WidenDataSource ***** widenAsset : "+widenAsset);

                ExternalData data = new ExternalData(identifier, "/"+identifier, widenAsset.getJahiaNodeType(), widenAsset.getProperties());

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

    private WidenAsset queryWiden(String path, Map<String, String> query) throws RepositoryException {
        LOGGER.debug("***** WidenDataSource ***** queryWiden is called for path : "+path+" and query : "+query);
        try {
            HttpsURL url = new HttpsURL(this.widenEndpoint, 443, path);

            url.setQuery(query.keySet().toArray(new String[query.size()]), query.values().toArray(new String[query.size()]));
            long l = System.currentTimeMillis();
            GetMethod getMethod = new GetMethod(url.toString());
            getMethod.setRequestHeader(HttpHeaders.AUTHORIZATION,"Bearer "+this.widenSite+"/"+this.widenToken);

            try {
                httpClient.executeMethod(getMethod);
                BufferedReader streamReader = new BufferedReader(new InputStreamReader(getMethod.getResponseBodyAsStream(),"UTF-8"));
                StringBuilder responseStrBuilder = new StringBuilder();

                String inputStr;
                while ((inputStr = streamReader.readLine()) != null)
                    responseStrBuilder.append(inputStr);

                ObjectMapper mapper = new ObjectMapper();
                WidenAsset widenAsset = mapper.readValue(responseStrBuilder.toString(),WidenAsset.class);

                return widenAsset;
            } finally {
                getMethod.releaseConnection();
                LOGGER.debug("Request {} executed in {} ms",url, (System.currentTimeMillis() - l));
            }
        } catch (Exception e) {
            LOGGER.error("Error while querying Widen", e);
            throw new RepositoryException(e);
        }
    }


}
