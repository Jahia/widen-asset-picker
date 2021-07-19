package org.jahia.se.modules.edp.dam.widen.service;

public interface WidenProviderConfig {
    /**
     * The http protocol used to execute the request; default is 'https'
     * @return the Widen api protocol
     */
    String getApiProtocol();

    /**
     * The API endpoint; default is 'api.widencollective.com'
     * @return the Widen api endpoint
     */
    String getApiEndPoint();

    /**
     * The Widen API version; default is 'v2'
     * @return the Widen api version
     */
    String getApiVersion();

    /**
     * The Widen site used to create the bearer credential; no default
     * @return the Widen site
     */
    String getApiSite();

    /**
     * The Widen api token to create the bearer credential; no default
     * @return the Widen token
     */
    String getApiToken();

    /**
     * By default, the selectorType app loads the latest content created in Widen. If you don't want this load
     * you must set true for this config; default is 'false'
     * @return boolean to enable or not the lazyload
     */
    boolean getLazyLoad();

    /**
     * The number of result to display per result page in the selectorType app; default is 20
     * @return the number of result per page
     */
    int getResultPerPage();
}
