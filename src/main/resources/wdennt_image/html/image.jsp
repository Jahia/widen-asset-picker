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

<c:set var="alt" value="${fn:escapeXml(currentNode.displayableName)}"/>
<c:set var="url" value="${currentNode.properties['wden:templatedUrl'].string}"/>

<%--<utility:logger level="INFO" value="***[widenImage] widenNode widths: ${currentResource.moduleParams.widths}"/>--%>

<c:set var="scale" value="${not empty currentResource.moduleParams.quality ?
    currentResource.moduleParams.quality : '1'}"/>
<c:set var="quality" value="${not empty currentResource.moduleParams.quality ?
    currentResource.moduleParams.quality : '72'}"/>
<c:set var="widths" value="${not empty currentResource.moduleParams.widths ?
    currentResource.moduleParams.widths : '256,512,768,1280'}"/>
<c:set var="defaultWidth" value="${not empty currentResource.moduleParams.defaultWidth ?
    currentResource.moduleParams.defaultWidth : '768'}"/>
<c:set var="sizes" value="${not empty currentResource.moduleParams.sizes ?
    currentResource.moduleParams.sizes : '(min-width: 940px) 1280px, 768px'}"/>

<c:set var="url" value="${fn:replace(url, '{scale}', scale)}"/>
<c:set var="url" value="${fn:replace(url, '{quality}', quality)}"/>

<utility:logger level="DEBUG" value="*** widen asset alt : ${alt}"/>
<utility:logger level="DEBUG" value="*** widen asset url : ${url}"/>

<img src="${fn:replace(url, '{size}', defaultWidth)}" width="100%"
     srcset="<c:forEach items="${fn:split(widths, ',')}" var="width" varStatus="status">
                <c:if test="${!status.first}">,</c:if>
                <c:out value="${fn:replace(url, '{size}', width)} ${width}w" />
            </c:forEach>"
     sizes="${sizes}"
     class="${class}"
     alt="${alt}"
/>