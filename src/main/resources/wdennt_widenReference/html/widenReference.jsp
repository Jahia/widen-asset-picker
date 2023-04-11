<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="ui" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="query" uri="http://www.jahia.org/tags/queryLib" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="s" uri="http://www.jahia.org/tags/search" %>
<%--@elvariable id="currentNode" type="org.jahia.services.content.JCRNodeWrapper"--%>
<%--@elvariable id="out" type="java.io.PrintWriter"--%>
<%--@elvariable id="script" type="org.jahia.services.render.scripting.Script"--%>
<%--@elvariable id="scriptInfo" type="java.lang.String"--%>
<%--@elvariable id="workspace" type="java.lang.String"--%>
<%--@elvariable id="renderContext" type="org.jahia.services.render.RenderContext"--%>
<%--@elvariable id="currentResource" type="org.jahia.services.render.Resource"--%>
<%--@elvariable id="url" type="org.jahia.services.render.URLGenerator"--%>

<c:set var="widenNode" value="${currentNode.properties['j:node'].node}"/>
<c:set var="referenceView" value="${not empty currentNode.properties['j:referenceView'] ?
    currentNode.properties['j:referenceView'].string :
    'default'}"/>
<%--<utility:logger level="INFO" value="*** widenReference referenceView: ${referenceView}"/>--%>

<%--<c:set var="defaultWidth" value="${currentNode.properties['wden:defaultImageSize'].long}"/>--%>
<c:set var="_widths_" value="${currentNode.properties['wden:imageSizes']}"/>
<c:set var="pdfMinHeight" value="${currentNode.properties['wden:pdfMinHeight'].long}"/>

<c:set var="defaultWidth" value="${not empty currentNode.properties['wden:defaultImageSize'] ?
    currentNode.properties['wden:defaultImageSize'].long :
    768}"/>

<c:choose>
    <c:when test="${fn:length(_widths_) > 0}">
        <c:set var="widths" value="${_widths_[0]}"/>
        <c:forEach var="width" items="${_widths_}" begin="1">
            <c:set var="widths" value="${widths},${width}"/>
<%--            <utility:logger level="INFO" value="***[widenReference] widenNode widths: ${widths}"/>--%>
        </c:forEach>
    </c:when>
    <c:otherwise>
        <c:set var="widths" value="256,512,768,1280"/>
    </c:otherwise>
</c:choose>

<%--<c:if test="${renderContext.editMode}" >--%>
<%--    <div>--%>
<%--    <span style="color:#ccc;">Edit widen media</span>--%>
<%--</c:if>--%>

    <template:module node="${widenNode}" editable="false" view="${referenceView}">
        <template:param name="widths" value="${widths}"/>
        <template:param name="defaultWidth" value="${defaultWidth}"/>
        <template:param name="pdfMinHeight" value="${pdfMinHeight}"/>
    </template:module>

<%--<c:if test="${renderContext.editMode}" >--%>
<%--    </div>--%>
<%--</c:if>--%>
