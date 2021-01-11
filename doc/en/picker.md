\[[<< back][README.md]\]
# Widen Picker

- [Reminder about picker](#module-content)
- [Components](#quick-start)
    - [Overview](#data-flow)
        - [Data flow](#data-flow)
    - [Javascript Interface](#javascript-interface)
        - [Architecture](#architecture)
        - [Configuration](#configuration)
    - [Widen Picker React Application](#widen-picker-react-application)
        - [Architecture](#architecture-1)
        - [Configuration](#configuration-1)
        - [Run and deploy the App](#run-and-deploy-the-app)
            - [Run the App as standalone for development](#run-the-app-as-standalone-for-development-)
            - [Build and deploy the app for production](#build-and-deploy-the-app-for-production-)


This section presents details about the picker used by a contributor to search and to select a widen content from
a jContent node.

Before to deep dive into the widen picker, few words about the default jContent picker.

## Reminder about picker
A picker is a user interface (UI) used by a jContent contributor to search and to select a referenced node/content from
  a master node/content form field. In other words, this is the way to create a reference between two nodes/contents.
  
With a picker, a contributor can
1. Browse a content tree (internal or external)

    ![01_defaultPicker]
2. Run a fulltext search through metadata like **name** or **tags** (Sort By)

    ![02_defaultPicker]
3. Upload a binary (text file, image, video...) from the file system
4. Select the content to reference

Thus, jContent provides a default picker working with all JCR nodes, and there is a dedicated section where
a contributor can browse external repositories.

However, this module doesn't use the default picker, because :
1. The search UI of the default picker doesn't support search facets.
2. The search UI is a bit complex to extend, if you want to support facets.

So, we have decided to create our own picker, named `Widen Picker` : 

![003]

> Even if, for the moment, this modules doesn't use facet approach,
the picker is ready to use one and easy to extend.


## Components
The picker is based on a standalone REACT application.
This application is a frontend of the Widen Asset API. The widen picker is used :
1. to search and to select the appropriate media content in the widen assets catalog.
2. to create and to returned a node path to jContent. This path is resolved later by the [provider][provider.md]
to create the node.

Even if the picker is a standalone REACT application, it must be linked to jContent to reference the selected
widen asset as a JCR node. This link is done via a Javascript interface.

### Overview

![pickerArch]

The jContent widen picker is composed by three mains elements :
1. A Javascript Interface written in the file [widen-asset-picker.js][widenAssetPicker.js].
2. A content view for an *nt:base* node, and named [hidden.widenPicker.jsp][hidden.widenPicker.jsp].
this view is displayed through a *main resource display* template named `widen-asset-edit-picker`.

3. A [React application][react:index.js]


#### Data flow
1. The user click the GWT form field *Media Content*.
2. The iframe with the *nt:base* node view is loaded.
3. The React application is launched by the view. Depending on the configuration (lazy-loading is possible), the application
requests the last updated contents to Widen.

    > The picker uses the Widen API :
    [Assets - List by search query][widenAPI:AssetByQuery].
4. The React application displays the assets returned by the API.
5. The contributor selects a Widen asset.

### Javascript Interface
The javascript interface is the bridge between the content form, and the picker to exchange data.
It is splited in two parts, one from jContent side ([widen-asset-picker.js][widenAssetPicker.js])
and the other one from the react app ([widenPickerInterface object][react:index.js]).

#### Architecture

From jContent side, the interface is composed by three main functions :
1. `widenPickerInit()`. This function creates and returns an iframe HTML tag.
    ```js
    const iframe = `<iframe 
        id="${__widenFrameID__}" width="100%" height="100%" frameborder="0"
        src="${jahiaGWTParameters.contextPath}${jahiaGWTParameters.servletPath}/editframe/default/${jahiaGWTParameters.lang}/sites/${jahiaGWTParameters.siteKey}.widen-asset-edit-picker.html"/>`
    return $.parseHTML(iframe)[0];
    ```

    The **src** attribute value of the iframe is the url of the *main resource display* template named `widen-asset-edit-picker`.
    This template calls the view [hidden.widenPicker.jsp][hidden.widenPicker.jsp].
    
    ![template]
    
    The view loads the build of the picker React application and runs the script
    ```jsp
    <%-- Load the build --%>
    <template:addResources type="javascript" resources="REACTBuildApp/2.4ff4ff0b.chunk.js" />
    <template:addResources type="javascript" resources="REACTBuildApp/main.8e3d683f.chunk.js" />
    
   ...
   
    <%-- Run the app --%>
    !function(e){function r(r){for(var n,i,l=r[0],p=r[1],f=r[2],...
   ```
2. `widenPickerLoad(data)`. This function returns to the `widenPickerInterface` object  the current value of the form field.
3. `widenPickerGet()`. This function is called when the contributor clicks the **save** button of the picker iframe.
The function get the node path of the selected asset from the `widenPickerInterface` object and return the path to jContent.
    ```js
    //called when click the picker save button
    function widenPickerGet() {
        const pickerInterface = getCustomWidenPickerInterface();
        if(pickerInterface !== undefined) {
            return pickerInterface.data;
        }
    }
    ```

#### Configuration
The picker is used by the `wdennt:widenReference` node type, as written in the [content definition file][definition.cnd]
```cnd
[wdennt:widenReference] > jnt:content,jmix:nodeReference, jmix:multimediaContent
 - j:node (weakreference, picker[type='custom',config='widenPicker']) < 'wdenmix:widenAsset'
```
Based on this definition, jContent knows that it must use a custom picker configured by the `widenPicker` config.
This configuration is made in the spring configuration file [widen-picker.xml][widenPicker.xml].

First of all, the functions in the [widen-asset-picker.js][widenAssetPicker.js]
file must be set in the javascriptResources pool for GWT.
```xml
<bean class="org.jahia.ajax.gwt.helper.ModuleGWTResources">
    <property name="javascriptResources">
        <list>
            <value>/modules/widen-picker/javascript/edit-mode/widen-asset-picker.js</value>
        </list>
    </property>
</bean>
```
Then the functions can be used in the `widenPicker` configuration.
```xml
<bean id="widenPicker" class="org.jahia.services.uicomponents.bean.contentmanager.ManagerConfiguration">
    <property name="titleKey" value="label.wdenAsset@resources.widen-picker"/>
    <property name="customPickerConfiguration">
        <bean class="org.jahia.ajax.gwt.client.widget.content.CustomPickerConfiguration">
            <property name="initMethodName" value="widenPickerInit"/>
            <property name="loadFieldValueMethodName" value="widenPickerLoad"/>
            <property name="getFieldValueFromPickerMethodName" value="widenPickerGet"/>
        </bean>
    </property>
</bean>
```
the `widenPickerInterface` object called in the functions above is declared in the [index][react:index.js]
of the React application.

```js
const widenPickerInterface = {
    _context: {},
    _data: [],

    get context() {
        return this._context;
    },
    get data(){
        return this._data;
    },
    ...
}
...
```
Finally, the object is defined as a global javascript variable attached to the window js object.
Like this, the `widenPickerInterface` is accessible at the iframe level.
```js
...
window.widenPickerInterface = widenPickerInterface;
```

### Widen picker React application
The core of the Widen Picker is a standalone application used like a front end of the Widen API.
The application requests directly the Widen API and its search capabilities, so the
assets returned are always synchronized with the Widen catalog.
#### Architecture

<img src="../images/reactAppArch.png" width="775px"/>

The application starts in the [index.js][react:index.js] file where the context parameters
are checked based on the [douane's schema][react:douaneSchemaIndex.js].
If a parameter is missing a default value is set based on the value declared in the [.env][react:env.js] file.

Then, the cleaned context is send to the [store][react:store.jsx]. The `store` is
a key part of the application. The `store` is the place where :
* all the actions are defined
* all the updates are made
* the `widenPickerInterface` is updated with the selected value :

    ```js
    case "UPDATE_SELECTED_ITEM": {
        ...
        window.widenPickerInterface.removeAll();
        window.widenPickerInterface.add(`${state.mountPoint}/${id}`);
        ...
    },
    ```

The `store` is used by all the application components. These components are in charge of the UI rendering,
as illustrated in the image below.

![appComponent]


#### Configuration
config is done in the [hidden.widenPicker.jsp][hidden.widenPicker.jsp].
Read the config variable declare in the file jahia.properties (cf. [prerequisites]).

```jsp
<%
    Properties properties = (Properties) (Properties) SpringContextSingleton.getBean("jahiaProperties");
    String APIProtocol = properties.getProperty("jahia.widen.api.protocol");
    String APIEndPoint = properties.getProperty("jahia.widen.api.endPoint");
    String APISite = properties.getProperty("jahia.widen.api.site");
    String APIToken = properties.getProperty("jahia.widen.api.token");
    String APIVersion = properties.getProperty("jahia.widen.api.version");
    String JCRMountPoint = properties.getProperty("jahia.widen.edp.mountPoint");
%>
```
Then populate a js context object 
```js
const context_${targetId}={
    widen:{
        url:"<%= APIProtocol %>://<%= APIEndPoint %>",
        version:"<%= APIVersion %>",
        site:"<%= APISite %>",
        token:"<%= APIToken %>",
        mountPoint:"<%= JCRMountPoint %>"
    }
};
```
Finally, when the react widenPicker is ready, it is call with the context.
```js
window.widenPicker("${targetId}",context_${targetId});
```

Note : You can add more variables in the context if you want to create new features or enhance current features
in the React application.
For example, you could expose the timeout variable, or the default result per page, etc.
To do it, you must follow these steps :
1. create a new property in the jahia.properties
2. in the view [hidden.widenPicker.jsp][hidden.widenPicker.jsp], get the property and add it to the context object
3. declare this new property in the [validation schema][react:douaneSchemaIndex.js]
4. read/map/use the property to the [store][react:store.jsx].
By default, the store exposes the context, so the property can be accessed where you want.


#### Run and deploy the App
configure the context in the file [index.html][react:index.html] or set the appropriate values in the [.env][react:env.js]
with the appropriate values.
##### Run the app as standalone for development :
The application is a standard React application build with `npx create-react-app` (cf. [reactjs.org][react.org:CreateNewApp]).
Thus, the command line to run the application is : `npm start`.

##### Build and deploy the app for production :
The application is not build by the jContent module as we do in v8 release.
Also, when your development is finished, you must build and deploy the application.
1. Build the application : `npm run-script build`
2. Deploy the build :
    1. Copy/past files from [src/REACT/build/static/media] to [src/main/resources/icons]
    2. Copy/past files from [src/REACT/build/static/css] to [src/main/resources/css/REACTBuildApp]
    3. Copy/past files from [src/REACT/build/static/js] to [src/main/resources/javascript/REACTBuildApp]
    
        > Update the `main.xxxxxx.chunk.js` with the appropriate url for the *loader* image :
        replace `static/media/` by `modules/widen-picker/icons/`
3. Update the import in the view [hidden.widenPicker.jsp][hidden.widenPicker.jsp]
with the appropriate file name. The content of the file `runtime-main.xxxxxxx.js` is directly past
to the end of the view.
    ```jsp
    <template:addResources type="css" resources="REACTBuildApp/2.xxxxxxxx.chunk.css" />
    <template:addResources type="css" resources="REACTBuildApp/main.xxxxxxxxx.chunk.css" />
    
    <template:addResources type="javascript" resources="REACTBuildApp/2.xxxxxxxxx.chunk.js" />
    <template:addResources type="javascript" resources="REACTBuildApp/main.xxxxxxxxx.chunk.js" />
    ...
   
    <script>
    ...
   
        !function(e){function r(r){for(var n,i,l=r[0],p=r[1],f=r[2],c=0,s=[];c<l.length;c++)i=l[c],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&s.push(o[i][0]),o[i]=0;for(n in p)Object.prototype.hasOwnProperty.call(p,n)&&(e[n]=p[n]);for(a&&a(r);s.length;)s.shift()();return u.push.apply(u,f||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,l=1;l<t.length;l++){var p=t[l];0!==o[p]&&(n=!1)}n&&(u.splice(r--,1),e=i(i.s=t[0]))}return e}var n={},o={1:0},u=[];function i(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=e,i.c=n,i.d=function(e,r,t){i.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,r){if(1&r&&(e=i(e)),8&r)return e;if(4&r&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)i.d(t,n,function(r){return e[r]}.bind(null,n));return t},i.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(r,"a",r),r},i.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},i.p="/";var l=this["webpackJsonpwiden-picker"]=this["webpackJsonpwiden-picker"]||[],p=l.push.bind(l);l.push=r,l=l.slice();for(var f=0;f<l.length;f++)r(l[f]);var a=p;t()}([]);
        //# sourceMappingURL=runtime-main.4b203344.js.map
   </script>
   
   ```

\[[<< back][README.md]\]

[01_defaultPicker]: ../images/default_picker_1.png
[02_defaultPicker]: ../images/default_Picker_2.png
[003]: ../images/003_widenPicker.png
[pickerArch]: ../images/pickerarch.png
[template]: ../images/template.png
[reactAppArch]: ../images/reactAppArch.png
[appComponent]:  ../images/appComponent.png

[definition.cnd]: ../../src/main/resources/META-INF/definitions.cnd
[widenAssetPicker.js]: ../../src/main/resources/javascript/edit-mode/widen-asset-picker.js
[hidden.widenPicker.jsp]: ../../src/main/resources/nt_base/html/base.hidden.widenPicker.jsp
[react:index.js]: ../../src/REACT/src/index.js
[react:douaneSchemaIndex.js]: ../../src/REACT/src/douane/lib/schema/index.js
[react:env.js]: ../../src/REACT/.env
[react:store.jsx]: ../../src/REACT/src/Store/Store.jsx
[react:index.html]: ../../src/REACT/public/index.html
[widenPicker.xml]: ../../src/main/resources/META-INF/spring/widen-picker.xml
[src/REACT/build/static/css]: ../../src/REACT/build/static/css
[src/REACT/build/static/js]: ../../src/REACT/build/static/js
[src/REACT/build/static/media]: ../../src/REACT/build/static/media

[src/main/resources/css/REACTBuildApp]: ../../src/main/resources/css/REACTBuildApp
[src/main/resources/javascript/REACTBuildApp]: ../../src/main/resources/javascript/REACTBuildApp
[src/main/resources/icons]: ../../src/main/resources/icons

[README.md]: ../../README.md
[prerequisites]: ../../README.md#prerequisites
[provider.md]: ./provider.md

[widenAPI:AssetByQuery]: https://widenv2.docs.apiary.io/#reference/assets/assets/list-by-search-query
[react.org:CreateNewApp]: https://reactjs.org/docs/create-a-new-react-app.html


[image.jsp]: ../../src/main/resources/wdennt_image/html/image.jsp
[image.hidden.getSrc.jsp]: ../../src/main/resources/wdennt_image/html/image.hidden.getSrc.jsp
[video.jsp]: ../../src/main/resources/wdennt_video/html/video.jsp
[video.player.vjs.jsp]: ../../src/main/resources/wdennt_video/html/video.player.vjs.jsp
[video.stream.jsp]: ../../src/main/resources/wdennt_video/html/video.stream.jsp
[pdf.link.jsp]: ../../src/main/resources/wdennt_pdf/html/pdf.link.jsp
[pdf.viewerHTML5.jsp]: ../../src/main/resources/wdennt_pdf/html/pdf.viewerHTML5.jsp
[pdf.jsp]: ../../src/main/resources/wdennt_pdf/html/pdf.jsp



[videojs.com]: https://videojs.com

[widenAPI:AssetById]: https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id