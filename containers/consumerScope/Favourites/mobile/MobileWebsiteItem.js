import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FavIcon from '../../../../assets/icons/favourite-true.png';

import '../favourites.css';

class WebsiteItem extends Component {

    render() {
        const {data} = this.props;

        return (
            <div className="col-xs-12 visible-xs c-favourites__item">
                <div className="col-xs-3">
                    <img src={FavIcon} alt="Favourite" className="c-favourites__icon c-favourites__heart" onClick={() => this.props.onRemoveFav(data.ID)}/>
                </div>
                <div className="col-xs-4 c-favourites__item-info">
                    <Link to={data.slug}><p className="active-text">{data.title.rendered}</p></Link>

                    <div>
                        <p className="small-text">Visit the restaurant's website to book a table.</p>
                    </div>


                </div>

                <div className="col-xs-5 text-right" style={{padding: 0}}>
                    <a href={data.acf.website_link} target="_blank">
                    <button className="btn btn-transparent" style={{marginTop: 10}} >
                        <p className="medium-text" style={{margin: 0}}>Visit website</p>
                    </button>
                    </a>
                </div>
            </div>
        )
    }
}

export default WebsiteItem;

