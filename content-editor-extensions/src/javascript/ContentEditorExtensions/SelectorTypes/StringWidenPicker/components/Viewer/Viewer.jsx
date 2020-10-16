import React from 'react';
import {Col, Container, Row, Button} from 'react-bootstrap';
import {StoreContext} from '../../contexts';

const Viewer = props => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        selectedItem
    } = state;

    const handleShow = () =>
        dispatch({
            case: 'TOGGLE_SHOW_PICKER'
        });

    const handleDelete = () =>
        dispatch({
            case: 'DELETE_SELECTED_ASSET'
        });

    // Const {widenAsset} = picker;
    if (selectedItem) {
        const {
            id,
            external_id,
            filename,
            created_date,
            last_update_date,
            deleted_date,
            asset_properties,
            file_properties,
            thumbnail,
            embed
        } = selectedItem;

        const formatDate = date => {
            if (!date) {
                return;
            }

            const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
            date = new Date(date);
            return date.toLocaleDateString('fr-FR', options);// TODO get locale
        };

        const createdDate = formatDate(created_date);
        const updatedDate = formatDate(last_update_date);
        const deletedDate = formatDate(deleted_date);

        // TODO faire des composants pour chaque element
        // todo manage file_properties.image_properties if type === 'image"
        // todo manage file_properties.video_properties if type === 'video'
        return (
            <Container className="">
                <Row>
                    <Col xs="4" sm="3" md="4" lg="3">
                        <img src={thumbnail}/>
                        <Button variant="outline-primary" onClick={handleShow}>
                            Update
                        </Button>
                        <Button variant="outline-danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Col>
                    <Col>
                        <h3>{filename}</h3>
                        <div className="info-wrapper">
                            <ul>
                                <li>Type : {file_properties.format_type}</li>
                                <li>Format : {file_properties.format}</li>
                                <li>Size (kB) : {file_properties.size_in_kbytes}</li>
                            </ul>
                            <ul>
                                <li>Created : {createdDate}</li>
                                <li>Updated : {updatedDate}</li>
                                <li>Deleted : {deletedDate}</li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>

        );
    }

    return (
        <Container className="">
            <Button variant="outline-primary" onClick={handleShow}>
                Browse widen catalog
            </Button>
        </Container>
    );
};

Viewer.displayName = 'EditViewer';

export default Viewer;
