import React from 'react';
import {StoreContext} from "contexts";
import {Dropdown,DropdownButton,Button} from 'react-bootstrap';
import {getRandomString} from "misc/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Nav=()=>{
    const { state, dispatch } = React.useContext(StoreContext);
    const {
        searchSortBy,
        searchSortByDirection,
        searchSortList,
        searchSortListDirection,
    } = state
    const [sortByItem] = searchSortList.filter(item => item.value===searchSortBy);
    const [sortDirectionItem] = searchSortListDirection.filter(item => item.value === searchSortByDirection);

    const handleClickSortBy = (e) =>{
        const sortBy = e.target.id;
        dispatch({
            case:"UPDATE_SORT_ITEM",
            payload:{
                sortBy
            }
        });
    };

    const handleClickSortByDirection = (e) =>
        dispatch({
            case:"TOGGLE_SORT_DIRECTION"
        });

    return (
        <>
            <li>
                <DropdownButton
                    alignRight
                    variant="outline-dark"
                    title={`Sort by ${sortByItem.label}`}
                    id={`sortBy_${getRandomString(6,"aA#")}`}
                >
                    {searchSortList.map((item,i)=>
                        <Dropdown.Item key={i} id={item.value} onClick={handleClickSortBy}>{item.label}</Dropdown.Item>
                    )}
                    {/*<Dropdown.Divider />*/}
                </DropdownButton>
            </li>
            <li>
                <Button
                    variant="outline-dark"
                    onClick={handleClickSortByDirection}
                >
                    <FontAwesomeIcon icon={['fas',sortDirectionItem.label]}/>
                </Button>
            </li>
        </>
    )
}

export default Nav;