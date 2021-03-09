package org.jahia.se.modules.edp.dam.widen;

import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.decorator.JCRMountPointNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import java.util.Locale;

public class MountPoint {
    private static final Logger LOGGER = LoggerFactory.getLogger(MountPoint.class);

    public static final String NODETYPE = "wdennt:mountPoint";
    public static final String PROPERTY_PREFIX = "wden:";
    private static final String NODETYPE_PROPERTY_PROTOCOL = PROPERTY_PREFIX+"apiProtocol";
    public static final String NODETYPE_PROPERTY_ENDPOINT = PROPERTY_PREFIX+"apiEndPoint";
    private static final String NODETYPE_PROPERTY_SITE = PROPERTY_PREFIX+"apiSite";
    private static final String NODETYPE_PROPERTY_TOKEN = PROPERTY_PREFIX+"apiToken";
    private static final String NODETYPE_PROPERTY_VERSION = PROPERTY_PREFIX+"apiVersion";
    private static final String NODETYPE_PROPERTY_LAZYLOAD = PROPERTY_PREFIX+"lazyLoad";
    private static final String NODETYPE_PROPERTY_RESULT_PER_PAGE = PROPERTY_PREFIX+"resultPerPage";

    private static final boolean LAZYLOAD = false;
    private static final int RESULT_PER_PAGE = 50;

    private String id;
    private String systemname;
    private String protocol;
    private String endpoint;
    private String site;
    private String token;
    private String version;
    private boolean lazyLoad;
    private int resultPerPage;
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
        try {
            lazyLoad = mountNode.getProperty(NODETYPE_PROPERTY_LAZYLOAD).getBoolean();
        } catch (RepositoryException e) {
            LOGGER.info("Set Default Lazyload {}", LAZYLOAD, e);
        }
        try {
            resultPerPage = (int) mountNode.getProperty(NODETYPE_PROPERTY_RESULT_PER_PAGE).getLong();
        } catch (RepositoryException e) {
            LOGGER.info("Set Default Result per page {}", RESULT_PER_PAGE, e);
        }

        protocol = mountNode.getPropertyAsString(NODETYPE_PROPERTY_PROTOCOL);
        endpoint = mountNode.getPropertyAsString(NODETYPE_PROPERTY_ENDPOINT);
        site = mountNode.getPropertyAsString(NODETYPE_PROPERTY_SITE);
        token = mountNode.getPropertyAsString(NODETYPE_PROPERTY_TOKEN);
        version = mountNode.getPropertyAsString(NODETYPE_PROPERTY_VERSION);
    }

    public String getId() {
        return id;
    }
    public String getSystemname() {
        return systemname;
    }
    public String getProtocol () { return protocol;}
    public String getEndpoint () { return endpoint;}
    public String getSite () { return site;}
    public String getToken () { return token;}
    public String getVersion () { return version;}
    public boolean getLazyLoad () { return lazyLoad;}
    public int getResultPerPage () { return resultPerPage;}
    public String getMountPath () { return mountPath;}

    public static JCRNodeWrapper getOrCreateMountPoint(MountPoint mountPoint) throws RepositoryException {
        return JCRTemplate.getInstance().doExecuteWithSystemSession(session -> {
            String systemMountPath = "/mounts";
            JCRNodeWrapper wdenMountPointNode;
            if (session.nodeExists(systemMountPath.concat("/").concat(mountPoint.getSystemname()))) {
                wdenMountPointNode = session.getNode(systemMountPath.concat("/").concat(mountPoint.getSystemname()));
            } else {
                wdenMountPointNode = session.getNode(systemMountPath).addNode(mountPoint.getSystemname(), MountPoint.NODETYPE);
            }

            wdenMountPointNode.setProperty(NODETYPE_PROPERTY_PROTOCOL, mountPoint.getProtocol());
            wdenMountPointNode.setProperty(NODETYPE_PROPERTY_ENDPOINT, mountPoint.getEndpoint());
            wdenMountPointNode.setProperty(NODETYPE_PROPERTY_SITE, mountPoint.getSite());
            wdenMountPointNode.setProperty(NODETYPE_PROPERTY_TOKEN, mountPoint.getToken());
            wdenMountPointNode.setProperty(NODETYPE_PROPERTY_VERSION, mountPoint.getVersion());
            wdenMountPointNode.setProperty(NODETYPE_PROPERTY_LAZYLOAD, mountPoint.getLazyLoad());
            wdenMountPointNode.setProperty(NODETYPE_PROPERTY_RESULT_PER_PAGE, mountPoint.getResultPerPage());
            wdenMountPointNode.setProperty(JCRMountPointNode.MOUNT_POINT_PROPERTY_NAME, session.getNode(mountPoint.getMountPath()));

            wdenMountPointNode.saveSession();
            return wdenMountPointNode;
        });
    }
}
