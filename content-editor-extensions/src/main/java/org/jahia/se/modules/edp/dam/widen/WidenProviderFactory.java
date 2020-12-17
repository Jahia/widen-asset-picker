package org.jahia.se.modules.edp.dam.widen;

import org.jahia.exceptions.JahiaInitializationException;
import org.jahia.modules.external.ExternalContentStoreProvider;
import org.jahia.se.modules.edp.dam.widen.cache.WidenCacheManager;
import org.jahia.services.SpringContextSingleton;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRStoreProvider;
import org.jahia.services.content.ProviderFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component(service = ProviderFactory.class, immediate = true)
public class WidenProviderFactory implements ProviderFactory {
    private static final Logger LOGGER = LoggerFactory.getLogger(WidenProviderFactory.class);

    private static final List<String> OVERRIDABLE_ITEMS = Collections.singletonList("*.*");

    private ExternalContentStoreProvider provider;
    private WidenDataSource widenDataSource;
    private WidenCacheManager widenCacheManager;

    @Activate
    public void onActivate(Map<String, ?> configuration) throws RepositoryException {
        provider = (ExternalContentStoreProvider) SpringContextSingleton.getBean("ExternalStoreProviderPrototype");
        widenCacheManager.flush();
    }

    @Reference(service = WidenDataSource.class)
    public void setStoreDataSource(WidenDataSource widenDataSource) {
        this.widenDataSource = widenDataSource;
    }

    @Reference(service = WidenCacheManager.class)
    public void setStoreCacheManager(WidenCacheManager widenCacheManager) {
        this.widenCacheManager = widenCacheManager;
    }

    @Override
    public String getNodeTypeName() {
        return MountPoint.NODETYPE;
    }

    @Override
    public JCRStoreProvider mountProvider(JCRNodeWrapper wdenMountPointNode) throws RepositoryException {
        provider.setKey(wdenMountPointNode.getIdentifier());
        provider.setMountPoint(wdenMountPointNode.getPath());
        MountPoint wdenStoreMountPoint = new MountPoint(wdenMountPointNode);
        if (wdenStoreMountPoint.getId() == null) {
            LOGGER.warn("Widen Store not mounted (id is null): {}", wdenMountPointNode.getPath());
        } else {
            widenDataSource.reload(wdenStoreMountPoint);
            provider.setDataSource(widenDataSource);
//            widenDataSource.setJcrStoreProvider(provider);
            provider.setDynamicallyMounted(true);
            provider.setSessionFactory(JCRSessionFactory.getInstance());
            provider.setOverridableItems(OVERRIDABLE_ITEMS);
            try {
                //Start the provider
                provider.start(true);
            } catch (JahiaInitializationException e) {
                throw new RepositoryException(e);
            }
        }
        return provider;
    }
}
