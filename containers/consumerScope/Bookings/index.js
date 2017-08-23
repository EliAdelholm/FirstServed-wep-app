import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as MyActions from '../../../actions/MyActionCreator';

import ConsumerNavTop from '../../../components/ConsumerNavTop';
import ConsumerNavBottom from '../../../components/ConsumerNavBottom';
import PopupBox from '../../../components/PopupBox';

import MobileAvailableTable from './mobile/MobileAvailableItem';
import MobileWaitingTable from './mobile/MobileWaitingItem';
import DesktopAvailableTable from './desktop/DesktopAvailableItem';
import DesktopWaitingTable from './desktop/DesktopWaitingItem';
import Reservation from './Reservation';

import AvailableIcon from '../../../assets/icons/user-available-table.png';
import WaitingIcon from '../../../assets/icons/user-booked-table.png';

import './bookings.css';


class UserBookings extends Component {
    state = {
        isLoading: false,
        popup: false,
        viewBooking: false,
        bookingData: null,
        bookingTable: null,
        waitingList: []
    };

    async componentDidMount() {
        const {onRequestUserData, onRequestWaitingList} = this.props;
        const [ user ] = this.props.user;
        this.setState({isLoading: true});

        if(!user) {
            await onRequestUserData();
        }

        try {

            const [ user ] = this.props.user;
            const getIDs = user.acf.waiting_for.map((rest, i) => {
                return rest;
            });

            if (getIDs.length !== 0) {
                onRequestWaitingList(getIDs);
            }

            this.setState({isLoading: false, waitingList: getIDs});

        } catch (err) {
            console.error(err);
        }

    };

    handleLeaveWaitList = async(wait) => {
        const {onUpdateUserData, onRemoveWaitingList} = this.props;
        const [ user ] = this.props.user;

        this.setState({isLoading: true});

        const newWaitArray = this.state.waitingList.filter(obj => obj !== wait);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "waiting_for": newWaitArray
                }
            });

            await onRemoveWaitingList(wait);

            this.setState({isLoading: false, waitingList: newWaitArray});

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false})
        }
    };

    handlePopup = (data, available) => {
        this.setState({popup: !this.state.popup, bookingData: data, bookingTable: available});
    };

    handleBooking = () => {
        this.setState({viewBooking: true, popup: false});
    };

    render() {
        const {waitingList} = this.props;

        return (
            <div className="row c-bookings">

                <ConsumerNavTop currentPage="Bookings"/>

                {!this.state.viewBooking &&
                <div>
                    <div className="col-xs-12 visible-xs c-bookings__available">
                        <h1>Available tables</h1>
                        {this.state.waitingList && waitingList.map((restaurant, i) => {
                            return (
                                <MobileAvailableTable key={i} data={restaurant} onPopup={this.handlePopup}/>
                            )
                        })}
                        {this.state.isLoading &&
                        <p className="medium-text text-center">Looking for tables</p>
                        }
                        {waitingList.length === 0 &&
                        <p className="medium-text text-center">No available tables to show</p>
                        }
                    </div>

                    <div className="hidden-xs col-sm-6 c-bookings__desktop-list">
                        <div className="c-bookings-desktop__list-header">
                            <img src={AvailableIcon} alt="Available tables"
                                 className="c-bookings-desktop__table-icon"/>
                            <h4>Available tables</h4>
                        </div>
                        {this.state.waitingList && waitingList.map((restaurant, i) => {
                            return (
                                <DesktopAvailableTable key={i} data={restaurant} onPopup={this.handlePopup}/>
                            )
                        })}
                        {this.state.isLoading &&
                        <p className="medium-text text-center">Looking for tables</p>
                        }
                        {waitingList.length === 0 &&
                        <p className="medium-text text-center">No available tables to show</p>
                        }
                    </div>

                    <div className="col-xs-12 visible-xs c-bookings__waiting">
                        <h1>Waiting list</h1>
                        {waitingList.length > 0 && waitingList.map((restaurant, i) => {
                            return (
                                <MobileWaitingTable key={i} data={restaurant} onLeave={this.handleLeaveWaitList}
                                                    waitingList={this.state.waitingList}/>
                            )
                        })}
                        {waitingList.length === 0 &&
                        <p className="medium-text text-center">You are not on any waiting lists</p>
                        }
                    </div>

                    <div className="hidden-xs col-sm-6 c-bookings__desktop-list">
                        <div className="c-bookings-desktop__list-header">
                            <img src={WaitingIcon} alt="Available tables"
                                 className="c-bookings-desktop__table-icon"/>
                            <h4>Waiting list</h4>
                        </div>
                        {waitingList.length > 0 && waitingList.map((restaurant, i) => {
                            return (
                                <DesktopWaitingTable key={i} data={restaurant} onLeave={this.handleLeaveWaitList}
                                                     waitingList={this.state.waitingList}/>
                            )
                        })}
                        {waitingList.length === 0 &&
                        <p className="medium-text text-center">You are not on any waiting lists</p>
                        }
                    </div>
                </div>
                }

                {this.state.popup &&
                <PopupBox text="Do you want to book this table?"
                          extra={this.state.bookingData.acf.available_active && " You will have the table for " + Math.floor(this.state.bookingData.acf.available_for / 60) + " hours and " +
                          this.state.bookingData.acf.available_for % 60 + " minutes "}
                          btnLeft="Book" btnRight="Cancel" onLeftClick={this.handleBooking}
                          onRightClick={this.handlePopup}/>
                }

                {this.state.viewBooking &&
                <Reservation data={this.state.bookingData} table={this.state.bookingTable}/>
                }

                <ConsumerNavBottom active="bookings"/>

            </div>

        )
    }
}

export default connect((state) => ({
    user: Object.values(state.users),
    waitingList: Object.values(state.waitingList),
}), {
    onRequestUserData: MyActions.requestUserData,
    onRequestWaitingList: MyActions.fetchWaitingList,
    onUpdateUserData: MyActions.updateUserAcfData,
    onRemoveWaitingList: MyActions.removeWaitingList,
})(UserBookings);
