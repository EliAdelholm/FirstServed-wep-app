import React, {Component} from 'react';
import {connect} from 'react-redux';
import SearchInput, {createFilter} from 'react-search-input'
import moment from 'moment';
import geolib from 'geolib';

import * as MyActions from '../../../actions/MyActionCreator';

import ConsumerNavTop from '../../../components/ConsumerNavTop';
import ConsumerNavBottom from '../../../components/ConsumerNavBottom';
import PopupBox from '../../../components/PopupBox';
import RestaurantMap from './RestaurantMap';
import RestaurantItem from './RestaurantItem';

import Reservation from '../Bookings/Reservation';

import './consumer.css';
import './desktop.css';

const SEARCH_FILTERS = ['title.rendered'];

let position;

class RestaurantList extends Component {
    state = {
        currentPosition: null,
        restaurants: [],
        restaurantsPrice: [],
        restaurantsAZ: [],
        restaurantsNearby: [],
        mapView: false,
        pageView: false,
        searchTerm: '',
        activeFilter: "",
        availableFilter: "Right Now",
        kitchenFilter: "Danish",
        priceFilter: "Low to High",
        isWaitingFor: [],
        favourites: [],
        popup: false,
        viewBooking: false,
        bookingData: null,
        bookingTable: null,
    };


    async componentDidMount() {
        const {onRequestRestaurants, onRequestUserData, onRequestAllRestaurantTables} = this.props;

        try {
            await onRequestUserData();
            await onRequestAllRestaurantTables();
            await onRequestRestaurants();

        } catch (err) {
            console.error(err);
        }

        const [user] = this.props.user;
        const {restaurants} = this.props;
        this.setState({
            isWaitingFor: user.acf.waiting_for,
            favourites: user.acf.favourites,
            restaurants: restaurants,
            restaurantsPrice: restaurants.slice(),
            restaurantsAZ: restaurants.slice(),
            restaurantsNearby: restaurants.slice(),
            activeFilter: position? "Nearby" : "A-Z",
        })
    }

    searchUpdated = (term) => {
        this.setState({searchTerm: term})
    };

    handleMapView = () => {
        this.setState({mapView: !this.state.mapView})
    };

    handleChangeFilter = (filter) => {
        this.setState({activeFilter: filter})
    };

    handleAvailable = (available) => {
        this.setState({availableFilter: available})
    };

    handleKitchen = (kitchen) => {
        this.setState({kitchenFilter: kitchen})
    };

    handlePrice = (price) => {
        this.setState({priceFilter: price})
    };

    handlePopup = (restaurant, available) => {
        this.setState({popup: !this.state.popup, bookingData: restaurant, bookingTable: available});
    };

    handleBooking = () => {
        this.setState({viewBooking: true, popup: false});
    };

