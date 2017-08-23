import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as MyActions from '../../../actions/MyActionCreator';

import PeopleIcon from '../../../assets/icons/congrats-name.png';
import TimeIcon from '../../../assets/icons/congrats-time.png';
import AddressIcon from '../../../assets/icons/congrats-address.png';
import PhoneIcon from '../../../assets/icons/congrats-phone.png';

import './bookings.css';

class Reservation extends Component {
    state = {isLoading: true, confirmBooking: "calculating"};

    async componentDidMount() {
        const {table, onRequestTableBooking, onBookTable, onUpdateUserData, data, onRequestRestaurantTables} = this.props;
        const [user] = this.props.user;

        try {
            await onRequestTableBooking(table.id);

            const {bookingTable} = this.props;

            let getTable = bookingTable.filter(function (data) {
                return data.id === table.id;
            });

            const [booking] = getTable;

            console.log(booking._links.children);

            if(!booking._links.children) {

                console.log("book table", booking.post, booking.id);
                await onBookTable(user.name, table.post, table.id );
                await onUpdateUserData(user.id, {
                    "fields": {
                        "waiting_for": []
                    }
                });
                this.setState({confirmBooking: "true"});
                await onRequestRestaurantTables(data.id);
                this.handleAddPhone();
            } else {
                console.log("no book");
                this.setState({confirmBooking: "false"})
            }

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false})
        }

    };

    handleAddPhone = async() => {
        const {tables, onUpdateComment, onSendNotification, data} = this.props;
        const [user] = this.props.user;

        let tablesById = tables.map((tab, i) => (
            tab.id && tab.id
        ));

        let validIds = tablesById.filter(function (item) {
            return typeof item === 'number';
        });

        let id = validIds[validIds.length - 1];

        await onUpdateComment(id, {
                "fields": {
                    "phone": user.acf.phone
                }
            }
        );

        if(data.acf.notifications) {
            onSendNotification(data.acf.notification_id);
        }

    };

    render() {
        const {data, table} = this.props;

        const availableTime = Math.floor(table.acf.available_for / 60) + " hours and " +
            table.acf.available_for % 60 + " minutes ";

        return (
            <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 c-bookings__booked passive-text">
                {this.state.confirmBooking === "calculating" &&
                <h4>Checking booking information</h4>
                }
                {this.state.confirmBooking === "true" &&
                <div>
                    <h1 className="visible-xs">Congratulations,<br/>you got a table!</h1>
                    <h1 className="hidden-xs">Congratulations, you got a table!</h1>
                    <h1 className="c-bookings__booked-title">{data.title.rendered}</h1>
                    <p>{table.acf.available_for && table.acf.available_for !== ""? "You have the table for " + availableTime : "Here is your booking information"}</p>
                    <div className="col-xs-12 c-bookings__booked-info">
                        <div className="col-xs-6 c-bookings__booked-info__item">
                            <img src={PeopleIcon} alt="Number of people"/>
                            <p dangerouslySetInnerHTML={{__html: table.content.rendered}}/>
                        </div>
                        <div className="col-xs-6 c-bookings__booked-info__item">
                            <img src={TimeIcon} alt="Arrival time"/>
                            <p>Latest arrival {table.acf.timeframe}</p>
                        </div>
                        <div className="col-xs-6 c-bookings__booked-info__item">
                            <img src={AddressIcon} alt="Address"/>
                            <p>{data.acf.address.address}</p>
                        </div>
                        <div className="col-xs-6 c-bookings__booked-info__item">
                            <img src={PhoneIcon} alt="Phone number"/>
                            <p>{data.acf.phone}</p>
                        </div>
                    </div>
                </div>
                }
                {this.state.confirmBooking === "false" &&
                    <div>
                        <h1 style={{marginTop: 80}}>Sorry</h1>
                        <p>You were too late.<br/>Someone else got served first.</p>
                        <button style={{marginTop: 20}} className="btn btn-transparent">Try again</button>
                    </div>
                }
            </div>
        )
    }
}

export default connect((state) => ({
    user: Object.values(state.users),
    bookingTable: Object.values(state.bookingTables),
    tables: Object.values(state.restaurantTables),
}), {
    onRequestTableBooking: MyActions.fetchTableBooking,
    onBookTable: MyActions.bookTable,
    onUpdateUserData: MyActions.updateUserAcfData,
    onRequestRestaurantTables: MyActions.fetchRestaurantTables,
    onUpdateComment: MyActions.setTableTimeframe,
    onSendNotification: MyActions.sendReservationNotification,
})(Reservation);


