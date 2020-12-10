package org.jahia.se.modules.edp.dam.widen;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang.StringUtils;
import org.jahia.modules.external.ExternalContentStoreProvider;
import org.jahia.se.modules.edp.dam.widen.cache.WidenCacheManager;
import org.jahia.services.SpringContextSingleton;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRStoreProvider;
import org.jahia.services.content.ProviderFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;

import javax.jcr.RepositoryException;
import java.util.Map;

@Component(service = ProviderFactory.class, immediate = true)
public class WidenProviderFactory implements ProviderFactory {

    private ExternalContentStoreProvider provider;
    private WidenDataSource widenDataSource;
    private WidenCacheManager widenCacheManager;

    @Activate
    public void onActivate(Map<String, ?> configuration) throws RepositoryException {
        provider = (ExternalContentStoreProvider) SpringContextSingleton.getBean("WidenProvider");

        if (configuration.containsKey(MountPoint.NODETYPE_PROPERTY_URL)) {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            try {
                MountPoint storeMountPoint = objectMapper.convertValue(configuration, MountPoint.class);
                if (storeMountPoint == null || StringUtils.isBlank(storeMountPoint.getSystemname())) {
                    throw new RepositoryException("Store mount point not found");
                }
                MountPoint.getOrCreateMountPoint(storeMountPoint);
            } catch (IllegalArgumentException e) {
                throw new RepositoryException(e);
            }
            storeCacheManager.flush();
        }
    }

    @Override
    public String getNodeTypeName() {
        return null;
    }

    @Override
    public JCRStoreProvider mountProvider(JCRNodeWrapper jcrNodeWrapper) throws RepositoryException {
        return null;
    }
}
