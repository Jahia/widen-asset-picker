import React from 'react';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@apollo/react-hooks';
import get from 'lodash.get';

import {Dialog,DialogTitle,DialogContent,withStyles} from '@material-ui/core';

import {LoaderOverlay} from '../DesignSystem/LoaderOverlay';

import {StoreContext} from './contexts';
import {ReferenceCard,Picker,edpWidenContentPropsQuery,edpWidenContentUUIDQuery} from './components';

import svgWidenLogo from '../asset/widen.svg';
import {toIconComponent} from "@jahia/moonstone";
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '../utils';

const ButtonRenderer = getButtonRenderer({labelStyle: 'none', defaultButtonProps: {variant: 'ghost'}});

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
        editorInputContext,
        editorField,
        editorValue,
        locale,
        widenPath4EDP
    } = state;

    const selectedNodeUUID = useQuery(edpWidenContentUUIDQuery, {
        variables:{
            widenEDPPath: widenPath4EDP,
            skip: !widenPath4EDP
        }
    });

    const widenNodeInfo = useQuery(edpWidenContentPropsQuery, {
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

    editorInputContext.actionContext={
        dispatch
    }

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
            {editorInputContext.displayActions && editorValue &&
                <DisplayAction
                    actionKey={'content-editor/field/WidenPicker'}
                    value={editorValue}
                    field={editorField}
                    inputContext={editorInputContext}
                    render={ButtonRenderer}/>}
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

