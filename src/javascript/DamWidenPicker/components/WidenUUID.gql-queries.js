import {gql} from 'apollo-boost';
import {PredefinedFragments} from '@jahia/data-helper';

const widenUUIDQuery = gql`
    query widenUUIDQuery($widenEDPPath: String!,$needToFetch: Boolean!) {
        jcr @include(if: $needToFetch) {
            result: nodeByPath(path: $widenEDPPath) {
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {widenUUIDQuery};
// Uuid
