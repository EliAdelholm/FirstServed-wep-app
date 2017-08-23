import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as MyActions from '../../../actions/MyActionCreator';

import ConsumerNavTop from '../../../components/ConsumerNavTop';
import ConsumerNavBottom from '../../../components/ConsumerNavBottom';
import PopupBox from '../../../components/PopupBox';

import Reservation from '../Bookings/Reservation';

import FavouriteItem from './FavouriteSorting';

import './favourites.css';

class FavouriteRestaurants extends Component {
    state = {
        isLoading: false, activeToggle: "Available", favourites: [], waitingList: [], popup: false,
        viewBooking: false,
        bookingData: null,
        bookingTable: null
    };

    handleUpdate = async() => {
        this.setState({updating: true});
        const {onRequestRestaurantTables} = this.props;
        const {favourites} = this.state;

        await onRequestRestaurantTables(favourites);
        this.setState({updating: false});
    };

    async componentDidMount() {
        this.interval = setInterval(this.handleUpdate, 5000);
        const {onRequestUserData, onRequestFavourites, onRequestRestaurantTables} = this.props;
        // eslint-disable-next-line
        const [user] = this.props.user;
        const [favourite] = this.props.favourite;
        this.setState({isLoading: true});

        try {
            // eslint-disable-next-line
            if (!user) {
                await onRequestUserData();
            }

            const [ user ] = this.props.user;
            const favIDs = user.acf.favourites.map((fav, i) => {
                return fav;
            });

            const waitIDs = user.acf.waiting_for.map((wait, i) => {
                return wait;
            });

            if (!favourite) {
                onRequestFavourites(favIDs);
            }

            await onRequestRestaurantTables(favIDs);
            this.setState({isLoading: false, favourites: favIDs, waitingList: waitIDs});

        } catch (err) {
            console.error(err);
        }

    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    handleToggle = (toggle) => {
        this.setState({activeToggle: toggle});
    };

    handlePopup = (restaurant, available) => {
        this.setState({popup: !this.state.popup, bookingData: restaurant, bookingTable: available});
    };

    handleBooking = () => {
        this.setState({viewBooking: true, popup: false});
    };

    handleRemoveFavourite = async(fav) => {
        const {onUpdateUserData} = this.props;
        const [ user ] = this.props.user;

        this.setState({isLoading: true});

        const newFavArray = this.state.favourites.filter(obj => obj !== fav);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "favourites": newFavArray
                }
            });

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false})
        }

        this.setState({isLoading: false, favourites: newFavArray});
        console.log(this.state.favourites)
    };

    handleJoinWaitingList = async(restaurant) => {
        const {onUpdateUserData} = this.props;
        const [user] = this.props.user;
        this.setState({isLoading: true});

        const newArray = this.state.waitingList.concat([restaurant]);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "waiting_for": newArray
                }
            });

            this.setState({isLoading: false, waitingList: newArray});

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false});
        }
    };

    handleLeaveWaitingList = async(restaurant) => {
        const {onUpdateUserData} = this.props;
        const [user] = this.props.user;
        this.setState({isLoading: true});

        const newArray = this.state.waitingList.filter(obj => obj !== restaurant);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "waiting_for": newArray
                }
            });

            this.setState({isLoading: false, waitingList: newArray});

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false});
        }
    };


    render() {
        const {favourite, tables} = this.props;
        const favIDs = this.state.favourites;
        const [user] = this.props.user;

        let filtered = favourite.filter(function (item) {
            return favIDs.indexOf(item.id) !== -1;
        });

        let available = tables.filter(function (table) {
            if (table.parent === 0 && !table._links.children && table.acf.timeframe) {
                if (table.acf.timeframe > moment().format('HH:mm')) {
                    return table;
                }
            } else {
                return null;
            }
        });

        const [any] = available;

        return (
            <div className="row c-favourites">
                <ConsumerNavTop currentPage="Favourites"/>
                {!this.state.viewBooking &&
                <div>
                    <div className="col-xs-12 col-sm-8 c-favourites__toggle-bar">
                        <div className="col-xs-4 c-favourites__toggle-item medium-text"
                             onClick={() => this.handleToggle("Available")}
                             style={{
                                 borderRight: "1px solid #112437",
                                 backgroundColor: this.state.activeToggle === "Available" && "#112437",
                                 color: this.state.activeToggle === "Available" && "#f2f0ed",
                                 borderRadius: "14px 0px 0px 14px"
                             }}>
                            Available
                        </div>
                        <div className="col-xs-4 c-favourites__toggle-item medium-text"
                             onClick={() => this.handleToggle("Waiting")}
                             style={{
                                 borderRight: "1px solid",
                                 backgroundColor: this.state.activeToggle === "Waiting" && "#112437",
                                 color: this.state.activeToggle === "Waiting" && "#f2f0ed"
                             }}>
                            Waiting list
                        </div>
                        <div className="col-xs-4 c-favourites__toggle-item medium-text"
                             onClick={() => this.handleToggle("All")}
                             style={{
                                 backgroundColor: this.state.activeToggle === "All" && "#112437",
                                 color: this.state.activeToggle === "All" && "#f2f0ed",
                                 borderRadius: "0px 14px 14px 0px"
                             }}>
                            See all
                        </div>
                    </div>

                    <div className="col-xs-12 col-lg-10 col-lg-offset-1 c-favourites__wrapper">
                        {!any && this.state.activeToggle === "Available" && (
                            <p className="text-center">There are currently no available tables</p>
                        )}

                        {filtered.map((fav, i) => {
                            return (
                                <FavouriteItem key={i} data={fav} user={user}
                                               view={this.state.activeToggle}
                                               waitingList={this.state.waitingList}
                                               onRemoveFav={this.handleRemoveFavourite}
                                               onJoinWait={this.handleJoinWaitingList}
                                               onLeaveWait={this.handleLeaveWaitingList}
                                               onPopup={this.handlePopup}
                                               tables={this.props.tables}
                                />
                            )
                        })}
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

                <ConsumerNavBottom active="favourites"/>

            </div>
        );
    }
}

export default connect((state) => ({
    user: Object.values(state.users),
    favourite: Object.values(state.favourites),
    tables: Object.values(state.restaurantTables),
}), {
    onRequestUserData: MyActions.requestUserData,
    onRequestFavourites: MyActions.fetchFavourites,
    onUpdateUserData: MyActions.updateUserAcfData,
    onRequestRestaurantTables: MyActions.fetchRestaurantTables,
})(FavouriteRestaurants);
