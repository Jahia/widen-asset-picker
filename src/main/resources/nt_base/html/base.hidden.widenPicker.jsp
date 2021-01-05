<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="query" uri="http://www.jahia.org/tags/queryLib" %>
<%--<%@ page import="org.jahia.settings.SettingsBean"%>--%>
<%@ page import="java.util.Properties"%>
<%@ page import="org.jahia.services.SpringContextSingleton"%>


<%--<%@ page language="java" contentType="text/javascript" %>--%>
<%
    Properties properties = (Properties) (Properties) SpringContextSingleton.getBean("jahiaProperties");
    String APIProtocol = properties.getProperty("jahia.widen.api.protocol");
    String APIEndPoint = properties.getProperty("jahia.widen.api.endPoint");
    String APISite = properties.getProperty("jahia.widen.api.site");
    String APIToken = properties.getProperty("jahia.widen.api.token");
    String APIVersion = properties.getProperty("jahia.widen.api.version");
    String JCRMountPoint = properties.getProperty("jahia.widen.edp.mountPoint");
%>

<template:addResources type="css" resources="REACTBuildApp/2.ce2397d7.chunk.css" />
<template:addResources type="css" resources="REACTBuildApp/main.d63656a5.chunk.css" />

<template:addResources type="javascript" resources="REACTBuildApp/2.4ff4ff0b.chunk.js" />
<template:addResources type="javascript" resources="REACTBuildApp/main.8e3d683f.chunk.js" />

<c:set var="targetId" value="REACT_Widen_Finder_${fn:replace(currentNode.identifier,'-','_')}"/>

<%--<utility:logger level="info" value="path : ${renderContext.mainResource.node.path}"/>--%>
<%--<utility:logger level="info" value="name : ${currentNode.properties['jcr:name'].string}"/>--%>

<div id="${targetId}">Loading ...</div>

<script>
    const context_${targetId}={
        widen:{
            url:"<%= APIProtocol %>://<%= APIEndPoint %>",
            version:"<%= APIVersion %>",
            site:"<%= APISite %>",
            token:"<%= APIToken %>",
            mountPoint:"<%= JCRMountPoint %>"
        }
    };
    console.log("context_${targetId} : ",context_${targetId});
    window.addEventListener("DOMContentLoaded", event => {
        //in case if edit mode slow down the load waiting for the jahia GWT UI was setup,
        // otherwise the react app failed (maybe loosing his position as the DOM is updated by the jahia UI at the same time)
        <c:choose>
        <c:when test="${renderContext.editMode}" >
            setTimeout(() => {
                window.widenPicker("${targetId}",context_${targetId});
                window.widenPickerInterface.context = context_${targetId};
            },500);
        </c:when>
        <c:otherwise>
            window.widenPicker("${targetId}",context_${targetId});
            //voir pkoi j'ai besoin du context ci-apres ?...
            window.widenPickerInterface.context = context_${targetId};
        </c:otherwise>
        </c:choose>
    });

    !function(e){function r(r){for(var n,i,l=r[0],p=r[1],f=r[2],c=0,s=[];c<l.length;c++)i=l[c],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&s.push(o[i][0]),o[i]=0;for(n in p)Object.prototype.hasOwnProperty.call(p,n)&&(e[n]=p[n]);for(a&&a(r);s.length;)s.shift()();return u.push.apply(u,f||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,l=1;l<t.length;l++){var p=t[l];0!==o[p]&&(n=!1)}n&&(u.splice(r--,1),e=i(i.s=t[0]))}return e}var n={},o={1:0},u=[];function i(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=e,i.c=n,i.d=function(e,r,t){i.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,r){if(1&r&&(e=i(e)),8&r)return e;if(4&r&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)i.d(t,n,function(r){return e[r]}.bind(null,n));return t},i.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(r,"a",r),r},i.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},i.p="/";var l=this["webpackJsonpwiden-picker"]=this["webpackJsonpwiden-picker"]||[],p=l.push.bind(l);l.push=r,l=l.slice();for(var f=0;f<l.length;f++)r(l[f]);var a=p;t()}([]);
    //# sourceMappingURL=runtime-main.4b203344.js.map
</script>
