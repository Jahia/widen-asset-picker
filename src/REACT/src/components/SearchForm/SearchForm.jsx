import React from 'react';
import {InputGroup,Form,Button} from 'react-bootstrap';
//import PropTypes from 'prop-types';
//import get from "lodash.get";

import {StoreContext} from "contexts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SearchForm = (props) => {
    const { state, dispatch } = React.useContext(StoreContext);
    const {
        isLoading
    } = state

    const handleChange = (e) => {
        const searchQuery= e.target.value;
        //needed if I want to enable Fuzzy search
        dispatch({
            case:"UPDATE_TEXT_QUERY",
            payload:{
                searchQuery
            }
        });
    }

    const handleReset =(e) => {
        //e.preventDefault();
        dispatch({
            case:"RESET_TEXT_QUERY"
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({
            case:"EXECUTE_QUERY"
        });
    }

    return(
        <Form className="pT4__form" onSubmit={handleSubmit}>
            <Form.Group controlId="basicSearch">
                {/*<Form.Label>Email address</Form.Label>*/}
                <InputGroup className="mb-3">
                    <Form.Control
                        type="text"
                        name="query"
                        // value={searchQuery}
                        onChange={handleChange}
                        placeholder="Que cherchez-vous ?"
                    />
                    <InputGroup.Append>
                        <Button type="reset" variant="outline-secondary" disabled={isLoading} onClick={handleReset}>
                            <FontAwesomeIcon icon={['fas','times']}/>
                        </Button>
                    </InputGroup.Append>
                    <InputGroup.Append>
                        <Button type="submit" variant="secondary" disabled={isLoading}>
                            <FontAwesomeIcon icon={['fas','search']}/>
                        </Button>
                    </InputGroup.Append>
                </InputGroup>

                <Form.Text className="text-muted">
                    <FontAwesomeIcon icon={['fas','power-off']}/> by
                    Jahia For Widen
                </Form.Text>
            </Form.Group>
        </Form>
    );
}

SearchForm.propTypes={}

export default SearchForm;