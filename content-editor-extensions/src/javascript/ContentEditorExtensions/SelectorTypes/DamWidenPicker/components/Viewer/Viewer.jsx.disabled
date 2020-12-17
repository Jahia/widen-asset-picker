import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EditIcon from '@material-ui/icons/Edit';

import {StoreContext} from '../../contexts';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    editIcon: {
        height: 38,
        width: 38,
    },
});


const ViewerCmp = props => {
    const {classes} = props;

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
            <Card className={classes.root}>
                <CardMedia
                    className={classes.cover}
                    image={thumbnail}
                    title={filename}
                />
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            {filename}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {file_properties.format} | {file_properties.size_in_kbytes} kB
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton aria-label="update" onClick={handleShow}>
                            <EditIcon className={classes.editIcon}/>
                        </IconButton>
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <HighlightOffIcon />
                        </IconButton>
                    </div>
                </div>

            </Card>
        );
    }


    // <Container className="">
    //     <Row>
    //         <Col xs="4" sm="3" md="4" lg="3">
    //             <img src={thumbnail}/>
    //             <Button variant="outline-primary" onClick={handleShow}>
    //                 Update
    //             </Button>
    //             <Button variant="outline-danger" onClick={handleDelete}>
    //                 Delete
    //             </Button>
    //         </Col>
    //         <Col>
    //             <h3>{filename}</h3>
    //             <div className="info-wrapper">
    //                 <ul>
    //                     <li>Type : {file_properties.format_type}</li>
    //                     <li>Format : {file_properties.format}</li>
    //                     <li>Size (kB) : {file_properties.size_in_kbytes}</li>
    //                 </ul>
    //                 <ul>
    //                     <li>Created : {createdDate}</li>
    //                     <li>Updated : {updatedDate}</li>
    //                     <li>Deleted : {deletedDate}</li>
    //                 </ul>
    //             </div>
    //         </Col>
    //     </Row>
    // </Container>


    return (
        <Button variant="outlined" color="primary" onClick={handleShow}>
            Browse widen catalog
        </Button>
    );
};

ViewerCmp.propTypes = {
    classes: PropTypes.object.isRequired,
}

export const Viewer = withStyles(styles)(ViewerCmp);
Viewer.displayName = 'EditViewer';
