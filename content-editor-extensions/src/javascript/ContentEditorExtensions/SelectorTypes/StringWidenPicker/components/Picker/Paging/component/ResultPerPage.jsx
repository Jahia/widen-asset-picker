import React from 'react';
import {StoreContext} from '../../../../contexts';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const ResultPerPage = () => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchResultPerPage
    } = state;

    const handleChange = e => {
        dispatch({
            case: 'UPDATE_RESULT_PER_PAGE',
            payload: {
                value: e.target.value
            }
        });
    };

    return (
        <li>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">
                        {/* <FontAwesomeIcon icon={['fas','file']}/> */}
                        <FontAwesomeIcon icon={['far', 'file-alt']}/>
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                    as="select"
                    defaultValue={searchResultPerPage}
                    title="Result per page"
                    onChange={handleChange}
                >
                    {[5, 10, 20, 50, 100].map(nb => <option key={nb} value={nb}>{nb}</option>)}
                </Form.Control>
                {/* <InputGroup.Append> */}
                {/*    <InputGroup.Text id="inputGroupPrepend"> */}
                {/*        /!*<FontAwesomeIcon icon={['fas','file']}/>*!/ */}
                {/*        <FontAwesomeIcon icon={['far','file-alt']}/> */}
                {/*    </InputGroup.Text> */}
                {/* </InputGroup.Append> */}
            </InputGroup>
        </li>
    );
};

export default ResultPerPage;
