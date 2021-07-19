package org.jahia.se.modules.edp.dam.widen;

import org.apache.commons.lang3.StringUtils;
import org.jahia.se.modules.edp.dam.widen.service.WidenMountPointService;
import org.jahia.se.modules.edp.dam.widen.service.WidenProviderConfig;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.service.cm.ConfigurationException;
import org.osgi.service.cm.ManagedService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Dictionary;
import java.util.Hashtable;

@Component(service = { WidenProviderConfig.class,
        ManagedService.class }, property = "service.pid=org.jahia.se.modules.widen_provider", immediate = true)
public class WidenProviderConfigImpl implements ManagedService, WidenProviderConfig{

    public static final Logger logger = LoggerFactory.getLogger(WidenProviderConfigImpl.class);

    private Dictionary<String, ?> properties = new Hashtable<>();
    private BundleContext bundleContext;
    private WidenMountPointService widenMountPointService;

    @Reference
    public void setWidenMountPointService(WidenMountPointService widenMountPointService) {
        this.widenMountPointService = widenMountPointService;
    }

    @Override
    public void updated(Dictionary<String, ?> properties) throws ConfigurationException {
        if (properties != null) {
            this.properties = properties;
//            this.httpClient = initHttpClient();
            logger.info("Widen provider configuration reloaded");
            if (isConfigurationReady() && bundleContext.getBundle().getState() == Bundle.ACTIVE) {
                logger.info("Widen provider configuration is ready");
                startServices();
            } else {
                logger.warn("Widen provider configuration is incomplete, please check your configuration");
                stopServices();
            }
        } else {
            this.properties = new Hashtable<>();
//            this.httpClient = null;
            logger.info("Widen provider configuration removed");
            stopServices();
        }
    }

    @Activate
    public void activate(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
    }

    @Deactivate
    public void deactivate() throws ConfigurationException {
        stopServices();
    }

    private void startServices() throws ConfigurationException {
        try {
            widenMountPointService.start(this);
        } catch (Exception e) {
            throw new ConfigurationException("Global config", "Error starting Widen Provider services", e);
        }
    }

    private void stopServices() throws ConfigurationException {
        try {
            widenMountPointService.stop();
        } catch (Exception e) {
            throw new ConfigurationException("Global config", "Error stopping Widen Provider services", e);
        }
    }

    private boolean isConfigurationReady(){
        return StringUtils.isNotEmpty(getApiProtocol()) &&
                StringUtils.isNotEmpty(getApiEndPoint()) &&
                StringUtils.isNotEmpty(getApiVersion()) &&
                StringUtils.isNotEmpty(getApiSite()) &&
                StringUtils.isNotEmpty(getApiToken());
    }
    
    @Override
    public String getApiProtocol() { return (String) properties.get("widen_provider.apiProtocol"); }

    @Override
    public String getApiEndPoint() { return (String) properties.get("widen_provider.apiEndPoint"); }

    @Override
    public String getApiVersion() { return (String) properties.get("widen_provider.apiVersion"); }

    @Override
    public String getApiSite() { return (String) properties.get("widen_provider.apiSite"); }

    @Override
    public String getApiToken() { return (String) properties.get("widen_provider.apiToken"); }

    @Override
    public boolean getLazyLoad() { return Boolean.parseBoolean((String) properties.get("widen_provider.lazyLoad")); }

    @Override
    public int getResultPerPage() { return Integer.parseInt((String) properties.get("widen_provider.resultPerPage")); }


}
