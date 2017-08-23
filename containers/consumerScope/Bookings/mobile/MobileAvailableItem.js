import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import moment from 'moment';

import * as MyActions from '../../../../actions/MyActionCreator';

import TimeIcon from '../../../../assets/images/clock.png';

import './bookings-mobile.css';

class AvailableItem extends Component {
    state = {isLoading: false, updating: false};

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

            <div className="col-xs-12 c-bookings__available-item">
                <Link to={data.slug}><p>{data.title.rendered}</p></Link>

                {available && wantedData.map((table, i) => (
                    <div className="row" key={i} style={{marginBottom: 20, paddingLeft: 15}}>
                        <div className="col-xs-4" style={{padding: 0}}>
                            <div className="small-text" dangerouslySetInnerHTML={{__html: table.content.rendered}}/>
                            <img src={TimeIcon} alt="Arrival time" className="inline c-favourites__time"/>
                            <p className="small-text inline">{table.acf.timeframe}</p>
                        </div>
                        <div className="col-xs-8 text-right">
                            <button className="btn btn-transparent" onClick={() => this.props.onPopup(data, table)}>
                                <p className="medium-text">Book table</p>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

export default connect((state) => ({
    tables: Object.values(state.restaurantTables),
}), {
    onRequestRestaurantTables: MyActions.fetchRestaurantTables,
})(AvailableItem);