    handleJoinWaitingList = async(user, restaurant) => {
        const {onUpdateUserData} = this.props;
        this.setState({isLoading: true});

        const newArray = this.state.isWaitingFor.concat([restaurant.id]);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "waiting_for": newArray
                }
            });

            this.setState({isLoading: false, isWaitingFor: newArray});

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false});
        }
    };

    handleLeaveWaitingList = async(user, restaurant) => {
        const {onUpdateUserData} = this.props;
        this.setState({isLoading: true});

        const newArray = this.state.isWaitingFor.filter(obj => obj !== restaurant.id);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "waiting_for": newArray
                }
            });

            this.setState({isLoading: false, isWaitingFor: newArray});

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false});
        }
    };

    handleAddFavourite = async(user, restaurant) => {
        const {onUpdateUserData} = this.props;
        this.setState({isLoading: true});

        const newArray = this.state.favourites.concat([restaurant.id]);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "favourites": newArray
                }
            });

            this.setState({isLoading: false, favourites: newArray});

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false});
        }
    };

    handleRemoveFavourite = async(user, restaurant) => {
        const {onUpdateUserData} = this.props;
        this.setState({isLoading: true});

        const newArray = this.state.favourites.filter(obj => obj !== restaurant.id);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "favourites": newArray
                }
            });

            this.setState({isLoading: false, favourites: newArray});

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false});
        }
    };

    render() {
        const {tables} = this.props;
        const [user] = this.props.user;
        const kitchen = this.state.kitchenFilter;
        const {activeFilter, restaurants, restaurantsAZ, restaurantsPrice, restaurantsNearby} = this.state;

        const searchRestaurants = restaurants.filter(createFilter(this.state.searchTerm, SEARCH_FILTERS));

        function success(pos) {
            position = pos.coords;
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error);

        const getDistances = position && restaurantsNearby.map(function(restaurant) {
            const distance = geolib.getDistance(
                {latitude: position.latitude, longitude: position.longitude},
                {latitude: restaurant.acf.address.lat, longitude: restaurant.acf.address.lng}
            );

            restaurant.distance = distance;
            return restaurant;
        });

        const nearbyFilter = position && getDistances.sort(function (a,b) {
            return a.distance > b.distance;
        });

        console.log(nearbyFilter);

        let AZ = function compare(a,b) {
             return a.title.rendered > b.title.rendered;

        };

        let AZFilter = restaurantsAZ.sort(AZ);

        let validTables = tables.filter(function (table) {
            if (table.parent === 0 && !table._links.children && table.acf.timeframe) {
                if (table.acf.timeframe > moment().format('HH:mm')) {
                    return table;
                }
            }
        });

        let hasTable = validTables.map((table) => {
            return table.post
        });

        const availaableNowFilter = restaurants.filter(function (restaurant) {
            if (hasTable.includes(restaurant.id)) {
                return restaurant;
            }
        });

        const regularBookingFilter = restaurants.filter(function (restaurant) {
            if (!restaurant.acf.fully_booked) {
                return restaurant;
            }
        });

        const availableFilter = this.state.availableFilter === "Right Now" ? availaableNowFilter : regularBookingFilter;

        const kitchenFilter = restaurants.filter(function (restaurant) {
            return restaurant.acf.kitchen_type.includes(kitchen);
        });

        const lowToHigh = function compare(a,b) {
            if (a.acf.price_level < b.acf.price_level)
                return -1;
            if (a.acf.price_level > b.acf.price_level)
                return 1;
            return 0;
        };

        const highToLow = function compare(a,b) {
            if (a.acf.price_level > b.acf.price_level)
                return -1;
            if (a.acf.price_level < b.acf.price_level)
                return 1;
            return 0;
        };

        const priceFilter = activeFilter === "Price" && this.state.priceFilter === "Low to High" ? restaurantsPrice.sort(lowToHigh) : restaurantsPrice.sort(highToLow);

        const handleList = this.state.searchTerm !== '' ? searchRestaurants : activeFilter === "Kitchen" ? kitchenFilter : activeFilter === "Available" ? availableFilter : activeFilter === "A-Z" ? AZFilter : activeFilter === "Price" ? priceFilter : activeFilter === "Nearby" ? nearbyFilter : restaurants;

        return (
            <div className="row c-consumer">
                <div className="visible-xs">
                    <ConsumerNavTop currentPage="restaurants" mapView={this.state.mapView}
                                    desktop={false}
                                    activeFilter={this.state.activeFilter}
                                    availableFilter={this.state.availableFilter}
                                    kitchenFilter={this.state.kitchenFilter}
                                    priceFilter={this.state.priceFilter}
                                    onHandleMapView={this.handleMapView}
                                    onChangeFilter={this.handleChangeFilter}
                                    onFilterAvailable={this.handleAvailable}
                                    onFilterKitchen={this.handleKitchen}
                                    onFilterPrice={this.handlePrice}
                                    position={position}/>
                </div>

                {this.state.mapView &&
                <div className="c-consumer__map-container">
                    <RestaurantMap/>
                </div>
                }

                {!this.state.mapView && !this.state.viewBooking &&
                <div className="col-xs-12" style={{marginBottom: 40, padding: 0}}>
                    <SearchInput
                        className="col-xs-12 col-sm-6 col-sm-offset-6 col-md-4 col-md-offset-8 col-lg-3 col-lg-offset-9 search-input"
                        onChange={this.searchUpdated}
                        placeholder="Search restaurants"/>
                    {handleList.map((restaurant, i) => {
                        return (
                            <div key={restaurant.id}>
                                <div
                                    className="c-restaurant-item__container col-xs-12 col-sm-6 col-lg-4">
                                    <RestaurantItem restaurant={restaurant} index={i} user={user}
                                                    leaveWaitingList={this.handleLeaveWaitingList}
                                                    joinWaitingList={this.handleJoinWaitingList}
                                                    addFavourite={this.handleAddFavourite}
                                                    removeFavourite={this.handleRemoveFavourite}
                                                    isWaitingFor={this.state.isWaitingFor}
                                                    favourites={this.state.favourites}
                                                    onPopup={this.handlePopup}
                                                    activeFilter={this.state.activeFilter}
                                                    availableFilter={this.state.availableFilter}
                                    />
                                </div>
                            </div>
                        )
                    })}
                    {handleList.length === 0 &&
                    <div className="col-xs-12 text-center passive-text">
                        <p>No restaurants found</p>
                    </div>}

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


                <ConsumerNavBottom active="restaurants" currentPage="restaurants" mapView={this.state.mapView}
                                   activeFilter={this.state.activeFilter}
                                   availableFilter={this.state.availableFilter}
                                   kitchenFilter={this.state.kitchenFilter}
                                   priceFilter={this.state.priceFilter}
                                   onHandleMapView={this.handleMapView}
                                   onChangeFilter={this.handleChangeFilter}
                                   onFilterAvailable={this.handleAvailable}
                                   onFilterKitchen={this.handleKitchen}
                                   onFilterPrice={this.handlePrice}
                                   position={position}/>
            </div>
        )
    }
}

export default connect((state) => ({
    restaurants: Object.values(state.restaurants),
    user: Object.values(state.users),
    tables: Object.values(state.restaurantTables),
}), {
    onRequestRestaurants: MyActions.fetchRestaurants,
    onRequestAllRestaurantTables: MyActions.fetchAllRestaurantTables,
    onAuthenticationAccess: MyActions.accessAuthentication,
    onRequestUserData: MyActions.requestUserData,
    onUpdateUserData: MyActions.updateUserAcfData,
})(RestaurantList);