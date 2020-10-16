import React from 'react';
import {StoreContext} from '../contexts';
import axios from 'axios';

const init = context => {
    const widenEngine = axios.create({
        baseURL: `${context.widen.url}/${context.widen.version}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${context.widen.site}/${context.widen.token}`
        },
        responseType: 'json',
        timeout: 3000
    });
    // WidenEngine.interceptors.request.use((config) => {
    //     config.params = config.params || {};
    //     config.params["token"] = context.widen.token;
    //     config.params["action"] ="widenSearch";//wordWheel fuzzy
    //     config.params["all_items"] ="true";
    //     config.params["user_locale"] =context.widen.locale.user;
    //     config.params["search_locale"] =context.widen.locale.search;
    //     return config;
    // });

    // const profileEngine = axios.create({
    //     baseURL:context.cdp_endpoint,
    //     responseType:"json",
    //     withCredentials: true,//important to send the context-profile-id cookie
    //     timeout:1000
    // });
    // //
    // profileEngine.interceptors.request.use((config) => {
    //     config.headers = config.headers || {};
    //     config.headers["Content-Type"] = "application/json";
    //     config.headers["Accept"] ="application/json";
    //     return config;
    // });
    const {lazyLoad, resultPerPage} = context.widen;
    const {selectedItem, contentEditorOnChange} = context;

    return {
        context, // TODO see if needed
        // locale:context.widen.locale.search,
        error: null,
        isLoading: false,
        needToFetch: !lazyLoad, // False,
        // needToFetch:false,
        // profileEngine,
        // userProfile:{},
        selectedItem,
        contentEditorOnChange,
        widenEngine,
        searchAnswers: [],
        searchIframe: null, // Not needed if I use searchAnswers
        // searchContexts:{},
        searchSortBy: 'created_date', // Newest assets first //TODO voir si je passe ça configurable au niveau jahia
        searchSortByDirection: 'DESC',
        searchSortList: [
            {value: 'created_date', label: 'Date Added'},
            {value: 'last_update_date', label: 'Date Updated'},
            {value: 'filename', label: 'Filename'},
            {value: 'file_format', label: 'File Format'},
            {value: 'file_size', label: 'File Size'}

        ],
        searchSortListDirection: [
            {value: 'ASC', label: 'sort-amount-up', symbol: ''},
            {value: 'DESC', label: 'sort-amount-down', symbol: '-'}
        ],
        searchQuery: null,
        searchResultPerPage: Number.parseInt(resultPerPage, 10), // Be sure it is an integer base 10
        searchResultMaxPage: null,
        searchResultPageIndex: 1,
        searchResultAvailableAnswersCount: null,
        showPickerModal: false,

        searchFacets: [],
        searchFilters: [],
        searchBanners: []

    };
};

