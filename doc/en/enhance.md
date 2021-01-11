# How to handle a new media asset created in Widen - example of the audio content type
You have created a new media asset in Widen, and you want to use it in jContent with a dedicated rendering ?
Here is the process to follow, to solve this issue.

Be sure you have read the previous sections before to start :
* [Widen assets in jContent][contentDefinition.md]
* [Widen Picker][picker.md]
* [Widen Provider][provider.md]


## The Audio story
Jamie from the marketing has created a new media asset type (aka *metadata type*) named *audio* in her Widen Server.
Now she wants to pick assets using this metadata type into jContent and applies a dedicated view to render an audio player.

To be able to pick, store and render a specific set of metadata related to the *audio* type into jContent, 
you should follow 3 steps:

1. Create a specific node type definition. For our example, you will create something like `wdennt:audio`.

    Like the others, the `wdennt:audio` extends the mixin `wdenmix:widenAsset`
    (like this, you don't need to touch the definition of `wdennt:widenReference`).
    
    We can imagine, there is a specific `file_properties.audio_properties` object with the `duration` properties.
    
    We can also image a specific `embeds.audio_player` object, and a specific `embeds.audio_stream` object.

    At this stage, the audio node type definition should look like this:
    ```cnd
    [wdenmix:audioFileProperties] > wdenmix:fileProperties mixin
     - wden:duration (double)
   
    [wdenmix:embedAudio] > wdenmix:embed  mixin
     - wden:audioPlayer (string) fulltextsearchable=no
     - wden:audioStreamURL (string) fulltextsearchable=no
    
    [wdennt:audio] > jnt:content, wdenmix:widenAsset, wdenmix:audioFileProperties, wdenmix:embedAudio
    ```
2. Create 2 node views :
    1. the default : `wdennt_audio/html/audio.jsp`. In this view you will get the value of the property `wden:audioPlayer` 
    and use it to run a player.
    2. the stream : `wdennt_audio/html/audio.stream.jsp`. In this view you will get the value of the property `wden:audioStreamURL`
    and use the value into an `<audio>` HTML tag.
    
3. Update the deserializer [WidenAssetDeserializer.java] to map properly your new content.

    ```java
    ...
    private static final String FILE_TYPE_AUDIO = "audio";
    private static final String CONTENT_TYPE_AUDIO = "wdennt:audio";
    private static final String AUDIO_PLAYER_URL_PATH = "/embeds/audio_player/url";
    private static final String AUDIO_STREAM_URL_PATH = "/embeds/audio_stream/url";
    private static final String FILE_AUDIO_PROPS_PATH = "/file_properties/audio_properties";
    ...
    case FILE_TYPE_AUDIO:
        widenAsset.setJahiaNodeType(CONTENT_TYPE_AUDIO);
        extendFileProps(widenNode,widenAsset,FILE_AUDIO_PROPS_PATH);
        
        JsonNode playerURLNode = widenNode.at(AUDIO_PLAYER_URL_PATH);
        JsonNode streamURLNode = widenNode.at(AUDIO_STREAM_URL_PATH);
        
        if(!(playerURLNode==null || playerURLNode.isNull()))
           widenAsset.addProperty(PREFIX+"audioPlayer",playerURLNode.textValue());
        
        if(!(streamURLNode == null || streamURLNode.isNull()))
           widenAsset.addProperty(PREFIX+"audioStreamURL",streamURLNode.textValue());
   
        break;
    ```
Now you should be able to use your new widen asset type into jContent.

[WidenAssetDeserializer.java]: ../../src/main/java/org/jahia/se/modules/widenprovider/model/WidenAssetDeserializer.java

[contentDefinition.md]: ./contentDefinition.md
[picker.md]: ./picker.md
[provider.md]: ./provider.md