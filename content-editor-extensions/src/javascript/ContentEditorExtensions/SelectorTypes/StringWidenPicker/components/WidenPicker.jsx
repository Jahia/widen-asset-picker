import React from 'react';

import Image from '@material-ui/icons/Image';

// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogActions from '@material-ui/core/DialogActions';

import {StoreContext} from '../contexts';
// import {Viewer} from './Viewer';
import {ReferenceCard} from './Viewer'
import Picker from './Picker';
import * as PropTypes from "prop-types";

const WidenPicker = ({setActionContext}) => {

    const {state, dispatch} = React.useContext(StoreContext);
    const {
        showPickerDialog,
        selectedItem,
        field
    } = state;

    setActionContext({
        widenStoreDispatch:dispatch,
        selectedItem
    })

    const dialogConfig ={
        fullWidth:true,
        maxWidth:'xl',
        dividers:true
    }
    const handleShow = () =>
        dispatch({
            case: 'TOGGLE_SHOW_PICKER'
        });

    const handleClose = () =>
        dispatch({
            case: 'TOGGLE_SHOW_PICKER'
        });
    // <Viewer/>
    return (
        <>

            <ReferenceCard
                readOnly={field.readOnly}
                emptyLabel='Add Widen Asset'
                emptyIcon={<Image/>}
                labelledBy={`${field.name}-label`}
                fieldData={selectedItem}
                onClick={handleShow}
            />
            <Dialog
                open={showPickerDialog}
                fullWidth={dialogConfig.fullWidth}
                maxWidth={dialogConfig.maxWidth}
                onClose={handleClose}>
                <DialogTitle closeButton>
                    Browse Widen Catalog
                </DialogTitle>
                <DialogContent dividers={dialogConfig.dividers}>
                    <Picker/>
                </DialogContent>
                {/*<DialogActions>*/}
                {/*    <Button onClick={handleClose} color="primary">*/}
                {/*        Cancel*/}
                {/*    </Button>*/}
                {/*    <Button onClick={handleSave} color="primary">*/}
                {/*        Save Changes*/}
                {/*    </Button>*/}
                {/*</DialogActions>*/}
            </Dialog>
        </>
    );
};

WidenPicker.propTypes = {
    setActionContext: PropTypes.func.isRequired
};
WidenPicker.displayName = 'WidenPicker';
export default WidenPicker;
