import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'react-bootstrap';
import {StoreContext} from "contexts";

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

    const { state } = React.useContext(StoreContext);
    const {locale} = state
    const {meta} = item;
    const [imagePath] = meta.photo;
    const discount = meta.type_com.includes("Promotion");

    let [price] = meta.prix;
    price = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(price);

    return(
        <Card>
            {imagePath &&
            <Card.Img variant="top" src={`https://www.promod.fr${imagePath}`}/>
            }
            <Card.Body>
                <Card.Title>{meta.libelle}</Card.Title>
                {/*<Card.Text>*/}
                {/*    {meta.description}*/}
                {/*</Card.Text>*/}
            </Card.Body>
            <Card.Footer className="text-center">
                {discount &&
                    <Decote
                        discount={meta.decote}
                        price={meta.prix_barre}/>
                }
                {price}
            </Card.Footer>
        </Card>
    )
}

Item.propTypes={
    item:PropTypes.object.isRequired,
}

export default Item;