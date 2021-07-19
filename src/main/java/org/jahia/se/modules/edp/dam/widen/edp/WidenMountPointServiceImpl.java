package org.jahia.se.modules.edp.dam.widen.edp;
import org.jahia.exceptions.JahiaInitializationException;
import org.jahia.modules.external.ExternalContentStoreProvider;
import org.jahia.modules.external.ExternalProviderInitializerService;
import org.jahia.se.modules.edp.dam.widen.service.WidenMountPointService;
import org.jahia.se.modules.edp.dam.widen.service.WidenProviderConfig;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRStoreService;
import org.jahia.services.sites.JahiaSitesService;
import org.jahia.services.usermanager.JahiaGroupManagerService;
import org.jahia.services.usermanager.JahiaUserManagerService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Factory for the EDP widen mount point
 */
@Component(service = {WidenMountPointService.class}, immediate = true)
public class WidenMountPointServiceImpl implements  WidenMountPointService{
    private static final Logger logger = LoggerFactory.getLogger(WidenDataSource.class);

//    public static final String WIDEN_NODETYPE = "kibanant:dashboard";
//    private static final List<String> EXTENDABLE_TYPES = Arrays.asList(DASHBOARD_NODETYPE);
//    private static final List<String> OVERRIDABLE_ITEMS = Collections.singletonList("*.*");

    private ExternalContentStoreProvider widenProvider;

    // Core deps
    private JahiaUserManagerService userManagerService;
    private JahiaGroupManagerService groupManagerService;
    private JahiaSitesService sitesService;
    private JCRStoreService jcrStoreService;
    private JCRSessionFactory sessionFactory;

    // EDP deps
    private ExternalProviderInitializerService externalProviderInitializerService;

    // internal deps
    private WidenCacheManager widenCacheManager;

    @Reference
    public void setUserManagerService(JahiaUserManagerService userManagerService) {
        this.userManagerService = userManagerService;
    }

    @Reference
    public void setGroupManagerService(JahiaGroupManagerService groupManagerService) {
        this.groupManagerService = groupManagerService;
    }

    @Reference
    public void setSitesService(JahiaSitesService sitesService) {
        this.sitesService = sitesService;
    }

    @Reference
    public void setJcrStoreService(JCRStoreService jcrStoreService) {
        this.jcrStoreService = jcrStoreService;
    }

    @Reference
    public void setSessionFactory(JCRSessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Reference
    public void setExternalProviderInitializerService(ExternalProviderInitializerService externalProviderInitializerService) {
        this.externalProviderInitializerService = externalProviderInitializerService;
    }

    @Reference
    public void setWidenCacheManager(WidenCacheManager widenCacheManager) {
        this.widenCacheManager = widenCacheManager;
    }

    @Override
    public void start(WidenProviderConfig widenProviderConfig) throws JahiaInitializationException {
        logger.info("Starting Widen mount point service");
        widenProvider = new ExternalContentStoreProvider();
        widenProvider.setUserManagerService(userManagerService);
        widenProvider.setGroupManagerService(groupManagerService);
        widenProvider.setSitesService(sitesService);
        widenProvider.setService(jcrStoreService);
        widenProvider.setSessionFactory(sessionFactory);
        widenProvider.setExternalProviderInitializerService(externalProviderInitializerService);

        widenProvider.setDataSource(new WidenDataSource(widenProviderConfig, widenCacheManager));
//        widenProvider.setExtendableTypes(EXTENDABLE_TYPES);
//        widenProvider.setOverridableItems(OVERRIDABLE_ITEMS);
        widenProvider.setDynamicallyMounted(false);
        widenProvider.setMountPoint("/sites/systemsite/contents/dam-widen");
        widenProvider.setKey("widen");
        widenProvider.start();
        logger.info("Widen mount point service started");
    }

    @Override
    public void stop() {
        if (widenProvider != null) {
            logger.info("Stopping Widen mount point service");
            widenProvider.stop();
            widenProvider = null;
            logger.info("Widen mount point service stopped");
        }
    }
}
