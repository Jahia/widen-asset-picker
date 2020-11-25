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

    const {state, dispatch} = React.useContext(StoreContext);
    const {
        showPickerDialog,
        selectedItem,
        field
    } = state;

    const {loading, error, data} = useQuery(WidenPickerFilledQuery, {
        variables:variables,
    });

    React.useEffect(() => {
        if(loading === false && data){
            const fieldData = get(data, "jcr.result", {});
            dispatch({
                case:"FIELD_DATA_READY",
                payload:{
                    fieldData
                }
            });
        }
    }, [loading,data]);

    // //TODO get fielddata
    // const usePickerInputData = (uuid, editorContext) => {
    //     const {data, error, loading} = useQuery(MediaPickerFilledQuery, {
    //         variables: {
    //             uuid: uuid || '',
    //             language: editorContext.lang,
    //             // TODO: BACKLOG-12022 use useLazyQuery here in order to avoid this kind of needToFecth variable
    //             needToFetch: Boolean(uuid)
    //         }
    //     });
    //
    //     if (loading || error || !data || !uuid) {
    //         return {error, loading, notFound: Boolean(uuid)};
    //     }
    //
    //     const imageData = data.jcr.result;
    //     const sizeInfo = (imageData.height && imageData.width) ? ` - ${parseInt(imageData.height.value, 10)}x${parseInt(imageData.width.value, 10)}px` : '';
    //     const fieldData = {
    //         uuid,
    //         url: `${
    //             window.contextJsParameters.contextPath
    //         }/files/default${encodeJCRPath(imageData.path)}?lastModified=${imageData.lastModified.value}&t=thumbnail2`,
    //         name: imageData.displayName,
    //         path: imageData.path,
    //         info: `${imageData.children.nodes[0].mimeType.value}${sizeInfo}`
    //     };
    //
    //     return {fieldData, error, loading};
    // };

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



//TODO me souviens plus comment ca fonctionne ca
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
    // <ViewerJsx/>
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
