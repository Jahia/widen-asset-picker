import {gql} from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const WidenPickerFilledQuery = gql`
    query widenPickerFilledQuery($uuid: String!, $language: String!) {
        jcr{
            result: nodeById(uuid: $uuid) {
                displayName(language: $language)
                wdenid: property(name: "wden:id") {value}
                filename: property(name: "wden:filename") {value}
                format: property(name: "wden:format") {value}
                type: property(name: "wden:type") {value}
                thumbnail: property(name: "wden:thumbnail") {value}
                sizeKB: property(name: "wden:sizeKB") {value}
                duration: property(name: "wden:duration") {value}
                aspectRatio: property(name: "wden:aspectRatio") {value}
                width: property(name: "wden:width") {value}
                height: property(name: "wden:height") {value}
                updatedDate: property(name: "wden:updatedDate") {value}
                lastModified: property(name: "jcr:lastModified") {value}
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {WidenPickerFilledQuery};
