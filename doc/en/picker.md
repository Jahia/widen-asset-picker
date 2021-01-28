\[[<< back][README.md]\]
# Widen Picker

- [Reminder about picker](#module-content)
- [Components](#quick-start)
    - [Overview](#data-flow)
        - [Data flow](#data-flow)
    - [Javascript Interface](#javascript-interface)
        - [Architecture](#architecture)
            - [widenPickerInit()](#widenpickerinit)
            - [widenPickerLoad(data)](#widenpickerloaddata)
            - [widenPickerGet()](#widenpickerget)
        - [Configuration](#configuration)
    - [Widen Picker React Application](#widen-picker-react-application)
        - [Architecture](#architecture-1)
        - [Configuration](#configuration-1)
        - [Run and deploy the App](#run-and-deploy-the-app)
            - [Run the App as standalone for development](#run-the-app-as-standalone-for-development-)
            - [Build and deploy the app for production](#build-and-deploy-the-app-for-production-)


This section presents details about the picker that contributors use to search and select Widen content from
a jContent node.

Before a deep dive into the Widen picker, you should understand the basics of the default jContent picker.

## Reminder about picker
A picker is a user interface (UI) used by a jContent contributor to search and select a referenced node or content from
  a master node or content form field. In other words, this is how to create a reference between two nodes or content.
  
With a picker, a contributor can:
1. Browse a content tree (internal or external).

    ![01_defaultPicker]
2. Run a fulltext search through metadata like **name** or **tags**.

    ![02_defaultPicker]
3. Upload a binary (such as a text file, image, or video) from the file system.
4. Select the content to reference.

jContent provides a default picker that works with all JCR nodes and there is a dedicated section where
a contributor can browse external repositories.

However, this module doesn't use the default picker because:
* The search UI of the default picker doesn't support search facets.
* The search UI is a bit complex to extend if you want to support facets.

So, we have decided to create our own picker, named `Widen Picker`: 

![003]

> Although for the moment this module doesn't use the facet approach,
the picker is ready to use one and is easy to extend.


## Components
The picker is based on a standalone REACT application.
This application is the frontend of the Widen Asset API. The Widen picker is used to:
* search and select the appropriate media content in the Widen assets catalog.
* create and return a node path to jContent. This path is resolved later by the [provider][provider.md]
to create the node.

Even if the picker is a standalone REACT application, it must be linked to jContent to reference the selected
Widen asset as a JCR node. This link is done through a Javascript interface.

### Overview

<img src="../images/pickerArch.png" width="775px"/>

The Content editor extension **Widen Picker**  is mainly composed of a [React application][react:index.js] named `WidenPicker`.
To be loaded, this application must register with jContent. For that purpose, Jahia has created
an npm/yarn module named `ui-extender`, which is a part of the `Webpack App Shell`
project in Jahia ([read more about App Shell][medium:AppShell]).

### Application build and registration
First of all, keep in mind that the **Widen Picker** is a React application built on the fly when
the module is deployed.
When the build is done, the application is loaded and the registration process starts.

#### Build the front application
In this documentation, we will not dig to much into details about how to build a front application
in a Jahia module, but just give you an overview of it.

To deploy [nodejs], to install [yarn] packages and to build the React application from maven,
the module uses the [frontend-maven-plugin].
To build the module the plugin has to excute three steps:
* Install the binary for node v11.15.0 and yarn v1.12.3.
* Upload and install the yarn packages referenced in the [packages.json] file.
* Run the build command `yarn webpack`.

To execute these steps, the plugin is configured in the [pom.xml] file as follows:

```xml
<plugin>
    <groupId>com.github.eirslett</groupId>
    <artifactId>frontend-maven-plugin</artifactId>
    <version>1.6</version>
    <!-- executions go here -->
    <executions>
        <execution>
            <id>npm install node and yarn</id>
            <phase>generate-resources</phase>
            <goals>
                <goal>install-node-and-yarn</goal>
            </goals>
            <configuration>
                <nodeVersion>v11.15.0</nodeVersion>
                <yarnVersion>v1.12.3</yarnVersion>
            </configuration>
        </execution>
        <execution>
            <id>yarn install</id>
            <phase>generate-resources</phase>
            <goals>
                <goal>yarn</goal>
            </goals>
        </execution>
        <execution>
            <id>yarn post-install</id>
            <phase>generate-resources</phase>
            <goals>
                <goal>yarn</goal>
            </goals>
            <configuration>
                <arguments>${yarn.arguments}</arguments>
            </configuration>
        </execution>
    </executions>
</plugin>
```

Yarn arguments are:

```
<yarn.arguments>build -p</yarn.arguments>
<yarn.arguments>webpack</yarn.arguments>
```

`App Shell` has also to be declare in the [pom.xml] file as follows:

```xml
<dependency>
    <groupId>org.jahia.modules</groupId>
    <artifactId>app-shell</artifactId>
    <version>2.0.0</version>
    <type>json</type>
    <classifier>manifest</classifier>
    <scope>provided</scope>
</dependency>
```
It is used to build a manifest of common libraries.
This manifest is then used by webpack through the `DllReferencePlugin` as written
in the [webpack.config] file:

```js
plugins: [
    new webpack.DllReferencePlugin({
        manifest: require(manifest)
    }),
]
```

### Registration flow

As written previously, this application must register with jContent to be available in a content form.
The registration process is part of the the `Webpack App Shell` project.
As defined in the [webpack.config] file, the main entry of the application is the 
[src/javascript/index.js][react.src.index.js] file:

```js
entry: {
    main: [
        path.resolve(__dirname, 'src/javascript/publicPath'),
        path.resolve(__dirname, 'src/javascript/index.js')
    ]
}
```
In this file, we register a `callback` named `contentEditorExtensions` which is executed during
the initialisation of the Jahia UI with a priority of 20. The callback function execute the code in
the [ContentEditorExtensions.register][] file. 

```js
import {registry} from '@jahia/ui-extender';
import register from './ContentEditorExtensions.register';

registry.add('callback', 'contentEditorExtensions', {
    targets: ['jahiaApp-init:20'],
    callback: register
});
```
> the registry object comes from the yarn module `@jahia/ui-extender`

The code of the register above is just a a pipe to the file [SelectorTypes.js]:

```js
import DamWidenPickerCmp from './DamWidenPicker';
import {registerWidenPickerActions} from "./DamWidenPicker/components/actions";

export const registerSelectorTypes = registry => {
    registry.add('selectorType', 'WidenPicker', {cmp: DamWidenPickerCmp, supportMultiple: false});
    registerWidenPickerActions(registry);
};
```

The code of this file is the one to register our application as a `selectorType` named `WidenPicker`.
Our selector cannot be used by a content property which allows multiple values, and 
the application to used to render the selector is the `DamWidenPickerCmp` component.
This component is the main entry of our Widen picker React application.






### Widen picker React application
The core of the Widen Picker is a Readt application used like a front end of the Widen API.
The application directly requests the Widen API and uses its search capabilities so the
assets returned are always synchronized with the Widen catalog.
#### Architecture

<img src="../images/reactAppArch.png" width="850px"/>

The application starts in the [index.js][react:index.js] (1) file where the context parameters
are checked based on the [douane's schema][react:douaneSchemaIndex.js] (2).
If a parameter is missing, a default value is set based on the value declared in the [.env][react:env.js] file.

Then, the cleaned context is send to the [store][react:store.jsx] (3). The `store` is
a key part of the application. The `store` is the place where:
* all the actions are defined
* all the updates are made
* the `widenPickerInterface` is updated with the selected value:

    ```js
    case "UPDATE_SELECTED_ITEM": {
        ...
        window.widenPickerInterface.removeAll();
        window.widenPickerInterface.add(`${state.mountPoint}/${id}`);
        ...
    },
    ```

The `store` is used by all the application components (4). These components are in charge of the UI rendering,
as illustrated in the image below.

![appComponent]


#### Configuration
The configuration is defined in the [hidden.widenPicker.jsp][hidden.widenPicker.jsp].
First, we read the variables declared in the file jahia.properties (see [prerequisites]).

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
Then we populate a JS context object.
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
> This context object is checked
  by the douane component of the application (cf. step 2 of the [architecture](#architecture-1)).

Finally, when the react widenPicker is ready, it is called with the context. 
```js
window.widenPicker("${targetId}",context_${targetId});
```

> You can add more properties in the context if you want to create new features or enhance current features
in the React application. For example, you could expose the timeout variable or the default result per page.


To add more properties in the context object:
1. Create a new property in the jahia.properties file.
2. In the [hidden.widenPicker.jsp][hidden.widenPicker.jsp] view, get the property and add it to the context object.
3. Declare this new property in the [validation schema][react:douaneSchemaIndex.js].
4. Read/map/use the property to the [store][react:store.jsx].
By default, the store exposes the context, so the property can be accessed where you want.


#### Run and deploy the App

##### Run the app as standalone for development:
Configure the context in the [index.html][react:index.html] file or set the appropriate values in the [.env][react:env.js]
with the appropriate values.
The application is a standard React application build with `npx create-react-app` (see [reactjs.org][react.org:CreateNewApp]).
The command line to install the NPM modules for application is: `npm install`.
The command line to run the application is: `npm start`.
> The command must be run in the [root folder][rootReact] or the React application.

##### Build and deploy the app for production :
The application is not build by the jContent module when it is deployed (*Note: The application is built when deployed for the v8 release*).
Also, when your development is finished, you must build and deploy the application manually:
1. Build the application. From the [root folder][rootReact] or the React application execute the following command:
`npm run-script build`
2. Deploy the build:
    1. Copy and paste files from [src/REACT/build/static/media] to [src/main/resources/icons].
    2. Copy and paste files from [src/REACT/build/static/css] to [src/main/resources/css/REACTBuildApp].
    3. Copy and paste files from [src/REACT/build/static/js] to [src/main/resources/javascript/REACTBuildApp].
    
        > Edit and update the `main.xxxxxx.chunk.js` with the appropriate url for the *loader* image.
        Replace `static/media/` with `modules/widen-picker/icons/`.
3. Update the import in the [hidden.widenPicker.jsp][hidden.widenPicker.jsp] view
with the appropriate file name. The content of the `runtime-main.xxxxxxx.js` file is directly passed
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
4. Build and deploy the jContent module (see [quickstart]).

\[[<< back][README.md]\]

[01_defaultPicker]: ../images/default_picker_1.png
[02_defaultPicker]: ../images/default_Picker_2.png
[003]: ../images/003_widenPicker.png
[pickerArch]: ../images/pickerArch.png
[template]: ../images/template.png
[reactAppArch]: ../images/reactAppArch.png
[appComponent]:  ../images/appComponent.png

[README.md]: ../../README.md
[prerequisites]: ../../README.md#prerequisites
[quickstart]: ../../README.md#quick-start
[provider.md]: ./provider.md
[contentDef.md]: ./contentDefinition.md

[widenAPI:AssetByQuery]: https://widenv2.docs.apiary.io/#reference/assets/assets/list-by-search-query
[react.org:CreateNewApp]: https://reactjs.org/docs/create-a-new-react-app.html
[medium:AppShell]: https://medium.com/jahia-techblog/create-a-modular-ui-with-a-webpack-app-shell-396fa69c9851

[frontend-maven-plugin]: https://github.com/eirslett/frontend-maven-plugin
[nodejs]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[webpack.config]: ../../content-editor-extensions/webpack.config.js

[widenAPI:AssetById]: https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id

[react.src.index.js]: ../../content-editor-extensions/src/javascript/index.js
[ContentEditorExtensions.register]: ../../content-editor-extensions/src/javascript/ContentEditorExtensions.register.jsx
[SelectorTypes.js]: ../../content-editor-extensions/src/javascript/ContentEditorExtensions/SelectorTypes/SelectorTypes.js

[pom.xml]: ../../content-editor-extensions/pom.xml
[packages.json]: ../../content-editor-extensions/package.json

<!-- still use ?-->
[definition.cnd]: ../../content-editor-extensions/src/main/resources/META-INF/definitions.cnd
[widenAssetPicker.js]: ../../content-editor-extensions/src/main/resources/javascript/edit-mode/widen-asset-picker.js
[hidden.widenPicker.jsp]: ../../content-editor-extensions/src/main/resources/nt_base/html/base.hidden.widenPicker.jsp
[react:index.js]: ../../content-editor-extensions/src/REACT/src/index.js
[react:douaneSchemaIndex.js]: ../../content-editor-extensions/src/REACT/src/douane/lib/schema/index.js
[react:env.js]: ../../content-editor-extensions/src/REACT/.env
[react:store.jsx]: ../../content-editor-extensions/src/REACT/src/Store/Store.jsx


[src/main/resources/css/REACTBuildApp]: ../../content-editor-extensions/src/main/resources/css/REACTBuildApp
[src/main/resources/javascript/REACTBuildApp]: ../../content-editor-extensions/src/main/resources/javascript/REACTBuildApp
[src/main/resources/icons]: ../../content-editor-extensions/src/main/resources/icons






#### Data flow
1. The user clicks the GWT form field *Media Content*.
2. The iframe with the *nt:base* node view is loaded.
3. The React application is launched by the view. Depending on the configuration (lazy-loading is possible), the application
requests the last updated content from Widen.

    > The picker uses the Widen API:
    [Assets - List by search query][widenAPI:AssetByQuery].
4. The React application displays the assets returned by the API.
5. The contributor selects a Widen asset.