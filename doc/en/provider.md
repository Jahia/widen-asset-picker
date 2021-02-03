\[[<< back][README.md]\]
# Widen Provider

- [Architecture](#architecture)
    - [Resolve the node path](#resolve-the-node-path)
    - [Query Widen API](#query-widen-api)
        - [Before to Query check the cache](#before-to-query-check-the-cache-)
        - [Query Widen API](#query-widen-api)
    - [JSON to JCRNodeWrapper](#json-to-jcrnodewrapper)
- [Mount Point](#mount-point)

The provider is an implementation of an External Data Provider (EDP).
In jContent, an EDP is used to:
* map an external asset to a JCR node (JCRNodeWrapper).
* create a tree hierarchy to browse nodes in content explorer.
* enable the search capabilities for an external asset via Lucene (used by the default content picker)
or *Augmented Search*.
* add new properties to an external asset. A user can contribute these properties.

The main example of an EDP is the [tmdb-provider][tmdbProvider].

But in our case we don't need all of these features. We only want to pick asset one by one. There is no need to:
* create a folder with children inside
* implement the search part as we have a custom picker that directly uses the Widen search API
* add more content to our assets

Based on these requirements, we don't need to implement all the EDP methods and we can qualify our
EDP as Light EDP.

## Architecture

As presented in the [data flow][dataFlow], the provider maps a Widen asset (JSON) to a jContent node (JCRNodeWrapper).
The mapping is done in 3 steps:
1. Resolve the node path returned by the picker `jahia.widen.edp.mountPoint`/`id` of the Widen asset.
2. Query Widen API to get the properties of the asset.
3. Map the JSON to a JCRNodeWrapper.

Steps 1 & 2 are done in [WidenDataSource.java]
and steps 3 is done in [WidenAssetDeserializer.java]
### Resolve the node path
To resolve a path, the provider implements two methods:
1. `getItemByPath`
2. `getItemByIdentifier`

#### getItemByPath
This method is very simple. It extracts the widen ID from the node path received and calls
the `getItemByIdentifier` method with the extracted id as parameter.

#### getItemByIdentifier
This method:
1. finds the Widen asset identified by its id 
2. transforms the Widen asset into a JCR node


### Query Widen API

#### Before to Query check the cache!
To avoid unnecessary calls, the module uses a dedicated
cache to store the JCR node created after a Widen call. The name of this cache is "cacheWiden".
The cache is set up in the [WidenCacheManager.java] class.

This cache is configured to keep an idle object for 1 hour (3600s) and to remove an object after 8 hours (28800s).
The configuration looks like this:
```java
private static final String CACHE_NAME = "cacheWiden";
private static final int TIME_TO_LIVE_SECONDS = 28800;
private static final int TIME_TO_IDLE_SECONDS = 3600;
```

#### Query Widen API
If the requested node is not in the cache, the provider calls the Widen API from the function: [queryWiden()][WidenDataSource.java]
to get all relevant information about the media content.

> The provider uses the Widen API: [Assets - Retrieve by id][widenAPI:AssetById].


### JSON to JCRNodeWrapper
The JSON return by the API is mapped to a JCR node object. To do this mapping, we use the [jackson] library.

As the Widen JSON properties and the JCR node properties do not have the same names we created a custom
[deserializer][WidenAssetDeserializer.java]
used by our class [WidenAsset.java]
to create a cacheable object:
```java
@JsonDeserialize(using = WidenAssetDeserializer.class)
public class WidenAsset {
...
}
```

## Mount Point
The main purpose of the [MountPoint.java] class is to support the configuration of the provider
and to enable the creation of new instance of the [WidenDataSource][WidenDataSource.java].

> The properties of the mount point are a subset of the variables written
in the [mount-widen.cfg][mount.cfg] file.

\[[<< back][README.md]\]

[WidenDataSource.java]: ../../content-editor-extensions/src/main/java/org/jahia/se/modules/edp/dam/widen/WidenDataSource.java
[WidenAssetDeserializer.java]: ../../content-editor-extensions/src/main/java/org/jahia/se/modules/edp/dam/widen/model/WidenAssetDeserializer.java
[WidenAsset.java]: ../../content-editor-extensions/src/main/java/org/jahia/se/modules/edp/dam/widen/model/WidenAsset.java
[WidenCacheManager.java]: ../../content-editor-extensions/src/main/java/org/jahia/se/modules/edp/dam/widen/cache/WidenCacheManager.java
[MountPoint.java]: ../../content-editor-extensions/src/main/java/org/jahia/se/modules/edp/dam/widen/MountPoint.java
[mount.cfg]:  ../../content-editor-extensions/src/main/resources/META-INF/configurations/org.jahia.modules.external.mount-widen.cfg


[README.md]: ../../README.md
[dataFlow]: ../../README.md#data-flow
[prerequisites]: ../../README.md#prerequisites

[tmdbProvider]: https://github.com/Jahia/tmdb-provider
[widenAPI:AssetById]: https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id
[jackson]: https://github.com/FasterXML/jackson

