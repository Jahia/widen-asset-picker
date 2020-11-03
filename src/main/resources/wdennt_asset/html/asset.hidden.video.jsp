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


<c:set var="player" value="${currentNode.properties['wden:videoPlayer'].string}"/>
<c:set var="stream" value="${currentNode.properties['wden:videoStream'].string}"/>
<c:set var="poster" value="${currentNode.properties['wden:embed'].string}"/>
<c:set var="poster" value="${fn:replace(poster, '{scale}', '1')}"/>
<c:set var="poster" value="${fn:replace(poster, '{quality}', '100')}"/>
<c:set var="poster" value="${fn:replace(poster, '{size}', '768')}"/>


<utility:logger level="INFO" value="*** widen asset player : ${player}"/>
<utility:logger level="INFO" value="*** widen asset poster : ${poster}"/>

<%--<iframe src="${player}" allowfullscreen allowtransparency="true" scrolling="no" frameborder="0" style="height:100%;width:100%;" />--%>

<%--Default HTML5 player--%>
<video controls width="100%" poster="${poster}">
    <source src="${stream}"
            type=""><%-- video/mp4 --%>
<%--    <source src="/media/cc0-videos/flower.mp4"--%>
<%--            type="video/mp4">--%>
    Sorry, your browser doesn't support embedded videos.
</video>


<%--<link href="https://vjs.zencdn.net/7.8.4/video-js.css" rel="stylesheet" />--%>
<%--<video--%>
<%--        id="my-video"--%>
<%--        class="video-js"--%>
<%--        controls--%>
<%--        preload="auto"--%>
<%--        width="640"--%>
<%--        height="264"--%>
<%--        poster="${poster}"--%>
<%--        data-setup="{}"--%>
<%-->--%>
<%--    <source src="${stream}" type="video/mp4" />&lt;%&ndash; video/mp4 &ndash;%&gt;--%>
<%--&lt;%&ndash;    <source src="MY_VIDEO.webm" type="video/webm" />&ndash;%&gt;--%>
<%--    <p class="vjs-no-js">--%>
<%--        To view this video please enable JavaScript, and consider upgrading to a--%>
<%--        web browser that--%>
<%--        <a href="https://videojs.com/html5-video-support/" target="_blank"--%>
<%--        >supports HTML5 video</a--%>
<%--        >--%>
<%--    </p>--%>
<%--</video>--%>
<%--<script src="https://vjs.zencdn.net/7.8.4/video.js"></script>--%>