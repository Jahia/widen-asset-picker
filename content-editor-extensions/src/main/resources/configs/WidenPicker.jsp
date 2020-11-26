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
<%--console.log("contextJsParameters",contextJsParameters);--%>
<%--console.log("contextJsParameters.config",contextJsParameters.config);--%>

contextJsParameters.config.widen={
    url:"<%= APIProtocol %>://<%= APIEndPoint %>",
    version:"<%= APIVersion %>",
    site:"<%= APISite %>",
    token:"<%= APIToken %>",
    mountPoint:"<%= JCRMountPoint %>"
}
