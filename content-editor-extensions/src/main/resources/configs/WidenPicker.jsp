<%@ page language="java" contentType="text/javascript" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>

<jcr:sql
	var="mountPoints"
	 sql="SELECT * FROM [wdennt:mountPoint]"
/>
<c:forEach items="${mountPoints.nodes}" var="mountPoint" end="0">
    <c:choose>
    <c:when test="${! empty mountPoint}">
    contextJsParameters.config.widen={
        url:"${mountPoint.properties['wden:apiProtocol']}://${mountPoint.properties['wden:apiEndPoint']}",
        version:"${mountPoint.properties['wden:apiVersion']}",
        site:"${mountPoint.properties['wden:apiSite']}",
        token:"${mountPoint.properties['wden:apiToken']}",
        mountPoint:"${jcr:getChildrenOfType(mountPoint.properties.mountPoint.node,'jnt:contentFolder')[0].path}"
    }
    console.log("contextJsParameters.config",contextJsParameters.config);
    </c:when>
    <c:otherwise>
    <utility:logger level="warn" value="no content of wdennt:mountPoint available"/>
    console.log("no content of wdennt:mountPoint available");
    </c:otherwise>
    </c:choose>
</c:forEach>
