import React from 'react';
import {StoreContext} from "contexts";
import {Button, Form, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const PageFormLink=() =>{
    const { state,dispatch } = React.useContext(StoreContext);
    const {
        isLoading,
        searchResultPageIndex,
        searchResultMaxPage
    } = state

    const[index,setIndex] = React.useState(searchResultPageIndex);

    React.useEffect( () =>{
        setIndex(searchResultPageIndex);
    },[searchResultPageIndex])

    const handleChange = (e) => {
        setIndex(e.target.value);
    }

    const handleGoToPage = (e) =>{
        e.preventDefault();

        if(searchResultMaxPage<index)
            return;

        dispatch({
            case: "GOTO_RESULT_PAGE",
            payload:{
                index
            }
        });
    }


    return(
        <li>
            <Form className="pT4__form-goto" onSubmit={handleGoToPage}>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                            {/*<FontAwesomeIcon icon={['fas','file']}/>*/}
                            <FontAwesomeIcon icon={['far','paper-plane']}/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        type="text"
                        name="paging"
                        value={index}
                        onChange={handleChange}
                        title="Goto Page"
                    />
                    <InputGroup.Append>
                        <Button type="submit" variant="outline-secondary" disabled={isLoading}>
                            <FontAwesomeIcon icon={['fas','sync-alt']}/>
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
        </li>
    )
}

export default PageFormLink;