import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import moment from 'moment';

import * as MyActions from '../../../../actions/MyActionCreator';

import AddressIcon from '../../../../assets/images/address.png';

import './bookings-desktop.css';


class UserBookings extends Component {
    state = {isLoading: false};

    handleUpdate = async() => {
        this.setState({updating: true});
        const {onRequestRestaurantTables, data} = this.props;
        await onRequestRestaurantTables(data.id);
        this.setState({updating: false});
    };

    async componentDidMount() {
        this.interval = setInterval(this.handleUpdate, 10000);
        const {onRequestRestaurantTables, data} = this.props;
        this.setState({isLoading: true});

        try {
            await onRequestRestaurantTables(data.id);

            this.setState({isLoading: false})

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false})
        }

    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    render() {
        const {data, tables} = this.props;

        let wantedData = tables.filter(function (table) {
            if (table.parent === 0 && !table._links.children && table.acf.timeframe) {
                if (table.acf.timeframe > moment().format('HH:mm')) {
                    return table.post === data.id;
                }
            } else {
                return null;
            }
        });

        let [available] = wantedData;

        if (!available) {
            return null;
        }

        return (
            <div className="col-sm-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 c-bookings-desktop__item">
                <div className="pull-left inline c-bookings-desktop__item-info">
                    <Link to={data.slug}><p className="active-text">{data.title.rendered}</p></Link>
                    <img src={AddressIcon} alt="Address" className="c-bookings-desktop__address-icon inline"/>
                    <p className="small-text inline">{data.acf.address.address}</p>
                </div>
                <div className="c-bookings-desktop__book-button">
                    {wantedData.map((table, i) => (
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

export default connect((state) => ({
    tables: Object.values(state.restaurantTables),
}), {
    onRequestRestaurantTables: MyActions.fetchRestaurantTables,
})(UserBookings);

