import React from 'react';
import PropTypes from 'prop-types';
//import {StoreContext} from "contexts";
import Filter from "./Filter";
import ColorFilter from "./ColorFilter";

const Facet=({facet})=>{
    // const { state, dispatch } = React.useContext(StoreContext);
    // const {} = state

    return(
        <>
            {facet.id === "facette_coloris_generique" &&
            <li>
                <h5>{facet.name}</h5>
                <ul className="color-filter">
                    {facet.list &&
                    facet.list.map(filter =>
                        <ColorFilter
                                key={filter.id}
                                filter={filter}
                            />
                    )}
                </ul>
            </li>
            }

            {facet.id === "facette_taille" &&
            <li>
                <h5>{facet.name}</h5>
                <ul className="size-filter">
                    {facet.list &&
                    facet.list.map(filter =>
                        <Filter
                            key={filter.id}
                            filter={filter}
                        />
                    )}
                </ul>
            </li>
            }

            {facet.id !== "facette_coloris_generique" && facet.id !== "facette_taille" &&
            <li>
                <h5>{facet.name}</h5>
                <ul>
                    {facet.list &&
                    facet.list.map(filter =>
                        <Filter
                            key={filter.id}
                            filter={filter}
                        />
                    )}
                </ul>
            </li>
            }
        </>

    )
}

Facet.propTypes={
    facet:PropTypes.object.isRequired
}

export default Facet;