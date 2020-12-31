\[[<< back](../../README.md)\]
# Widen Provider
The provider is an implementation of an External Data Provider (EDP).
In jContent, an EDP is used :
1. to map an external asset to a jContent node (JCRNodeWrapper)
2. to create a tree hierarchy to browse nodes in content explorer
3. to enable the search capabilities for an external asset via lucene (used by default content picker)
or *Augmented Search*
4. to add new properties to an external asset. A user can contribute those properties

The main example of an EDP is the [tmdb-provider](https://github.com/Jahia/tmdb-provider).

But in our case we don't need all of these features. Indeed, we only want to pick asset one by one :
1. no need to create a folder with children inside
1. no need to implement the search part as we have a custom picker using directly the widen search api
1. no need to add more content to our asset

Based on these requirements we don't need to implement all the EDP methods, and we can qualify our
EDP as Light EDP.

## Architecture

As presented in the [data flow](../../README.md#data-flow), the provider maps a Widen asset (JSON) to a jContent node (JCRNodeWrapper).
The mapping is done in 3 steps :
1. Resolve the path returned by the picker `jahia.widen.edp.mountPoint`/`id` of the widen asset
2. Query Widen API to get the properties of the asset
3. Map the JSON to a JCRNodeWrapper

Steps 1 & 2 are done in [WidenDataSource.java](../../src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java)
and steps 3 is done in [WidenAssetDeserializer.java](../../src/main/java/org/jahia/se/modules/widenprovider/model/WidenAssetDeserializer.java)
### Resolve the path
### Query Widen API
#### Before to Query check the cache !
(cf. [start](../../src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java)).

```
CACHE_NAME = "cacheWiden";
TIME_TO_LIVE_SECONDS = 28800;
TIME_TO_IDLE_SECONDS = 3600;
```
#### Query Widen API

(cf. [queryWiden](../../src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java)).

The provider use the Widen API : [Assets - Retrieve by id](https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id).


### JSON to JCRNodeWrapper
jackson library. As the Widen JSON properties and the JCR node don't have the same name
we weed to create a custom deserializer



\[[<< back](../../README.md)\]