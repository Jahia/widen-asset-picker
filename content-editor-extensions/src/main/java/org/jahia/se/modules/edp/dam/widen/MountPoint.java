package org.jahia.se.modules.edp.dam.widen;

import org.apache.commons.lang.LocaleUtils;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.decorator.JCRMountPointNode;
import org.jahia.services.scheduler.SchedulerService;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import java.util.Locale;

public class MountPoint {
    private static final Logger LOGGER = LoggerFactory.getLogger(MountPoint.class);

    public static final String NODETYPE = "wdennt:mountPoint";
    public static final String PROPERTY_PREFIX = "wden:";
    private static final String NODETYPE_PROPERTY_PROTOCOL = "apiProtocol";
    public static final String NODETYPE_PROPERTY_ENDPOINT = "apiEndPoint";
    private static final String NODETYPE_PROPERTY_SITE = "apiSite";
    private static final String NODETYPE_PROPERTY_TOKEN = "apiToken";
    private static final String NODETYPE_PROPERTY_VERSION = "apiVersion";
//    private static final String NODETYPE_PROPERTY_MOUNTPATH = "mountPoint";

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
        protocol = mountNode.getPropertyAsString(PROPERTY_PREFIX+NODETYPE_PROPERTY_PROTOCOL);
        endpoint = mountNode.getPropertyAsString(PROPERTY_PREFIX+NODETYPE_PROPERTY_ENDPOINT);
        site = mountNode.getPropertyAsString(PROPERTY_PREFIX+NODETYPE_PROPERTY_SITE);
        token = mountNode.getPropertyAsString(PROPERTY_PREFIX+NODETYPE_PROPERTY_TOKEN);
        version = mountNode.getPropertyAsString(PROPERTY_PREFIX+NODETYPE_PROPERTY_VERSION);
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
            wdenMountPointNode.setProperty(JCRMountPointNode.MOUNT_POINT_PROPERTY_NAME, session.getNode(mountPoint.getMountPath()));

            wdenMountPointNode.saveSession();
            return wdenMountPointNode;
        });
    }

//    /**
//     * Upon deletion of the mount point node, this method stops any background job currently executing and deletes the background job
//     *
//     * @param nodeIdentifier - mount point identifier
//     * @param nodeName       - mountPoint node name
//     */
//    public static void deleteJob(String nodeIdentifier, String nodeName) {
//        try {
//            LOGGER.info("Checking if StoreIndexer background job is currently executing for mount point: {} [{}]", nodeName, nodeIdentifier);
//            SchedulerService schedulerService = ServicesRegistry.getInstance().getSchedulerService();
//            Scheduler scheduler = schedulerService.getScheduler();
//            //Obtain job detail for this mount point
//            JobDetail jobDetail = scheduler.getJobDetail(StoreIndexer.STORE_INDEXER_PREFIX + nodeIdentifier, StoreIndexer.STORE_GROUPJOBNAME);
//            if (jobDetail != null) {
//                //Interrupt background job process if it one is in progress
//                if (scheduler.interrupt(StoreIndexer.STORE_INDEXER_PREFIX + nodeIdentifier, StoreIndexer.STORE_GROUPJOBNAME)) {
//                    LOGGER.info("Successfully interrupted  Indexer background job!");
//                } else {
//                    LOGGER.info("No  Indexer background job was found. No interrupt is required");
//                }
//                LOGGER.info("Preparing to delete  Indexer job...");
//                //Delete the background job
//                if (scheduler.deleteJob(StoreIndexer.STORE_INDEXER_PREFIX + nodeIdentifier, StoreIndexer.STORE_GROUPJOBNAME)) {
//                    LOGGER.info("Successfully deleted  Indexer job!");
//                } else {
//                    LOGGER.warn("Failed to delete  Indexer job");
//                }
//            }
//        } catch (SchedulerException e) {
//            LOGGER.error("Failed to access  indexer background job", e);
//        }
//    }

//    public Locale getLocale(String locale) {
//        if (mappingLocales != null && mappingLocales.has(locale)) {
//            try {
//                return LocaleUtils.toLocale(mappingLocales.getString(locale));
//            } catch (Exception jsonException) {
//                // Nothing to do
//            }
//        }
//        try {
//            return LocaleUtils.toLocale(locale);
//        } catch (Exception e) {
//            return null;
//        }
//    }

}
