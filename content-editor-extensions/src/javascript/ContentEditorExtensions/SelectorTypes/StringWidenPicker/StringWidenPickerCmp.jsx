import React from 'react';
import './index.css';
import AjvError from './components/Error/Ajv';
import WidenPicker from './components/WidenPicker';
import {Store} from './Store';
import * as PropTypes from 'prop-types';
import {contextValidator} from './douane';

const StringWidenPickerCmp = ({field, id, value, onChange}) => {
    console.log('[StringWidenPickerCmp] est dans la place !');
    // Value = `{"id":"40e0dbe7-fe90-4014-9ad0-4d41f51f559e","external_id":"my41ppoluv","filename":"widenQA-skytest.jpg","created_date":"2020-05-19T16:49:49Z","last_update_date":"2020-05-19T16:49:49Z","deleted_date":null,"asset_properties":null,"file_properties":{"format":"JPEG","format_type":"image","size_in_kbytes":1743,"image_properties":{"width":4928,"height":3264,"aspect_ratio":1.509433962264151},"video_properties":null},"thumbnail":"https://previews.us-east-1.widencdn.net/preview/53342531/assets/asset-view/39bb3bba-f902-40e9-b14c-8820e215977a/thumbnail/eyJ3IjoxNjAsImgiOjE2MCwic2NvcGUiOiJhcHAifQ==?Expires=1602860400&Signature=OiFs5B7SqXDASiitTHyd7z1IdmDcIfy0V8KnvXmIPvfWD2CJrj9~j~Q8VvlQM8DShzaz7Xlal0VLv2O8LWcJue2~F7HI8yNrAf2E4HGZ3vrxyHJRk24TYBSDiuVri05E4pAFRLj3-gnxYAwWsYzQPAE-qgHY2VRVvKfvICU5WMR~V-BBhlvfgexAbjp9j4XhEXnnzuSmVSTsrNh3YN2Kz1dKGL2HwUNKoveb4TZlDsEPoubH7KFORck~-QSHUafwHnjfXU5JBd9dA3wREwX~UjPn~s7--IQmXY3nnxLPGdYSXfAeRpK7aTTPhq2lTcQ73Xo7-Y4-49i~MhwyQ~GvJw__&Key-Pair-Id=APKAJM7FVRD2EPOYUXBQ","embed":"https://embed.widencdn.net/img/virbac/my41ppoluv/{size}px@{scale}x/widenQA-skytest.jpg?q={quality}&x.template=y"}`

    let context = {
        // TODO see how to get from external config file
        widen: {
            url: 'https://api.widencollective.com',
            version: 'v2',
            site: 'virbac',
            token: 'ba4d0a71907a17aff9ebddc1fc91fd3a',
            lazyLoad:false,
            resultPerPage:20
        },
        selectedItem: value ? JSON.parse(value) : null, // TODO manage error JSON.parse
        contentEditorOnChange: onChange
    };

    try {
        // Console.log("context : ",JSON.stringify(context));
        context = contextValidator(context);

        return (
            <Store context={context}>
                <WidenPicker/>
            </Store>
        );
    } catch (e) {
        console.error('error : ', e);
        // TODO create a generic error handler
        return (
            <AjvError
                item={e.item}
                errors={e.errors}
            />
        );
    }
};

StringWidenPickerCmp.propTypes = {
    field: PropTypes.object,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

StringWidenPickerCmp.displayName = 'WidenAssetSelector';
export default StringWidenPickerCmp;
