import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import AddressIcon from '../../../assets/images/address-blue.png'

class MapItem extends Component {

    render() {
        const {restaurant} = this.props;

        return (
            <div className="col-xs-12 c-restaurant-item">
                <Link to={restaurant.slug}>
                <div className="col-xs-12 c-restaurant-item__header">
                    <p className="">{restaurant.title.rendered}</p>
                </div>
                </Link>

                <div className="col-xs-12 c-restaurant-item__description">
                    <p className="medium-text">{restaurant.acf.short_description}</p>
                </div>
                {/*<div className="col-xs-12 c-restaurant-item__table">
                    <p className="small-text">AVAILABLE TABLE</p>
                </div>*/}
                <div className="col-xs-12 c-restaurant-item__address">
                    <img src={AddressIcon} alt="Restaurant Address" className="inline"/>
                    <p className="small-text inline">{restaurant.acf.address.address}</p>
                </div>

            </div>
        )
    }
}

export default MapItem;