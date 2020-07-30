<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt_rt" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>
<html lang="${fn:substring(renderContext.request.locale,0,2)}">
    <head>
        <title>${fn:escapeXml(renderContext.mainResource.node.displayableName)}</title>
        <meta charset="UTF-8">
        <template:addResources type="css" resources="bootstrap.css"/>
        <template:addResources type="javascript" resources="jquery.min.js"/>
        <template:addResources type="javascript" resources="bootstrap.js"/>
    </head>
    <body>
        <div class="container">
            <template:area path="pagecontent"/>
        </div>
    </body>
</html>
