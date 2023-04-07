import {gql} from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const edpWidenContentUUIDQuery = gql`
    query edpWidenContentUUIDQuery($widenEDPPath: String!) {
        jcr{
            result: nodeByPath(path: $widenEDPPath) {
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
