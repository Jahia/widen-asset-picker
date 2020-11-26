import {gql} from 'apollo-boost';
import {PredefinedFragments} from '@jahia/data-helper';

const WidenPickerFilledQuery = gql`
    query widenPickerFilledQuery($path: String!, $language: String!, $needToFetch: Boolean!) {
        jcr @include(if: $needToFetch) {
            result: nodeByPath(path: $path) {
                displayName(language: $language)
                wdenid: property(name: "wden:id") {
                    value
                }
                filename: property(name: "wden:filename") {
                    value
                }
                format: property(name: "wden:format") {
                    value
                }
                type: property(name: "wden:type") {
                    value
                }
                sizeKB: property(name: "wden:sizeKB") {
                    value
                }
                duration: property(name: "wden:duration") {
                    value
                }
                aspectRatio: property(name: "wden:aspectRatio") {
                    value
                }
                updatedDate: property(name: "wden:updatedDate") {
                    value
                }
                lastModified: property(name: "jcr:lastModified") {
                    value
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {WidenPickerFilledQuery};
