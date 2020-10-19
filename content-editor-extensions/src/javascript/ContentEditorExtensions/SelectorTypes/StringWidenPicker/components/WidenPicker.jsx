import React from 'react';

// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogActions from '@material-ui/core/DialogActions';

import {StoreContext} from '../contexts';
import {Viewer} from './Viewer';
import Picker from './Picker';


const WidenPicker = props => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        showPickerDialog
    } = state;

    const dialogConfig ={
        fullWidth:true,
        maxWidth:'xl',
        dividers:true
    }

    const handleClose = () =>
        dispatch({
            case: 'TOGGLE_SHOW_PICKER'
        });

    return (
        <>
            <Viewer/>

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

export default WidenPicker;
