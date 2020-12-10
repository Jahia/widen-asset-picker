package org.jahia.se.modules.edp.dam.widen;

import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.decorator.JCRMountPointNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;

public class MountPoint {
    private static final Logger LOGGER = LoggerFactory.getLogger(MountPoint.class);

    public static final String NODETYPE = "wdennt:mountPoint";
    public static final String NODETYPE_PROPERTY_PROTOCOL = "widenApiProtocol";
    private static final String NODETYPE_PROPERTY_ENDPOINT = "widenApiEndPoint";
    private static final String NODETYPE_PROPERTY_SITE = "widenApiSite";
    private static final String NODETYPE_PROPERTY_TOKEN = "widenApiToken";
    private static final String NODETYPE_PROPERTY_VERSION = "widenApiVersion";
    private static final String NODETYPE_PROPERTY_MOUNTPATH = "edpMountPath";

    private String id;
    private String systemname;
    private String protocol;
    private String endpoint;
    private String site;
    private String token;
    private String version;
    private String mountPath;

    public MountPoint() {
        // default constructor for ObjectMapper
    }

    public MountPoint(JCRNodeWrapper mountNode) {
        systemname = mountNode.getName();
        try {
            id = mountNode.getIdentifier();
            mountPath = mountNode.getProperty(JCRMountPointNode.MOUNT_POINT_PROPERTY_NAME).getNode().getPath();
        } catch (RepositoryException e) {
            id = null;
            mountPath = mountNode.getPath();
        }
    }

}
