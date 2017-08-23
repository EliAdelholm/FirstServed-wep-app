import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FavIcon from '../../../../assets/icons/favourite-true.png';

import '../favourites.css';

class WaitingItem extends Component {

    render() {
        const {data, toggle} = this.props;

        return (
            <div className="col-xs-12 visible-xs c-favourites__item">
                <div className="col-xs-3">
                    <img src={FavIcon} alt="Favourite" className="c-favourites__icon c-favourites__heart"
                         onClick={() => this.props.onRemoveFav(data.ID)}/>
                </div>
                <div className="col-xs-4 c-favourites__item-info">
                    <Link to={data.slug}><p className="active-text">{data.title.rendered}</p></Link>

                    <div>
                        <p className="small-text">Join the waiting list and be notified when there is an open table</p>
                    </div>

                </div>

                <div className="col-xs-5 text-right" style={{padding: 0}}>
                    <button className={toggle ? "btn btn-primary" : "btn btn-transparent"}
                            onClick={() => this.props.onToggleWait(data.id)} style={{marginTop: 20}}>
                        <p className="medium-text"
                           style={{margin: 0}}>{toggle ? "Leave list" : "Join list"}</p>
                    </button>
                </div>

            </div>
        )
    }
}

export default WaitingItem;

