import React from 'react';
import {useTranslation} from 'react-i18next';

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
import {Picker} from './Picker';
import * as PropTypes from "prop-types";

import {useQuery} from '@apollo/react-hooks';
import {WidenPickerFilledQuery} from './WidenPicker.gql-queries';
import {widenUUIDQuery} from './WidenUUID.gql-queries';
import get from "lodash.get";
import {withStyles} from "@material-ui/core";

const GetUuid = () =>{
    // console.debug("[WidenPicker] GetUuid called ");
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        widenPath4EDP
    } = state;

    const variables ={
        widenEDPPath:widenPath4EDP,
        needToFetch: Boolean(widenPath4EDP)
    }
    console.log("[WidenPicker] GetUuid : variables for widenUUIDQuery : ",variables);

    //Call the EDP to get uuid and send to the store
    const {loading, error, data} = useQuery(widenUUIDQuery, {
        variables
    });

    if (loading || error || !data || !widenPath4EDP) {
        return; //{error, loading, notFound: Boolean(path)};
    }

    return dispatch({
        case:"UPDATE_SELECTED_ITEM_UUID",
        payload:{
            uuid:get(data, "jcr.result.uuid")
        }
    });
}
const styles = theme => ({
    dialogPaper: {
        minHeight: '90vh',
        maxHeight: '90vh',
        //alignItems: 'baseline'  // default center
    },
    scrollPaper: {
        alignItems: 'baseline'  // default center
    },
    // scrollTrick:{
    //     marginLeft: 'calc(100vw - 100%)'
    // }
});

const WidenPickerCmp = ({classes}) => {
    console.log("[WidenPicker] called !!! ");
    const {state, dispatch} = React.useContext(StoreContext);
    const {t} = useTranslation();
    const {
        showPickerDialog,
        editorField,
        locale,
        editorSetActionContext,
        editorValue,
        widenPath4EDP
    } = state;
    // console.log("[WidenPicker] editorValue : ",editorValue);
    GetUuid();

    const variables={
        uuid: editorValue || '',
        language: locale,
        // TODO: BACKLOG-12022 use useLazyQuery here in order to avoid this kind of needToFecth variable
        needToFetch: Boolean(editorValue)
    }
    console.log("[WidenPicker] variables for WidenPickerFilledQuery : ",variables);

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
    let fieldData = null;
    const widenJcrData = get(data, "jcr.result", null);
    if(widenJcrData)
        fieldData = {
            wdenid:get(widenJcrData, "wdenid.value"),
            filename:get(widenJcrData, "filename.value"),
            format:get(widenJcrData, "format.value"),
            type:get(widenJcrData, "type.value"),
            thumbnail:get(widenJcrData, "thumbnail.value"),
            sizeKB:get(widenJcrData, "sizeKB.value"),
            duration:get(widenJcrData, "duration.value"),
            aspectRatio:get(widenJcrData, "aspectRatio.value"),
            updatedDate:get(widenJcrData, "updatedDate.value"),
            lastModified:get(widenJcrData, "lastModified.value"),
        }
    // const fieldData = null
    console.log("[WidenPicker] fieldData : ",fieldData);
    console.log("[WidenPicker] editorField : ",editorField)

    //TODO me souviens plus comment ca fonctionne ca
    editorSetActionContext({
        widenStoreDispatch:dispatch,
        editorValue
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

    // scrollPaper:classes.scrollPaper
    // paper:classes.dialogPaper,
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
                classes={{paper:classes.dialogPaper}}
                onClose={handleClose}>
                <DialogTitle closeButton>
                    Widen Picker
                </DialogTitle>
                <DialogContent dividers={dialogConfig.dividers}>
                    <Picker/>
                </DialogContent>
            </Dialog>
        </>
    );
};
WidenPickerCmp.propTypes={
    classes: PropTypes.object.isRequired,
}
WidenPickerCmp.displayName = 'WidenPicker';
export const WidenPicker = withStyles(styles)(WidenPickerCmp);


