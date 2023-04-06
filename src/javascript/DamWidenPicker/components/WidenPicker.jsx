import React from 'react';
import {useTranslation} from 'react-i18next';

import Image from '@material-ui/icons/Image';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import {LoaderOverlay} from '../../DesignSystem/LoaderOverlay';

import {StoreContext} from '../contexts';
import {ReferenceCard} from './Viewer';
import {Picker} from './Picker';
import * as PropTypes from 'prop-types';

import {useQuery} from '@apollo/react-hooks';
import {WidenPickerFilledQuery} from './WidenPicker.gql-queries';
import {widenUUIDQuery} from './WidenUUID.gql-queries';
import get from 'lodash.get';
import {withStyles} from '@material-ui/core';
import svgWidenLogo from '../../asset/widen.svg';
import {toIconComponent} from "@jahia/moonstone";

const styles = () => ({
    dialogPaper: {
        minHeight: '90vh',
        maxHeight: '90vh'
    },
    scrollPaper: {
        alignItems: 'baseline' // Default center
    }
});

const WidenPickerCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {t} = useTranslation();
    const {
        showPickerDialog,
        editorField,
        locale,
        editorValue,
        widenPath4EDP
    } = state;

    const selectedNodeUUID = useQuery(widenUUIDQuery, {
        variables:{
            widenEDPPath: widenPath4EDP,
            skip: !widenPath4EDP
        }
    });

    const widenNodeInfo = useQuery(WidenPickerFilledQuery, {
        variables : {
            uuid: editorValue || '',
            language: locale,
            skip: !editorValue
        }
    });

    const error = selectedNodeUUID?.error || widenNodeInfo?.error;
    const loading = selectedNodeUUID?.loading || widenNodeInfo?.loading;

    if (error) {
        const message = t(
            'jcontent:label.jcontent.error.queryingContent',
            {details: error.message ? error.message : ''}
        );

        console.warn(message);
    }

    if (loading) {
        return <LoaderOverlay/>;
    }

    if(selectedNodeUUID?.data?.jcr?.result?.uuid){
        dispatch({
            case: 'UPDATE_SELECTED_ITEM_UUID',
            payload: {
                uuid: selectedNodeUUID.data.jcr.result.uuid
            }
        });
    }

    const {data} = widenNodeInfo;

    let fieldData = null;
    const widenJcrData = get(data, 'jcr.result', null);
    if (widenJcrData) {
        fieldData = {
            wdenid: get(widenJcrData, 'wdenid.value'),
            filename: get(widenJcrData, 'filename.value'),
            format: get(widenJcrData, 'format.value'),
            type: get(widenJcrData, 'type.value'),
            thumbnail: get(widenJcrData, 'thumbnail.value'),
            sizeKB: get(widenJcrData, 'sizeKB.value'),
            duration: get(widenJcrData, 'duration.value'),
            aspectRatio: get(widenJcrData, 'aspectRatio.value'),
            width: get(widenJcrData, 'width.value'),
            height: get(widenJcrData, 'height.value'),
            updatedDate: get(widenJcrData, 'updatedDate.value'),
            lastModified: get(widenJcrData, 'lastModified.value')
        };
    }
//Note
//     editorInputContext.actionContext={
//         widenStoreDispatch: dispatch,
//         editorValue
//     }
    //KO
    // editorSetActionContext({
    //     widenStoreDispatch: dispatch,
    //     editorValue
    // });

    const dialogConfig = {
        fullWidth: true,
        maxWidth: 'xl',
        dividers: true
    };

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
                isReadOnly={editorField.readOnly}
                emptyLabel={t('widen-picker:label.referenceCard.emptyLabel')}
                emptyIcon={toIconComponent(svgWidenLogo)}
                labelledBy={`${editorField.name}-label`}
                fieldData={fieldData}
                onClick={handleShow}
            />
            {/*Note copy ButtonRenderer into designSystem*/}
            {/*{editorInputContext.displayActions && editorValue &&*/}
            {/*    <DisplayAction actionKey={'WidenPickerMenu'}*/}
            {/*                   value={editorValue}*/}
            {/*                   field={field}*/}
            {/*                   formik={formik}*/}
            {/*                   inputContext={inputContext}*/}
            {/*                   render={ButtonRenderer}/>}*/}
            <Dialog
                open={showPickerDialog}
                fullWidth={dialogConfig.fullWidth}
                maxWidth={dialogConfig.maxWidth}
                classes={{paper: classes.dialogPaper}}
                onClose={handleClose}
            >
                <DialogTitle closeButton>
                    Widen Picker
                </DialogTitle>
                <DialogContent dividers={dialogConfig.dividers}>
                    <Picker selectedItemId={fieldData?.wdenid}/>
                </DialogContent>
            </Dialog>
        </>
    );
};

//fieldData ? fieldData.wdenid : null

WidenPickerCmp.propTypes = {
    initEditorValue: PropTypes.string,
    classes: PropTypes.object.isRequired
};
WidenPickerCmp.displayName = 'WidenPicker';
export const WidenPicker = withStyles(styles)(WidenPickerCmp);

