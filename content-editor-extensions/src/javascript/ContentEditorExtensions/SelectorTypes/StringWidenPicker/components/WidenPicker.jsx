import React from 'react';

import Image from '@material-ui/icons/Image';

// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogActions from '@material-ui/core/DialogActions';

import {ProgressOverlay} from '@jahia/react-material';

import {StoreContext} from '../contexts';
// import {Viewer} from './Viewer';
import {ReferenceCard} from './Viewer'
import Picker from './Picker';
import * as PropTypes from "prop-types";

import {useQuery} from '@apollo/react-hooks';
import {WidenPickerFilledQuery} from './WidenPicker.gql-queries';
import get from "lodash.get";

const WidenPicker = ({setActionContext}) => {
    console.log("[WidenPicker] called !!! ");
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        showPickerDialog,
        selectedItem,
        editorField,
        locale,
        editorSetActionContext,
        editorValue
    } = state;
    console.log("[WidenPicker] editorValue : ",editorValue);

    const variables={
        path: editorValue || '',
        language: locale,
        // TODO: BACKLOG-12022 use useLazyQuery here in order to avoid this kind of needToFecth variable
        needToFetch: Boolean(editorValue)
    }
    console.log("[WidenPicker] variables : ",variables);

    const {loading, error, data} = useQuery(WidenPickerFilledQuery, {
        variables
    });

    if (error) {
        const message = t(
            'jcontent:label.jcontent.error.queryingContent',
            {details: error.message ? error.message : ''}
        );

        console.warn(message);
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    const fieldData = get(data, "jcr.result", null);
    // const fieldData = null
    console.log("[WidenPicker] fieldData : ",fieldData);
    console.log("[WidenPicker] editorField : ",editorField)

    //TODO me souviens plus comment ca fonctionne ca
    editorSetActionContext({
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


    return (
        <>

            <ReferenceCard
                readOnly={editorField.readOnly}
                emptyLabel='Add Widen Asset'
                emptyIcon={<Image/>}
                labelledBy={`${editorField.name}-label`}
                fieldData={fieldData}
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
            </Dialog>
        </>
    );
};

// WidenPicker.propTypes = {};
WidenPicker.displayName = 'WidenPicker';
export default WidenPicker;
