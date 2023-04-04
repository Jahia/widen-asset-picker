import {gql} from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const widenUUIDQuery = gql`
    query widenUUIDQuery($widenEDPPath: String!) {
        jcr{
            result: nodeByPath(path: $widenEDPPath) {
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {widenUUIDQuery};
// Uuid
