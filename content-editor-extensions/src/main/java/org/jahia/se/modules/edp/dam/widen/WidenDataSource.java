package org.jahia.se.modules.edp.dam.widen;

import org.jahia.modules.external.ExternalDataSource;
import org.jahia.se.modules.edp.dam.widen.cache.WidenCacheManager;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//,ExternalDataSource.Searchable.class not used for now, needed if you want to use AugSearch with external asset
@Component(service = {WidenDataSource.class, ExternalDataSource.class}, immediate = true)
public class WidenDataSource {
    private static final Logger LOGGER = LoggerFactory.getLogger(WidenDataSource.class);

    private WidenCacheManager widenCacheManager;
}
