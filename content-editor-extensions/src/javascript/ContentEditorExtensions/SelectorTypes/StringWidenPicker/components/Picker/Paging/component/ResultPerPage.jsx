import React from 'react';
import {StoreContext} from '../../../../contexts';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {FormControl, InputLabel, MenuItem, Select, withStyles} from "@material-ui/core";
import {getRandomString} from '../../../../misc/utils';
import PropTypes from "prop-types";

const styles = theme => ({

});

const ResultPerPageCmp = (classes) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchResultPerPage
    } = state;

    const _id_ = getRandomString(6, 'aA#');

    const handleChange = e =>
        dispatch({
            case: 'UPDATE_RESULT_PER_PAGE',
            payload: {
                value: e.target.value
            }
        });

    return (
        <li>
            {/*<FormControl variant="outlined" className={classes.formControl}>*/}
            {/*    <InputLabel id={`resultPerPage_${_id_}_label`}>Sort by</InputLabel>*/}
                <Select
                    labelId={`resultPerPage_${_id_}_label`}
                    id={`resultPerPage_${_id_}`}
                    value={searchResultPerPage}
                    onChange={handleChange}
                    label="Sort by"
                >
                    {/*<MenuItem value="">*/}
                    {/*    <em>None</em>*/}
                    {/*</MenuItem>*/}
                    {[5, 10, 20, 50, 100].map(nb =>
                        <MenuItem key={nb} value={nb}>{nb}</MenuItem>
                    )}
                </Select>
            {/*</FormControl>*/}

            {/*<InputGroup>*/}
            {/*    <InputGroup.Prepend>*/}
            {/*        <InputGroup.Text id="inputGroupPrepend">*/}
            {/*            /!* <FontAwesomeIcon icon={['fas','file']}/> *!/*/}
            {/*            <FontAwesomeIcon icon={['far', 'file-alt']}/>*/}
            {/*        </InputGroup.Text>*/}
            {/*    </InputGroup.Prepend>*/}
            {/*    <Form.Control*/}
            {/*        as="select"*/}
            {/*        defaultValue={searchResultPerPage}*/}
            {/*        title="Result per page"*/}
            {/*        onChange={handleChange}*/}
            {/*    >*/}
            {/*        {[5, 10, 20, 50, 100].map(nb => <option key={nb} value={nb}>{nb}</option>)}*/}
            {/*    </Form.Control>*/}
            {/*    /!* <InputGroup.Append> *!/*/}
            {/*    /!*    <InputGroup.Text id="inputGroupPrepend"> *!/*/}
            {/*    /!*        /!*<FontAwesomeIcon icon={['fas','file']}/>*!/ *!/*/}
            {/*    /!*        <FontAwesomeIcon icon={['far','file-alt']}/> *!/*/}
            {/*    /!*    </InputGroup.Text> *!/*/}
            {/*    /!* </InputGroup.Append> *!/*/}
            {/*</InputGroup>*/}
        </li>
    );
};
ResultPerPageCmp.propTypes={
    classes: PropTypes.object.isRequired,
}

export const ResultPerPage = withStyles(styles)(ResultPerPageCmp);
