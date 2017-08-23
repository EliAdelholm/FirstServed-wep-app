import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import AddressIcon from '../../../../assets/images/address.png';
import DismissIcon from '../../../../assets/icons/no-booking.png';

import './bookings-desktop.css';


class UserBookings extends Component {

    render() {
        const {data, waitingList} = this.props;

        if (!waitingList.includes(data.id)) {
            return null;
        }

        return (
            <div className="col-sm-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 c-bookings-desktop__item">
                <div className="pull-left inline c-bookings__desktop-info">
                    <Link to={data.slug}><p className="active-text">{data.title.rendered}</p></Link>
                    <img src={AddressIcon} alt="Address" className="c-bookings-desktop__address-icon inline"/>
                    <p className="small-text inline c-bookings-desktop__address-text">{data.acf.address.address}</p>
                </div>
                <div className="pull-right inline">
                    <button className="btn btn-primary"
                            onClick={() => this.props.onLeave(data.id)} style={{marginTop: 10}}>
                        <p className="medium-text"
                           style={{margin: 0}}>Leave list</p>
                    </button>
                </div>
            </div>
        )
    }
}

export default UserBookings;

