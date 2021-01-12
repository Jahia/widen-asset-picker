# widen-asset-picker

This module contains the implementation of the Widen Content Picker for Jahia v7.3.x.

With this module, a contributor can easily add a Widen media asset to a Jahia page.

![](./doc/images/master.png)


- [Module content](#module-content)
- [Quick Start](#quick-start)
- [Module details](#module-details)
    - [Data flow](#data-flow)
    - [Widen assets in jContent](#widen-assets-in-jcontent)
    - [Widen Picker](#widen-picker)
    - [Widen Provider](#widen-provider)
    - [How to handle a new media content created in Widen - example of the audio content type](#how-to-handle-a-new-media-asset-created-in-widen---example-of-the-audio-content-type)


## Module content

This module contains :
* The definition of a `Widen Reference` content ([definition.cnd][definition.cnd]).
* A React application named `Widen Picker` ([index.js][react:index.js]).
    This application is a custom jContent picker and is used to pick a Widen asset.
* A *light* implementation of an External Data Provider (EDP) named
    `Widen Provider` ([WidenDataSource.java]).

Not covered in this module :
* CKEditor widen media picker

## Quick Start
### Prerequisites
Before deploying the module, you must make the following changes to the jahia.properties file (*digital-factory-config/jahia/jahia.properties*):
1. The size of the `System name` must be greater than the default 32 characters to allow you to save a Widen *asset id* in it.

    uncomment line 260 and change value 32 to 64
    ```
    (-) #jahia.jcr.maxNameSize = 32
    (+) jahia.jcr.maxNameSize = 64
   ```
1. Add your widen configuration to the end of file:
    ```properties
    ####
    # Widen Config
    ####
    jahia.widen.api.protocol = <http protocol>
    jahia.widen.api.endPoint = <widen api endpoint>
    jahia.widen.api.site = <your widen site name>
    jahia.widen.api.token = <your widen api token>
    jahia.widen.api.version = <api version>
    jahia.widen.edp.mountPoint = <jContent mount point>
    ```
    For example:
    ```properties
    ####
    # Widen Config
    ####
    jahia.widen.api.protocol = https
    jahia.widen.api.endPoint = api.widencollective.com
    jahia.widen.api.site = acme
    jahia.widen.api.token = ba2d0a71907a17sff9eb9dc1fc91fd3a
    jahia.widen.api.version = v2
    jahia.widen.edp.mountPoint = /sites/systemsite/contents/dam-widen
    ```
   
   > You must restart jContent to have these properties available in the environment.

   > Note : The jContent v8 connector uses a .cfg file and properties can be hot deployed

### Deploy the module
The module can be installed in 2 ways, from the source or from the store (available soon)
#### From the source
1. Clone or download the zip archive of the latest release.
1. Go to the root of the repository.
1. Run the command `mvn clean install`. This create a jar file in the *target* repository.
1. In jContent, go to `Administration` mode.
1. Expand the `System components` entry and click `Modules`.
1. From the right panel, click `SELECT MODULE` and select the jar file in the *target* repository.
1. Finaly click `UPLOAD`.

    ![][030]

#### From the store
Available soon.

#### Check install
If the module is properly deployed:
1. You should see the `WidenProvider` key in the list of External providers.

    ![][031]

1. You should be able to create a new `Widen Reference` content.

    <img src="./doc/images/0011_menuSelect2.png" width="375px"/>

## Module details

To pick a widen asset (video, image, pdf...) from a Widen Cloud instance, you need to implement:
1. A *light* External Data Provider (EDP), named `Widen Provider`,
    that maps the JSON returned by the widen API and represents the Widen asset into a Jahia node.
1. A React application, named `Widen Picker`, used as a content picker into Jahia. 
    This picker is a user interface (UI) from which a jContent user can query a Widen server to find and 
    select the media asset they want to use on the website.

### Data flow

![][010]

The data flow is composed by 10 actions of which 4 are optionals and depend on the cache. 

1. The user creates a new `Widen` content (aka as `Widen Reference`).

    <img src="./doc/images/0011_menuSelect2.png" width="375px"/>
    
    Then, jContent displays a user form with a **Media Content** field.

    ![][002]

2. When user clicks the **Media Content** field, the React application `Widen Picker` is launched into an iframe. 
    By default, the lazy-loading is set to false, and the application executes an AJAX call to the widen API endpoint to populate the picker. For
    more details see [the Widen Picker][picker.md] section.
    
    > The picker uses the Widen API: [Assets - List by search query][widenAPI:AssetByQuery].

3. The widen endpoint returns a JSON file uses by the app to render the search contents. The user can refine the search or select a Widen asset.

    ![][0041]

4. When the user saves his choice from the picker, a content path is returned to jContent. This path is build with the value of `jahia.widen.edp.mountPoint`
    and the `id` of the Widen asset.
    
    > jContent checks if this path refers to a Jahia node. The path is resolved and mapped to a Jahia node 
    with the help of the `Widen Provider`.
    
5. If the asset picked is not in the jContent cache, the provider calls the widen API endpoint to get all the relevant properties
about the asset picked - more details later in [the Widen Provider][provider.md] section.
        
    > The provider uses the Widen API : [Assets - Retrieve by id][widenAPI:AssetById].

6. The JSON response returned by the API is mapped to a Jahia node and cached into an Ehcache instance named `cacheWiden`.
    By default, the cache is configured to keep the content for a maximum of 8 hours and to drop the content if it is idle for more than 1 hour. 
    
7. If the path provided in step 4 is correct, the provider return a Jahia reference node, and the user can save his `Widen Reference`
    content.
    
    ![][005]
    
8. The content can be used by a jContent Page. This module provides jContent views for different type of widen asset (image, video...).

9. The jContent views use the widen CDN URL (aka *embeds.templated.url* property) to get and render the content in a webpage.
the use of a Widen CDN ensures good loading performance as well as the proper functioning of widen statistics.

10. The Widen asset is rendered into the website.

    ![][0061]
   
### Widen assets in jContent
[Read this dedicated page][contentDefinition.md]
 
### Widen Picker
[Read this dedicated page][picker.md]

### Widen Provider
[Read this dedicated page][provider.md]

### How to handle a new media asset created in Widen - example of the audio content type
[Read this dedicated page][enhance.md]



[030]: ./doc/images/030_install.png
[031]: ./doc/images/031_install_completed.png
[010]: ./doc/images/010_archi.png
<!--[001]: ./doc/images/001_menu-select.png
[0011]: ./doc/images/0011_menuSelect2.png-->
[002]: ./doc/images/002_widenReference.png
[0041]: ./doc/images/0041_widenPickerSelected.png
[005]: ./doc/images/005_widenReferenceSelected.png
[0061]: ./doc/images/0061_widenAssetInSite.png

[contentDefinition.md]: ./doc/en/contentDefinition.md
[picker.md]: ./doc/en/picker.md
[provider.md]: ./doc/en/provider.md
[enhance.md]: ./doc/en/enhance.md

[definition.cnd]: ./src/main/resources/META-INF/definitions.cnd
[react:index.js]: ./src/REACT/src/index.js
[WidenDataSource.java]: ./src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java

[widenAPI:AssetByQuery]: https://widenv2.docs.apiary.io/#reference/assets/assets/list-by-search-query
[widenAPI:AssetById]: https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id




