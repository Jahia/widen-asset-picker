<%@ page import="org.jahia.settings.SettingsBean"%>
<%@ page language="java" contentType="text/javascript" %>
<%
    SettingsBean settingsBean = SettingsBean.getInstance();
    String APIProtocol = settingsBean.getString("jahia.widen.api.protocol","https");
    String APIEndPoint = settingsBean.getString("jahia.widen.api.endPoint","api.widencollective.com");
    String APIVersion = settingsBean.getString("jahia.widen.api.version","v2");
    String JCRMountPoint = settingsBean.getString("jahia.widen.edp.mountPoint","/sites/systemsite/contents/widen");
    String APISite = settingsBean.getString("jahia.widen.api.site");
    String APIToken = settingsBean.getString("jahia.widen.api.token");
%>
<%--contextJsParameters.config.wip="<%= settingsBean.getString("wip.link", "https://academy.jahia.com/documentation/enduser/jahia/8/authoring-content-in-jahia/using-content-editor/understanding-work-in-progress-content")%>";--%>
<%--contextJsParameters.config.maxNameSize=<%= settingsBean.getMaxNameSize() %>;--%>
<%--contextJsParameters.config.defaultSynchronizeNameWithTitle=<%= settingsBean.getString("jahia.ui.contentTab.defaultSynchronizeNameWithTitle", "true") %>;--%>
contextJsParameters.config.widen["url"]="<%= APIProtocol %>://<%= APIEndPoint %>";
contextJsParameters.config.widen["version"]="<%= APIVersion %>";
contextJsParameters.config.widen["site"]="<%= APISite %>";
contextJsParameters.config.widen["token"]="<%= APIToken %>";
contextJsParameters.config.widen["mountPoint"]="<%= JCRMountPoint %>";
