\[[<< back][README.md]\]
# Widen Provider

- [Architecture](#architecture)
    - [Resolve the node path](#resolve-the-node-path)
    - [Query Widen API](#query-widen-api)
        - [Before to Query check the cache](#before-to-query-check-the-cache-)
        - [Query Widen API](#query-widen-api)
    - [JSON to JCRNodeWrapper](#json-to-jcrnodewrapper)
- [Configuration](#configuration)

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
The cache is set up in the function:
[start()][WidenDataSource.java].

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

## Configuration
The provider is configured via a Spring configuration file, named [widen-picker.xml][widenPicker.xml].
In this file, there are two main configuration parts, one for the picker and the other one for the provider.
For the provider, two beans are configured:
 1. one to configure the provider itsef.
 
    ```xml
    <osgi:reference id="ExternalProviderInitializerService" interface="org.jahia.modules.external.ExternalProviderInitializerService"/>
    ...
    <bean id="WidenProvider" class="org.jahia.modules.external.ExternalContentStoreProvider"
              parent="AbstractJCRStoreProvider">
        <property name="key" value="WidenProvider"/>
        <property name="mountPoint" value="${jahia.widen.edp.mountPoint:/sites/systemsite/contents/dam-widen}"/>
        <property name="externalProviderInitializerService" ref="ExternalProviderInitializerService"/>
        <property name="extendableTypes">
            <list>
                <value>nt:base</value>
            </list>
        </property>
        <property name="dataSource" ref="WidenDataSource"/>
    </bean>
    ```
2. the other one to configure the data source used by the provider. This configuration maps
variables declare in the file jahia.properties (cf. [prerequisites]).

    ```xml
    <bean name="WidenDataSource" class="org.jahia.se.modules.widenprovider.WidenDataSource" init-method="start">
        <property name="cacheProvider" ref="ehCacheProvider"/>
        <property name="widenEndpoint" value="${jahia.widen.api.endPoint:api.widencollective.com}"/>
        <property name="widenSite" value="${jahia.widen.api.site:}"/>
        <property name="widenToken" value="${jahia.widen.api.token:}"/>
        <property name="widenVersion" value="${jahia.widen.api.version:v2}"/>
    </bean>
    ```
\[[<< back][README.md]\]

[WidenDataSource.java]: ../../src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java
[WidenAssetDeserializer.java]: ../../src/main/java/org/jahia/se/modules/widenprovider/model/WidenAssetDeserializer.java
[WidenAsset.java]: ../../src/main/java/org/jahia/se/modules/widenprovider/model/WidenAsset.java
[widenPicker.xml]: ../../src/main/resources/META-INF/spring/widen-picker.xml

[README.md]: ../../README.md
[dataFlow]: ../../README.md#data-flow
[prerequisites]: ../../README.md#prerequisites

[tmdbProvider]: https://github.com/Jahia/tmdb-provider
[widenAPI:AssetById]: https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id
[jackson]: https://github.com/FasterXML/jackson

