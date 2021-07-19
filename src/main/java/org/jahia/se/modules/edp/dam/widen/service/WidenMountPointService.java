package org.jahia.se.modules.edp.dam.widen.service;

import org.jahia.exceptions.JahiaInitializationException;

/**
 * Service to handle widen mount point
 */
public interface WidenMountPointService {
    /**
     * Start and mount the widen EDP implementation
     * @param widenProviderConfig the config
     * @throws JahiaInitializationException
     */
    void start(WidenProviderConfig widenProviderConfig) throws JahiaInitializationException;

    /**
     * Stop and unmount the widen EDP implementation
     */
    void stop();
}
