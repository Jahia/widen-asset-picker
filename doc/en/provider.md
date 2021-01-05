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
To avoid not necessary call, the module use a dedicated
cache to store jContent nodes created after a widen call. The name of this cache is "cacheWiden".
The cache is set up in the function :
[start()](../../src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java).

This cache is configured to keep 1 hour (3600s) an idle object and finally to remove an object after 8 hours (28800s).
The configuration looks like this :
```
CACHE_NAME = "cacheWiden";
TIME_TO_LIVE_SECONDS = 28800;
TIME_TO_IDLE_SECONDS = 3600;
```

#### Query Widen API
If the requested node is not in cache, the provider calls the Widen API from the funtion : [queryWiden()](../../src/main/java/org/jahia/se/modules/widenprovider/WidenDataSource.java)
to get all relevant information about the media content.

The provider use the Widen API : [Assets - Retrieve by id](https://widenv2.docs.apiary.io/#reference/assets/assets/retrieve-by-id).


### JSON to JCRNodeWrapper
The JSON return by the API is mapped to a JCR node object. To do this mapping we use the [jackson](https://github.com/FasterXML/jackson) library.

As the Widen JSON properties and the JCR node do not have the same names we created a custom
[deserializer](../../src/main/java/org/jahia/se/modules/widenprovider/model/WidenAssetDeserializer.java)
used by our class [WidenAsset](../../src/main/java/org/jahia/se/modules/widenprovider/model/WidenAsset.java)
to create a cacheable object :
```
@JsonDeserialize(using = WidenAssetDeserializer.class)
public class WidenAsset {
...
}
```

## Configuration
The provider is configured via a spring configuration file named [widen-picker.xml](../../src/main/resources/META-INF/spring/widen-picker.xml).
In this file, there is two main configuration part, one for the picker and the other one for the provider.
For the provider, two beans are configured :
 1. one to create the provider itsef
 
    ```   
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
2. the other one to create the data source used by the provider. This configuration maps
variables declare in the file jahia.properties (cf. [prerequisites](../../README.md#prerequisites)).

    ```
    <bean name="WidenDataSource" class="org.jahia.se.modules.widenprovider.WidenDataSource" init-method="start">
        <property name="cacheProvider" ref="ehCacheProvider"/>
        <property name="widenEndpoint" value="${jahia.widen.api.endPoint:api.widencollective.com}"/>
        <property name="widenSite" value="${jahia.widen.api.site:}"/>
        <property name="widenToken" value="${jahia.widen.api.token:}"/>
        <property name="widenVersion" value="${jahia.widen.api.version:v2}"/>
    </bean>
    ```
\[[<< back](../../README.md)\]