const reducer = (state, action) => {
    const {payload} = action;

    switch (action.case) {
        case 'UPDATE_TEXT_QUERY': {
            console.debug('[STORE] UPDATE_TEXT_QUERY - query: ', payload.searchQuery);
            return {
                ...state,
                searchQuery: payload.searchQuery
            };
        }

        case 'RESET_TEXT_QUERY': {
            console.debug('[STORE] RESET_TEXT_QUERY');
            return {
                ...state,
                searchQuery: '',
                needToFetch: true
            };
        }

        case 'EXECUTE_QUERY': {
            console.debug('[STORE] EXECUTE_QUERY');
            return {
                ...state,
                searchResultPageIndex: 1, // New search reset paging
                needToFetch: true
            };
        }

        case 'UPDATE_SELECTED_ITEM': {
            const selectedItem = payload;
            const {contentEditorOnChange} = state;
            console.debug('[STORE] UPDATE_SELECTED_ITEM - payload: ', selectedItem);

            console.debug('[STORE] UPDATE_WIDEN_ASSET with', selectedItem);
            contentEditorOnChange(JSON.stringify(selectedItem));

            return {
                ...state,
                selectedItem,
                showPickerModal: !state.showPickerModal
            };
        }

        case 'UPDATE_SEARCH_RESULTS': {
            console.debug('[STORE] UPDATE_SEARCH_RESULTS - searchResults: ', payload.searchResults);
            // Sort,start_answer
            const {items, total_count} = payload.searchResults;
            const {searchResultPerPage, searchResultPageIndex} = state;
            let {searchResultMaxPage} = state;
            const searchResultAvailableAnswersCount = total_count;

            // TODO si catalogue empty gerer le cas avec un boolean

            // refine calatog based on existing filters !
            // catalogs.map(facet => {
            //     facet.list.map(filter => {
            //         filter.id = getRandomString(8,"#aA");
            //         return filter;
            //     })
            //     return facet;
            // });

            // new search
            if (searchResultPageIndex === 1) {
                searchResultMaxPage = Math.ceil(searchResultAvailableAnswersCount / searchResultPerPage);
            }

            return {
                ...state,
                searchAnswers: items,
                // SearchFacets:catalogs,
                // searchFilters:filters,
                // searchBanners:banners || [],
                searchResultAvailableAnswersCount,
                searchResultMaxPage,
                needToFetch: false
            };
        }

        case 'TOGGLE_FILTER': {
            const {filter} = payload;// Fitler is an element of  widen.catalogs.list
            console.debug('[STORE] TOGGLE_ANSWER -> filter id :', filter.id);

            let [facet, index] = state.searchFacets.reduce((result, facet, index) => {
                if (facet.id === filter.type) {
                    result = [facet, index];
                }

                return result;
            }, []);

            const list = facet.list.map(_filter => {
                if (_filter.id === filter.id) {
                    return {
                        ..._filter,
                        selected: !_filter.selected
                    };
                }

                return _filter;
            });

            facet = {
                ...facet,
                list
            };

            const searchFacets = state.searchFacets.slice();
            searchFacets.splice(index, 1, facet);

            console.debug('[STORE] searchFacets :', searchFacets);

            return {
                ...state,
                searchFacets,
                searchResultPageIndex: 1, // New search reset paging
                needToFetch: true
            };
        }

        case 'REMOVE_FILTER': {
            const {filter} = payload;// Fitler is an element of  widen.filters
            console.debug('[STORE] REMOVE_FILTER -> filter id :', filter.id);

            const searchFacets = state.searchFacets.filter(facet => facet.id !== filter.id);
            // SearchFacets.splice(index, 1,facet);

            console.debug('[STORE] searchFacets :', searchFacets);
            // #2 remove for existing filters
            const searchFilters = state.searchFilters.filter(_filter => _filter.id !== filter.id);

            return {
                ...state,
                searchFacets,
                searchFilters,
                searchResultPageIndex: 1, // New search reset paging
                needToFetch: true
            };
        }

        case 'ERROR': {
            console.debug('[STORE] ERROR - searchResults: ', payload.error);
            return {
                ...state,
                error: payload.error
            };
        }

        case 'LOADING': {
            console.debug('[STORE] LOADING - value: ', payload.value);
            return {
                ...state,
                isLoading: payload.value
            };
        }

        case 'PREVIOUS_RESULT_PAGE': {
            console.debug('[STORE] PREVIOUS_RESULT_PAGE');

            if (state.searchResultPageIndex <= 1) {
                return {
                    ...state
                };
            }

            const searchResultPageIndex = state.searchResultPageIndex - 1;

            return {
                ...state,
                needToFetch: true,
                searchResultPageIndex
            };
        }

        case 'NEXT_RESULT_PAGE': {
            console.debug('[STORE] NEXT_RESULT_PAGE');
            const {searchResultMaxPage} = state;

            if (state.searchResultPageIndex >= searchResultMaxPage) {
                return {
                    ...state
                };
            }

            const searchResultPageIndex = state.searchResultPageIndex + 1;

            return {
                ...state,
                needToFetch: true,
                searchResultPageIndex
            };
        }

        case 'GOTO_RESULT_PAGE': {
            console.debug('[STORE] GOTO_RESULT_PAGE payload : ', payload);
            const index = Number(payload.index);
            const {searchResultMaxPage} = state;

            if (!index || index < 1 || index > searchResultMaxPage) {
                return {
                    ...state
                };
            }

            return {
                ...state,
                needToFetch: true,
                searchResultPageIndex: index
            };
        }

        case 'UPDATE_RESULT_PER_PAGE': {
            console.debug('[STORE] UPDATE_RESULT_PER_PAGE payload : ', payload);
            const {value} = payload;

            return {
                ...state,
                searchResultPerPage: value,
                searchResultPageIndex: 1,
                needToFetch: true
            };
        }

        case 'UPDATE_SORT_ITEM': {
            console.debug('[STORE] UPDATE_SORT_ITEM payload : ', payload);
            const {sortBy} = payload;

            return {
                ...state,
                searchSortBy: sortBy,
                needToFetch: true
            };
        }

        case 'TOGGLE_SORT_DIRECTION': {
            console.debug('[STORE] TOGGLE_SORT_DIRECTION');
            const {searchSortByDirection, searchSortListDirection} = state;
            const [sortDirectionItem] = searchSortListDirection.filter(item => item.value != searchSortByDirection);

            return {
                ...state,
                searchSortByDirection: sortDirectionItem.value,
                needToFetch: true
            };
        }

        case 'TOGGLE_SHOW_PICKER': {
            console.debug('[STORE] TOGGLE_SHOW_PICKER');
            return {
                ...state,
                showPickerModal: !state.showPickerModal
            };
        }

        case 'DELETE_SELECTED_ASSET': {
            const {contentEditorOnChange} = state;
            console.debug('[STORE] DELETE_WIDEN_ASSET');

            contentEditorOnChange(null);
            return {
                ...state,
                selectedItem: null
            };
        }

        // Case "UPDATE_SELECTED_ASSET": {
        //     const {selectedItem} = payload;
        //     const {contentEditorOnChange} = state;
        //
        //     console.debug("[STORE] UPDATE_WIDEN_ASSET with",selectedItem);
        //     contentEditorOnChange(JSON.stringify(selectedItem));
        //
        //     return {
        //         ...state,
        //         selectedItem,
        //         showPickerModal:!state.showPickerModal
        //     }
        // }
        default:
            return {
                ...state,
                error: new Error(`[STORE] action case '${action.case}' is unknown `)
            };
            // Throw new Error(`[STORE] action case '${action.case}' is unknown `);
    }
};

export const Store = props => {
    const [state, dispatch] = React.useReducer(
        reducer,
        props.context,
        init
    );
    return (
        <StoreContext.Provider value={{state, dispatch}}>
            {props.children}
        </StoreContext.Provider>
    );
};
