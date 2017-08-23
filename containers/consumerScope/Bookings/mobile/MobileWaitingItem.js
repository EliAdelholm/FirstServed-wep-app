import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './bookings-mobile.css';


class UserBookings extends Component {

    render() {
        const {data, waitingList} = this.props;

        if (!waitingList.includes(data.id)) {
            return null;
        }

        return (
            <div className="col-xs-12 c-bookings__waiting-item">
                <div className="pull-left inline c-bookings__waiting-info">
                    <Link to={data.slug}><p>{data.title.rendered}</p></Link>
                    <p className="small-text c-bookings__address-text">{data.acf.address.address}</p>
                </div>
                <div className="pull-right inline">
                    <button className="btn btn-primary"
                            onClick={() => this.props.onLeave(data.id)}>
                        <p className="medium-text"
                           style={{margin: 0}}>Leave list</p>
                    </button>
                </div>
            </div>
        )
    }
}

export default UserBookings;

