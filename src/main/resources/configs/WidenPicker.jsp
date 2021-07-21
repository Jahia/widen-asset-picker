<%@ page language="java" contentType="text/javascript" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="wden" uri="http://www.jahia.org/wden" %>

<c:set var="widenProviderConfig" value="${wden:config()}"/>

<c:choose>
    <c:when test="${! empty widenProviderConfig}">
        contextJsParameters.config.widen={
            <c:if test="${! empty widenProviderConfig['widen_provider.apiProtocol'] && ! empty widenProviderConfig['widen_provider.apiEndPoint']}">
                url:"${widenProviderConfig['widen_provider.apiProtocol']}://${widenProviderConfig['widen_provider.apiEndPoint']}",
            </c:if>
            <c:if test="${! empty widenProviderConfig['widen_provider.apiVersion']}">
                version:"${widenProviderConfig['widen_provider.apiVersion']}",
            </c:if>
            <c:if test="${! empty widenProviderConfig['widen_provider.apiSite']}">
                site:"${widenProviderConfig['widen_provider.apiSite']}",
            </c:if>
            <c:if test="${! empty widenProviderConfig['widen_provider.apiToken']}">
                token:"${widenProviderConfig['widen_provider.apiToken']}",
            </c:if>
            <c:if test="${! empty widenProviderConfig['widen_provider.lazyLoad']}">
                lazyLoad:${widenProviderConfig['widen_provider.lazyLoad']},
            </c:if>
            <c:if test="${! empty widenProviderConfig['widen_provider.resultPerPage']}">
                resultPerPage:${widenProviderConfig['widen_provider.resultPerPage']},
            </c:if>
            mountPoint:"/sites/systemsite/contents/dam-widen"
        }
        console.debug("%c Widen config is added to contextJsParameters.config", 'color: #3c8cba');
    </c:when>
    <c:otherwise>
        <utility:logger level="warn" value="no content of wdennt:mountPoint available"/>
        console.warn("no content of wdennt:mountPoint available");
    </c:otherwise>
</c:choose>