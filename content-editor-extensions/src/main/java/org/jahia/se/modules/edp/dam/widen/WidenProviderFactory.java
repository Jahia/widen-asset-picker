package org.jahia.se.modules.edp.dam.widen;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang.StringUtils;
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
        provider = (ExternalContentStoreProvider) SpringContextSingleton.getBean("WidenProvider");

        if (configuration.containsKey(MountPoint.NODETYPE_PROPERTY_ENDPOINT)) {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            try {
                MountPoint widenMountPoint = objectMapper.convertValue(configuration, MountPoint.class);
                if (widenMountPoint == null || StringUtils.isBlank(widenMountPoint.getSystemname())) {
                    throw new RepositoryException("Widen mount point not found");
                }
                MountPoint.getOrCreateMountPoint(widenMountPoint);
            } catch (IllegalArgumentException e) {
                throw new RepositoryException(e);
            }
            widenCacheManager.flush();
        }
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
        return null;
    }

    @Override
    public JCRStoreProvider mountProvider(JCRNodeWrapper wdenMountPointNode) throws RepositoryException {
//        widenDataSource.disconnect();
        provider.setKey(wdenMountPointNode.getIdentifier());
        provider.setMountPoint(wdenMountPointNode.getPath());
        MountPoint wdenStoreMountPoint = new MountPoint(wdenMountPointNode);
        if (wdenStoreMountPoint.getId() == null) {
            LOGGER.warn("Widen Store not mounted (id is null): {}", wdenMountPointNode.getPath());
        } else {
//            widenDataSource.reload(wdenStoreMountPoint);
            provider.setDataSource(widenDataSource);
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
