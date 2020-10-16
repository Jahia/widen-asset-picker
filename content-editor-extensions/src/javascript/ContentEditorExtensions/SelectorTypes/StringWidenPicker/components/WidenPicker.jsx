import React from 'react';
import './App.scss';

import {Modal} from 'react-bootstrap';
import {StoreContext} from '../contexts';
import 'bootstrap/dist/css/bootstrap.min.css';

import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {faSortAmountDown, faSortAmountUp, faSyncAlt, faFile, faSearch, faPowerOff, faBan, faTimes, faUserCheck, faUserTag, faCrosshairs, faChevronLeft, faChevronRight, faHashtag, faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import {faPaperPlane, faFileAlt, faCheckCircle, faThumbsUp, faUserCircle, faAddressCard} from '@fortawesome/free-regular-svg-icons';
import Viewer from './Viewer';
import Picker from './Picker';

library.add(
    fab,
    faSearch,
    faPowerOff,
    faCheckCircle,
    faThumbsUp,
    faBan,
    faTimes,
    faUserCheck,
    faUserTag,
    faUserCircle,
    faAddressCard,
    faCrosshairs,
    faChevronLeft,
    faChevronRight,
    faHashtag,
    faEllipsisH,
    faFile,
    faFileAlt,
    faSyncAlt,
    faPaperPlane,
    faSortAmountDown,
    faSortAmountUp
);

const WidenPicker = props => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        showPickerModal
    } = state;

    const handleClose = () =>
        dispatch({
            case: 'TOGGLE_SHOW_PICKER'
        });

    return (
        <>
            <Viewer/>

            <Modal show={showPickerModal} size="xl" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Browse Widen Catalog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Picker/>
                </Modal.Body>

                {/* <Modal.Footer> */}
                {/*    <Button variant="secondary" onClick={handleClose}> */}
                {/*        Close */}
                {/*    </Button> */}
                {/*    <Button variant="primary" onClick={handleSave}> */}
                {/*        Save Changes */}
                {/*    </Button> */}
                {/* </Modal.Footer> */}

            </Modal>
        </>
    );
};

export default WidenPicker;
