# widen-asset-picker

This module contains the implementation of the Widen Content Picker for Jahia v7.3.x.

With this modules a contributor can easily add a widen media content to a jahia page.

![](./doc/images/master.png)

- [Module content](#module-content)
- [Quick Start](#quick-start)
- [Module details](#module-details)
    - [Data flow](#data-flow)
    - [Widen Content in jContent](#widen-content-in-jcontent)
    - [Widen Picker](#widen-picker)
    - [Widen Provider](#widen-provider)
- [Discussion around content picker in jContent v7](./doc/extra.md)


## Module content

This module contains :
1. The definition of a `Widen Reference` content ([definition.cnd](./src/main/resources/META-INF/definitions.cnd)).
1. A React application named `Widen Picker` ([index.js](./src/REACT/src/index.js)). This application is a custom jContent picker and is used to pick a widen asset .
1. A *light* implementation of an External Data Provide (EDP) named `Widen Provider` ([WidenDataSource.java](./src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java)).

Not covered by this module :
1. Ckeditor media piker

## Quick Start
### Prerequisites
Before to deploy the module some adjustment must be done in the jahia.properties file (./digital-factory-config/jahia/jahia.properties):
1. Jahia `maxNameSize` must be at least 64 to save widen asset id as system-name.

    uncomment line 260 and change value 32 to 64
    ```
    (-) #jahia.jcr.maxNameSize = 32
    (+) jahia.jcr.maxNameSize = 64
   ```
1. Add your widen configuration to the end of file :
    ```
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
    For example :
    ```
    ####
    # Widen Config
    ####
    jahia.widen.api.protocol = https
    jahia.widen.api.endPoint = api.widencollective.com
    jahia.widen.api.site = acme
    jahia.widen.api.token = ba2d0a71907a17sff9eb9dc1fc91fd3a
    jahia.widen.api.version = v2
    jahia.widen.edp.mountPoint = /sites/systemsite/contents/widen
    ```
### Deploy the module
The module can be installed in 2 ways, from the source or from the store (available soon)
#### From the source
1. Clone this repository or download the zip archive.
1. Go to root of the repository
1. Run the command line `mvn clean install`. This create a jar file in the `target` repository
1. From jContent Goto `Administration` mode
1. Expand `System components` entry and click `Modules`
1. From the right panel click `SELECT MODULE`, and select the jar file created in step 3
1. Finaly click `UPLOAD` 

    ![](doc/images/030_install.png)

#### From the store
Available soon.

#### Check install
If the module is properly deployed :
1. You should see the `WidenProvider` key in the list of External provider.

    ![](doc/images/031_install_completed.png)

1. You should be able to create a new `Widen Reference` content.

    ![](doc/images/001_menu-select.png)

## Module details

To pick a widen asset (video, image, pdf...) from a Widen Cloud intance, Jahia needs 2 mains implementations :
1. A light External Data Provider (EDP), named `Widen Provider`, used to map a Widen asset return as JSON by the widen API into a Jahia node
1. A React application, named `Widen Picker`, used as content picker into Jahia. 
This picker is a user interface (UI) from which jahia contributor can query a Widen server to find and 
select the media asset he wants to use in website.

### Data flow

![](./doc/images/010_archi.png)

1. User creates a new `Widen` content (aka as `Widen Reference`, cf. [Module content](#module-content) ).

    ![](./doc/images/0011_menuSelect2.png)
    <!-- .element style="max-width:350px;" -->

    Then jContent displays a contributor form with a field Media Content.

    ![](./doc/images/002_widenReference.png)

1. When user click the field *Media Content* in the form above, the React application `Widen Picker` is launch in iframe. 
    By default, lazyload is false and the application executes an AJAX call to the widen API endpoint to populate the picker -
    [more details here](#widen-picker).
    
    *The picker uses the Widen API : [Assets - List by search query](https://widenv2.docs.apiary.io/#reference/assets/assets/list-by-search-query)*.

1. The widen endpoint return a JSON file uses by the app to display the search contents. Now the user can refine the search or select a widen asset.

    ![](./doc/images/0041_widenPickerSelected.png)

1. When the user save its choice from the picker, a content path is returned to jContent. This path is build with the value of `jahia.widen.edp.mountPoint`
    and the `id` of the widen asset.
    
    **Note :** jContent checks if this path refers to a jahia node. For that, the path is mapped to a jahia node 
    through the `Widen Provider`.
    
1. If the asset picked is not in the jContent cache, the provider call the widen API endpoint to get all the relevant properties about the asset picked - [more details here](#widen-provider).
        
    *The provider use the Widen API : [Assets - Retrieve by id](https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id)*.
    
1. The JSON response returned by the API is mapped to a jahia node and cached into an ehcache instance named `cacheWiden`.
    By default, This cache is configured to keep the content 8h maximum and to drop the content if it is idle more than 1 hour. 
    
1. If the path provided in step 4 is correct, the provider return a jahia reference node and the contributor can save its `Widen Reference`
    content.
    
    ![](./doc/images/005_widenReferenceSelected.png)
    
1. The content can be used by a jContent Page. This module provides jContent views for different type of widen asset (image, video...).

1. The jContent views use the widen CDN URL (aka as embeds.templated.url property) to get and display the content in webpage.
the use of a Widen CDN guarantees good loading performance as well as the proper functioning of widen statistics.

    ![](./doc/images/0061_widenAssetInSite.png)
   
### Widen content in jContent
jContent v7 restrict the usage of a picker to a JCR node only. Thus, to be able to pick an external widen content,
an equivalent of this widen content is required as a node in jContent.
A node is also usefull to create a dedicated rendering thought a set of views.


#### Architecture overview
The node type architecture implemented in this module is design to be easily extended
by a customer or its integrator.
Indeed, a customer can create in Widen its own metadata and content definition. So, this modules cannot cover
all the possible case. But, new multimedia node types can be easily created.

**Note :** Node types and mixin definitions, discussed later in this section, are written in the file [definition.cnd](./src/main/resources/META-INF/definitions.cnd).

The module provides multiple mixins (explained later) and 5 node types :
1. `wdennt:widenReference`
1. `wdennt:image`
1. `wdennt:video`
1. `wdennt:pdf`
1. `wdennt:document`

![](./doc/images/040_nodeArch.png)

From this 5 node types only `wdennt:widenReference` is accessible thought the creation menu.
 
#### wdennt:widenReference
This node type is the only accessible thought the creation menu. In other words,
to add a widen asset into a page, a contributor must create new `wdennt:widenReference` alias *Widen* in the UI.

![](./doc/images/0011_menuSelect2.png)
<!-- .element style="max-width:350px;" -->

##### Definition
This node type is defined like this :
```
[wdennt:widenReference] > jnt:content,jmix:nodeReference, jmix:multimediaContent
 - j:node (weakreference, picker[type='custom',config='widenPicker']) < 'wdenmix:widenAsset'
```

`wdennt:widenReference` extends 3 supertypes :
1. `jnt:content` : the node type is a content node type
1. `jmix:multimediaContent` : the node type will appear in the *Content:Multimedia* menu entry (see image above)
1. `jmix:nodeReference` : the node is like a *wrapper* used to reference a subset of mutlimedia nodes.
    this mixin provide a default attribute `j:node` uses to store the path of the node in reference. 

The property `j:node` is overwritten to use a custom picker named [widenPicker](#widen-picker)
and restrict the allowed node type to be picked to node types that extends `wdenmix:widenAsset`.

###### Mixins
###### wdenmix:widenAsset
The mixin `wdenmix:widenAsset` is used to map the commons JSON properties return by the Widen API.
As, these properties are common to all assets return by widen, each jContent node type must be extends this mixin.

**Note :** the mapping process is covered later in section [Widen Provider](#widen-provider).

The Widen API allows client to expand the JSON response with the *expand* property (cf. [Assets - List by search query](https://widenv2.docs.apiary.io/#reference/assets/assets/list-by-search-query)
or [Assets - Retrieve by id](https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id) documentation).

In our case we expand the query with *embeds*, *thumbnails* and *file_properties*. The JSON response returned by the API looks
like this: 

```
{
    "id": "1eca8de8-f57b-4974-96e4-c7d24cb7a82d",
    "external_id": "jzrdv8kipa",
    "filename": "Image dog + cat in snow.jpg",
    "created_date": "2020-11-18T14:31:10Z",
    "last_update_date": "2020-11-18T16:17:58Z",
    "file_upload_date": "2020-11-18T14:31:10Z",
    "deleted_date": null,
    "released_and_not_expired": true,
    "asset_properties": null,
    "file_properties": {...},
    "metadata": null,
    "metadata_info": null,
    "security": null,
    "status": null,
    "thumbnails": {...},
    "embeds": {...},
    "expanded": {...},
    "_links": {...}
}
```
From this JSON, commons properties to map are :
`id`, `external_id`, `filename`, `created_date`, `last_update_date`, `deleted_date` and `thumbnails`

Thus, the definition of our mixin looks like this :
```
[wdenmix:widenAsset] > jmix:structuredContent, jmix:tagged, jmix:keywords, mix:title mixin
 - wden:id (string) fulltextsearchable=no
 - wden:externalId (string) fulltextsearchable=no
 - wden:filename (string) fulltextsearchable=no
 - wden:createdDate (string) fulltextsearchable=no
 - wden:updatedDate (string) fulltextsearchable=no
 - wden:deletedDate (string) fulltextsearchable=no
 - wden:thumbnail (string) fulltextsearchable=no
```

As discussed before, the API is expanded with *embeds*, *thumbnails* and *file_properties*.
`embeds` and `file_properties` depend on the asset type return by the API, but contains also commons properties.
Thus, the module contains 2 others mixins `wdenmix:embed` and `wdenmix:fileProperties` to map these commons properties.

###### wdenmix:embed
The mixin `wdenmix:embed` is used to map the commons properties available in the `embeds` object returned by the Widen API.

```
{
    "id": "1eca8de8-f57b-4974-96e4-c7d24cb7a82d",
    ...
    "embeds": {
        "(àX()": {...},
        "640px-landscape": {...},
        "640px-portrait": {...},
        "Facebook-cover": {...},
        "PostFacebook/Instagram": {...},
        "Website": {...},
        "original": {...},
        ...
        "templated": {
            "url": "https://embed.widencdn.net/img/<acme>/jzrdv8kipa/{size}px@{scale}x/Image-dog--cat-in-snow.jpg?q={quality}&x.template=y",
            "html": null,
            "share": null,
            "apps": []
        }
    },
    ...
}
```
In our case, we want to map the property `embeds.templated.url`. So the mixin definition looks like this :
```
[wdenmix:embed] mixin
 - wden:templatedUrl (string) fulltextsearchable=no
```

###### wdenmix:fileProperties
The mixin `wdenmix:fileProperties` is used to map the commons properties available in the `file_properties` object returned by the Widen API.
```
{
    "id": "1eca8de8-f57b-4974-96e4-c7d24cb7a82d",
    ...
    "file_properties": {
        "format": "JPEG",
        "format_type": "image",
        "size_in_kbytes": 2255,
        "image_properties": {...},
        "video_properties": null
    },
    ...
}
```
In the case above, the asset is an image so `image_properties` is an object and `video_properties` is null.
Indeed, These properties are respectively populated only if the asset is an image or a video.

Properties common to each asset type are `format`, `format_type` and `size_in_kbytes`.
 
So the mixin definition looks like this :

```
[wdenmix:fileProperties] mixin
 - wden:format (string)
 - wden:type (string)
 - wden:sizeKB (long)
```

##### Views
The module provides the [default view](./src/main/resources/wdennt_widenReference/html/widenReference.jsp) 
for the node type. This view is in charge to call the appropriate view for the content in reference.
Extra parameters are defined to provide a set of image width in case content in reference is an image or
the pdf viewer height in case the content in reference is a PDF.

These paramaters are contributed from the UI.
Enable *Image Advanced Settings* in case of image or *PDF Advanced Settings* in case of PDF.

![](./doc/images/005_widenReferenceSelected.png)

These parameters are defined by the mixins `wdenmix:imageMediaSettings` and `wdenmix:pdfMediaSettings`.

###### wdenmix:imageMediaSettings
```
[wdenmix:imageMediaSettings] mixin
 extends = wdennt:widenReference
 itemtype = content
 - wden:defaultImageSize (long)
 - wden:imageSizes (long) multiple
```
###### wdenmix:pdfMediaSettings
```
[wdenmix:pdfMediaSettings] mixin
 extends = wdennt:widenReference
 itemtype = content
 - wden:pdfMinHeight (long)
```

If needed, you can create your own mixin to extend `wdennt:widenReference`
and offer the contributor the capacity fine-tuning a specific content.

#### wdennt:image
This node type is used to map a Widen Asset of type *image* : `file_properties.format_type = 'image'`.
A `wdennt:image` node has a dedicated set of properties and views.


##### Definition
This node type is defined like this :
```
[wdennt:image] > jnt:content, wdenmix:widenAsset, wdenmix:imageFileProperties, wdenmix:embed
```

`wdennt:image` extends 4 supertypes :
1. `jnt:content` : the node type is a content node type
1. `wdenmix:widenAsset` : the node will inherit commons attributes of a widen node type (see [above](#-wdenmixwidenasset))
1. `wdenmix:imageFileProperties` : the node will inherit commons attributes of file properties (see [above](#-wdenmixfileproperties))
    and new one specific to image asset (explain [below](#-wdenmiximagefileproperties)).
1. `wdenmix:embed` : the node will inherit commons attributes of embed properties (see [above](#-wdenmixembed))

The node type doesn't have specific property. All the property comes from supertypes.

###### Mixin

###### wdenmix:imageFileProperties
The mixin `wdenmix:imageFileProperties` extends the mixin `wdenmix:fileProperties`. The mixin is used to map
the specifics JSON properties returned for an image or a video asset.

For an image, those properties are `image_properties.width`, `image_properties.height` and `image_properties.aspect_ratio` as presented in the JSON below.

```
{
    "id": "1eca8de8-f57b-4974-96e4-c7d24cb7a82d",
    ...
    "file_properties": {
        "format": "JPEG",
        "format_type": "image",
        "size_in_kbytes": 2255,
        "image_properties": {
            "width": 4288.0,
            "height": 2848.0,
            "aspect_ratio": 1.505617977528
        },
        "video_properties": null
    },
    ...
}
```

To store those properties, the mixin is defined like this :
```
[wdenmix:fileProperties] mixin
 - wden:format (string)
 - wden:type (string)
 - wden:sizeKB (long)
```

##### Views
The module provides :
* a [default view](./src/main/resources/wdennt_image/html/image.jsp) which return the HTML tag 

    ```
    <img width="100%"
         src="<widen cdn image url>" 
         srcset="<widen cdn image urls for each selected width>"
         sizes="<prefered image sizes based on element width>"
         class="<css classname to apply>"
         alt="<filename>"
    />
    ``` 
    The widen cdn image URL is the value stored in the property `wden:templatedUrl`.
    This value contains variables `{size}`, `{scale}` (cf. [json](#-wdenmixembed)) resolved by the view.
    This allows the user (cf. [Image Advanced Settings](#wdenmiximagemediasettings))
    or the template integrator to get the image with the desired size (`defaultWith` : 768).
    
    A srcset can also be created based on width in a list (`widths` : [256, 512, 768, 1024, 1280, 1600, 2000]).
    
    Other variables can be provided to the view to customize the rendering of the tag :
    * `sizes` : default `'(min-width: 600px) 1024px, 512px'`
    * `class` : no default value

* an [hidden view](./src/main/resources/wdennt_image/html/image.hidden.getSrc.jsp)

    ```
    <c:set target="${moduleMap}" property="src" value="${src}" />
    <c:set target="${moduleMap}" property="srcset" value="${srcset}" />
    ```
    This view return the image src and srcset resolved in the same way as we did for the default view.
    Here the view doesn't return an HTML tag, but only variables which can be used by the caller this way :
    ```
    <template:include view="hidden.getSrc">
        <template:param name="widths" value="1024"/>
        <template:param name="defaultWidth" value="1024"/>
    </template:include>
    
    <div class="scaling-image h-100">
        <div class="frame h-100">
            <div class="feature-img-bg h-100" style="background-image: url('${moduleMap.src}');">
            </div>
        </div>
    </div>
    ```
    **Note :** To resolve the case above, **best practice** should be to create a dedicated **tag library** to resolve the URL.
    Feel free to contribute.
    
#### wdennt:video
##### Definition
##### Views

#### wdennt:pdf
##### Definition
##### Views

#### wdennt:document
##### Definition
##### Views



#### How to extend? example of the audio content type

Thus, if in your Widen Server you create a new media content type like *audio*.
To be able to pick it and store a specific set of metadata related to this type into jContent,
you need a specific node type definition. Also, you will create something like `wdennt:audio`.

To be able to pick this node type from the picker you just need to extend your `wdennt:audio`
node type with the mixin `wdenmix:widenAsset`. Like this, you don't need to touch the definition
of `wdennt:widenReference`)

At this stage, the audio node type definition should looks like :
```
[wdennt:audio] > jnt:content, wdenmix:widenAsset
```

**Note :** you must update the mapping part of the [Widen Provider](#widen-provider)
to have your `wdennt:audio` fully usable in jContent.

#### Usage
This wrapper is required to use the referenced node in a particular "context",
for example to apply a specific view or to fill a set of specific options. 

TODO schema view et params


##### image, video...
Based on the JSON property filetype returned by the API jContent create the appropriate node type (cf. [Widen Provider](#widen-provider))
why ? -> view and specific properties

Pas de table car pas de code bloc...


#### Views
    
### Widen Picker
WORK IN PROGRESS

In order to get all the relevant information the app use the `expand` query parameters with the value `embeds,thumbnails,file_properties`
    (cf. [code](./src/REACT/src/misc/data.js)) 
    
### Widen Provider
WORK IN PROGRESS
Query API
(cf. [queryWiden](./src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java)).

Cache
(cf. [start](./src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java)).

```
CACHE_NAME = "cacheWiden";
TIME_TO_LIVE_SECONDS = 28800;
TIME_TO_IDLE_SECONDS = 3600;
```

In Jahia EDP can is used to map external asset to jahia node (e.i. tmdb ->linkto),
get multilevel -> create a tree to browse for content explorer,
search from lucene index/augmented search
add additionnal content to external node....
But in our case we don't need all of this features but we only want to picker asset one by one.
So :
1. no need to create a folder with chidren inside
1. no need to implement the search part as we will have a customer picker using directle the widen search api
1. no need to add more content to our asset

Based on these requirements we don't need to implement all the EDP methods and we can qualify our
EDP as Light EDP.

#### Architecture
1. spring/widen-picker.xml
1. org.jahia.se.modules.widenprovider.WidenDataSource -> to enhance use jackson to map json to object
link to edp doc, add tools cache link too
1. config file jahia.properties -> to enhance use .cfg and OSGI




