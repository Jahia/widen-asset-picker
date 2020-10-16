import get from 'lodash.get';

// Const computeSearchContext = ({searchContexts}) =>
//     Object.keys(searchContexts).reduce((params, key) => {
//         let value = searchContexts[key];
//         if(key==="segments")
//             value = value.replace(" | ","|");
//
//         if (value)
//             params[`contexts[${key}]`] = value;//contexts[buyerProfile]=promotion
//         return params;
//     }, {});

const computeFacetContext = ({searchFacets}) =>
    searchFacets.reduce((params, facet) => {
        // Console.log("[computeFilterContext] facet : ",facet);
        const filters = facet.list.reduce((params, filter) => {
            // Console.log("filter.id : ",filter.id)
            // console.log("filter.selected : ",filter.selected)
            if (filter.selected) {
                params[`filters[${filter.type}][values][]`] = filter.filter;
                params[`filters[${filter.type}][operations][]`] = 'and';
            }

            return params;
        }, {});
        // Console.log("[computeFilterContext] filters : ",filters);
        return {
            ...params,
            ...filters
        };
    }, {});

const computeFilterContext = ({searchFilters}) =>
    searchFilters.reduce((params, filter) => {
        // Console.log("[computeFilterContext] facet : ",filter);
        params[`filters[${filter.id}][values][]`] = filter.value;
        params[`filters[${filter.id}][operations][]`] = filter.operation;

        // Console.log("[computeFilterContext] filters : ",filters);
        return params;
    }, {});

const paging = ({searchResultPerPage, searchResultPageIndex}) => {
    // Console.log("[paging] searchResultPerPage: ",searchResultPerPage,"; searchResultPageIndex : ",searchResultPageIndex)
    return {
        offset: (searchResultPageIndex - 1) * searchResultPerPage,
        limit: searchResultPerPage
    };
};

const sort = ({searchSortBy, searchSortByDirection, searchSortListDirection}) => {
    const [sortDirectionItem] = searchSortListDirection.filter(item => item.value === searchSortByDirection);
    return {
        sort: `${sortDirectionItem.symbol}${searchSortBy}`
    };
};

const fetchSearchData = async ({path = '/', state, dispatch}) => {
    const {
        widenEngine,
        searchQuery,
        // SearchContexts,
        searchFacets,
        searchFilters,
        searchResultPerPage,
        searchResultPageIndex,
        searchSortBy,
        searchSortByDirection,
        searchSortListDirection
    } = state;

    dispatch({
        case: 'LOADING',
        payload: {
            value: true
        }
    });
    // Console.log("searchQuery : ",searchQuery);
    const params = {
        query: searchQuery,
        expand: 'embeds,thumbnails,file_properties',
        // ...computeSearchContext({searchContexts}),
        // ...computeFacetContext({searchFacets}),
        // ...computeFilterContext({searchFilters}),
        ...paging({searchResultPerPage, searchResultPageIndex}),
        ...sort({searchSortBy, searchSortByDirection, searchSortListDirection})
    };

    // Console.log("[fetchSearchData] params : ",params);

    try {
        // TODO test response.status===200 || 204? sinon throw Error(response.status)
        const response = await widenEngine(path, {params});
        dispatch({
            case: 'UPDATE_SEARCH_RESULTS',
            payload: {
                searchResults: get(response, 'data', {})
            }
        });
    } catch (error) {
        dispatch({
            case: 'ERROR',
            payload: {
                error
            }
        });
    }

    dispatch({
        case: 'LOADING',
        payload: {
            value: false
        }
    });
};

export {
    fetchSearchData
};
