package org.jahia.se.modules.edp.dam.widen.cache;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.store.MemoryStoreEvictionPolicy;
import org.jahia.se.modules.edp.dam.widen.model.WidenAsset;
import org.jahia.services.SpringContextSingleton;
import org.jahia.services.cache.CacheHelper;
import org.jahia.services.cache.ModuleClassLoaderAwareCacheEntry;
import org.jahia.services.cache.ehcache.EhCacheProvider;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;

@Component(service = WidenCacheManager.class, immediate = true)
public class WidenCacheManager {
    private static final String CACHE_NAME = "cacheWiden";
    //Should be in cfg?
    private static final int TIME_TO_LIVE_SECONDS = 28800;
    private static final int TIME_TO_IDLE_SECONDS = 3600;

    private Ehcache cache;

    @Activate
    public void onActivate() {
        EhCacheProvider cacheProvider = (EhCacheProvider) SpringContextSingleton.getBean("ehCacheProvider");
        cache = initCache(cacheProvider, CACHE_NAME);
    }

    private static Ehcache initCache(EhCacheProvider cacheProvider, String cacheName) {
        CacheManager cacheManager = cacheProvider.getCacheManager();
        Ehcache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            cache = createWidenCache(cacheManager, cacheName);
        } else {
            cache.removeAll();
        }
        return cache;
    }

    private static Ehcache createWidenCache(CacheManager cacheManager, String cacheName) {
        CacheConfiguration cacheConfiguration = new CacheConfiguration();
        cacheConfiguration.setName(cacheName);
        cacheConfiguration.memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.LFU);
        cacheConfiguration.setEternal(false);
        cacheConfiguration.timeToLiveSeconds(TIME_TO_LIVE_SECONDS);
        cacheConfiguration.setTimeToIdleSeconds(TIME_TO_IDLE_SECONDS);
        // Create a new cache with the configuration
        Ehcache cache = new Cache(cacheConfiguration);
        cache.setName(cacheName);
        // Cache name has been set now we can initialize it by putting it in the manager.
        // Only Cache manager is initializing caches.
        return cacheManager.addCacheIfAbsent(cache);
    }

    @Deactivate
    public void onDeactivate() {
        flush();
    }

    /**
     * This method flushes the widen cache
     */
    public void flush() {
        // flush
        if (cache != null) {
            cache.removeAll();
        }
    }

    public WidenAsset getWidenAsset(String cacheKey){
        return (WidenAsset) CacheHelper.getObjectValue(cache, cacheKey);
    };

    public void cacheWidenAsset (WidenAsset widenAsset){
        cache.put(new Element(widenAsset.getId(),new ModuleClassLoaderAwareCacheEntry(widenAsset, CACHE_NAME)));
    }
}
