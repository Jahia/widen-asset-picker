<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>

<utility:logger level="DEBUG" value="*** widen image hidden getURL called"/>

<c:set var="url" value="${currentNode.properties['wden:templatedUrl'].string}"/>

<c:set var="scale" value="${not empty currentResource.moduleParams.scale ?
    currentResource.moduleParams.scale : '1'}"/>
<c:set var="quality" value="${not empty currentResource.moduleParams.quality ?
    currentResource.moduleParams.quality : '72'}"/>
<c:set var="size" value="${not empty currentResource.moduleParams.size ?
    currentResource.moduleParams.size : '768'}"/>

<c:set var="url" value="${fn:replace(url, '{scale}', scale)}"/>
<c:set var="url" value="${fn:replace(url, '{quality}', quality)}"/>
<c:set var="url" value="${fn:replace(url, '{size}', size)}" />

<c:url value="${url}" />
<%--<c:out value="${url}" />--%>
