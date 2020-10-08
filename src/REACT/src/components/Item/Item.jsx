import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'react-bootstrap';
import {StoreContext} from "contexts";
import get from "lodash.get";

const Decote=({discount,price}) => {

    const { state } = React.useContext(StoreContext);
    const {locale} = state

    const [dashedPrice] = price.map( prc => Number(prc));
    const formatedDashedPrice = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(dashedPrice);

    const [discountNumber] = discount.map( discnt => Number(discnt));
    const formatedDiscount = new Intl.NumberFormat(locale, { style: 'percent'}).format(-Number(discountNumber)/100)


    return(
        <>
            <span className="bg-danger d-block text-white font-weight-bold">{formatedDiscount}</span>
            <del className="text-muted small mr-3">{formatedDashedPrice}</del>
        </>
    );
}

Decote.propTypes={
    discount:PropTypes.array.isRequired,
    price:PropTypes.array.isRequired
}

const Item=({item})=>{
// console.log("[Item] item : ",item);
    const { state,dispatch } = React.useContext(StoreContext);
    const {selectedItem} = state //TODO locale is needed for the date format
    const {thumbnails,created_date,filename,id,embeds} = item;
    const thumbnailURL = get(thumbnails,"160px.url",null);
    const url = get(embeds,"templated.url",null);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(created_date);
    date = date.toLocaleDateString('fr-FR', options);

    const active = selectedItem.id===id?"active":"";
    const handleClick = () =>
        dispatch({
            case:"UPDATE_SELECTED_ITEM",
            payload:{
                id,
                url
            }
        });

    return(
        <Card className={active} onClick={handleClick}>
            {thumbnailURL &&
            <Card.Img variant="top" src={thumbnailURL}/>
            }
            <Card.Body>
                <Card.Title>{filename}</Card.Title>
                {/*<Card.Text>*/}
                {/*    {meta.description}*/}
                {/*</Card.Text>*/}
            </Card.Body>
            <Card.Footer className="text-center">
                {/*{discount &&*/}
                {/*    <Decote*/}
                {/*        discount={meta.decote}*/}
                {/*        price={meta.prix_barre}/>*/}
                {/*}*/}
                {date}
            </Card.Footer>
        </Card>
    )
}

Item.propTypes={
    item:PropTypes.object.isRequired,
}

export default Item;