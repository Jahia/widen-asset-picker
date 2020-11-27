import {gql} from 'apollo-boost';
import {PredefinedFragments} from '@jahia/data-helper';

const widenUUIDQuery = gql`
    query itemFilledQuery($path: String!,$needToFetch: Boolean!) {
        jcr@include(if: $needToFetch){
            result: nodeByPath(path: $path) {
                uuid
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {widenUUIDQuery};
