import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import DefaultImage from '../../../../assets/images/default-image.png';
import FavTrueIcon from '../../../../assets/icons/favourite-true.png';
import AddressIcon from '../../../../assets/images/address.png';

import './favourites-desktop.css';

class FavouriteItem extends Component {

    render() {
        const {data, available} = this.props;
        const Image = data.better_featured_image ? data.better_featured_image.source_url : DefaultImage;

        const [any] = this.props.available;

        if (!any) {
            return null;
        }

        return (
            <div className="col-sm-6 col-md-4 hidden-xs c-favourites__desktop-item">
                <Link to={data.slug}>
                <h4 className="c-favourites__desktop-title">{data.title.rendered}</h4></Link>
                <img src={FavTrueIcon} alt="Add to favourites"
                     className="inline pull-right c-favourites__desktop-fav-icon" onClick={() => this.props.onRemoveFav(data.ID)}/>
                <div className="col-xs-12 col-sm-10 col-sm-offset-1 c-favourites__desktop-image"
                     style={{backgroundImage: "url(" + Image + ")"}}>
                </div>
                <div className="col-xs-12 text-center c-favourites__desktop-address">
                    <img src={AddressIcon} alt="Restaurant Address"
                         className="inline c-favourites__desktop-address-icon"/>
                    <p className="small-text inline c-favourites__desktop-address-text">{data.acf.address.address}</p>
                </div>

                <div className="col-sm-12 c-favourites__desktop-button">
                    {available.map((table, i) => (
                        <button className="btn btn-transparent" key={i} onClick={() => this.props.onPopup(data, table)}>
                            <p dangerouslySetInnerHTML={{__html: table.content.rendered}}/>
                            <p style={{paddingLeft: 5}}>- {table.acf.timeframe}</p>
                        </button>
                    ))}

                </div>
            </div>
        )
    }
}

export default FavouriteItem;

