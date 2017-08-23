import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as MyActions from '../../../actions/MyActionCreator';

import ConsumerNavBottom from '../../../components/ConsumerNavBottom';
import PopupBox from '../../../components/PopupBox';

import Reservation from '../Bookings/Reservation';

import DesktopClose from '../../../assets/icons/close-page.png';
import CloseIcon from '../../../assets/icons/nav-close.png';
import DefaultImage from '../../../assets/images/default-image.png';
import FavTrueIcon from '../../../assets/icons/restaurant-fav-true.png';
import FavFalseIcon from '../../../assets/icons/restaurant-fav-false.png';
import PriceIcon from '../../../assets/icons/restaurant-price.png';
import WebsiteIcon from '../../../assets/icons/restaurant-website.png';
import InstaIcon from '../../../assets/icons/restaurant-insta.png';
import NoInstaIcon from '../../../assets/icons/restaurant-no-insta.png';
import AddressIcon from '../../../assets/images/address.png';
import ReviewIcon from '../../../assets/icons/restaurant-review.png';
import PhoneIcon from '../../../assets/icons/restaurant-phone.png';

class RestaurantPage extends Component {
    state = {
        isLoading: true,
        priceBox: false,
        activePrice: null,
        restaurant: {},
        favourites: null,
        waitingList: null,
        popup: false,
        viewBooking: false,
        bookingData: null,
        bookingTable: null
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    async componentDidMount() {
        const {onRequestRestaurantData, onRequestUserData, onRequestRestaurantTables} = this.props;
        const {location} = this.props;

        try {
            await onRequestUserData();

            await onRequestRestaurantData(location.pathname);

            const {restaurantData} = this.props;
            const [user] = this.props.user;

            let getRestaurant = restaurantData.filter(function (data) {
                return data.slug === location.pathname.replace(/\//g, "");
            });

            let [restaurant] = getRestaurant;

            onRequestRestaurantTables(restaurant.id);

            this.setState({
                restaurant: restaurant,
                waitingList: user.acf.waiting_for,
                favourites: user.acf.favourites,
                isLoading: false
            });
            console.log("get tables");

        } catch (err) {
            console.error(err);
        }

    };

    handlePopup = (restaurant, available) => {
        this.setState({popup: !this.state.popup, bookingData: restaurant, bookingTable: available});
    };

    handleBooking = () => {
        this.setState({viewBooking: true, popup: false});
    };

    handleAddFavourite = async() => {
        const {onUpdateUserData} = this.props;
        const [user] = this.props.user;

        const newArray = this.state.favourites.concat([this.state.restaurant.id]);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "favourites": newArray
                }
            });

            this.setState({favourites: newArray});

        } catch (err) {
            console.error(err);
        }
    };

    handleRemoveFavourite = async() => {
        const {onUpdateUserData} = this.props;
        const [ user ] = this.props.user;

        const newFavArray = this.state.favourites.filter(obj => obj !== this.state.restaurant.id);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "favourites": newFavArray
                }
            });

        } catch (err) {
            console.error(err);
        }

        this.setState({favourites: newFavArray});
    };

    handleJoinWaitingList = async() => {
        const {onUpdateUserData} = this.props;
        const [user] = this.props.user;

        const newArray = this.state.waitingList.concat([this.state.restaurant.id]);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "waiting_for": newArray
                }
            });

            this.setState({waitingList: newArray});

        } catch (err) {
            console.error(err);
        }
    };

    handleLeaveWaitingList = async() => {
        const {onUpdateUserData} = this.props;
        const [user] = this.props.user;

        const newArray = this.state.waitingList.filter(obj => obj !== this.state.restaurant.id);
        console.log(newArray);

        try {
            await onUpdateUserData(user.id, {
                "fields": {
                    "waiting_for": newArray
                }
            });

            this.setState({waitingList: newArray});

        } catch (err) {
            console.error(err);
        }
    };

    handleClose = () => {
        const {history} = this.props;
        if (history.length > 1) {
            // this will take you back if there is history
            history.goBack();
        } else {
            // this will take you to the parent route if there is no history,
            // but unfortunately also add it as a new route
            let currentRoutes = this.context.router.getCurrentRoutes();
            let routeName = currentRoutes[currentRoutes.length - 2].name;
            this.context.router.transitionTo(routeName);
        }
    };

    handlePriceBox = (level) => {
        this.setState({priceBox: !this.state.priceBox, activePrice: level})
    };

    handlePriceLevel = (level) => {
        this.setState({activePrice: level})
    };


    render() {
        const {restaurant} = this.state;
        const {tables} = this.props;

        let available = tables.filter(function (table) {
            if (table.parent === 0 && !table._links.children && table.acf.timeframe) {
                if (table.acf.timeframe > moment().format('HH:mm')) {
                    return table.post === restaurant.id;
                }
            } else {
                return null;
            }
        });

        const [any] = available;

        let isWaiting = this.state.waitingList && this.state.waitingList.includes(restaurant.id);
        let isFavourite = this.state.favourites && this.state.favourites.includes(restaurant.id);

        const Image = !this.state.isLoading && restaurant && restaurant.better_featured_image ? restaurant.better_featured_image.source_url : DefaultImage;

        const PriceLevelOne = "At this level the average dining prize is below 500 DKK for one person.";
        const PriceLevelTwo = "At this level the average dining prize is 400-800 DKK for one person.";
        const PriceLevelThree = "At this level the average dining prize is above 800 DKK for one person.";

        const PhoneLink = "tel:";

        return (
            <div className="row c-restaurant-page">

                <ConsumerNavBottom active="restaurants" currentPage="restaurantPage"/>

                {!this.state.isLoading && !this.state.viewBooking && restaurant &&
                <div>
                    <div className="col-xs-12 c-restaurant-page__top-bar">
                        <h4 className="inline hidden-sm hidden-md hidden-lg">{restaurant.title.rendered}</h4>
                        <img src={CloseIcon} alt="Close Restaurant Page"
                             className="pull-right inline hidden-sm hidden-md hidden-lg"
                             onClick={this.handleClose}/>
                        <img src={DesktopClose} alt="Close Restaurant Page" className="pull-right inline hidden-xs"
                             onClick={this.handleClose}/>
                    </div>

                    <div
                        className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2 c-restaurant-page__item"
                        style={{padding: 0}}>

                        <div className="col-xs-12 col-sm-6" style={{padding: 0}}>
                            <div className="col-xs-12 c-restaurant-page__image"
                                 style={{backgroundImage: "url(" + Image + ")"}}>
                            </div>
                            <div className="hidden-xs col-sm-12 c-restaurant-page__info-item">
                                <img src={AddressIcon} alt="Restaurant kitchen"
                                     className="inline c-restaurant-page__address-icon"/>
                                <p className="passive-text small-text c-restaurant-page__address">{restaurant.acf.address.address}</p>
                            </div>
                            <div className="hidden-xs">

                                <div className="col-xs-12 c-restaurant-page__booking">
                                    {any && available.map((table, i) => (
                                        <button className="btn btn-transparent" key={i}
                                                onClick={() => this.handlePopup(restaurant, table)}>
                                            <p dangerouslySetInnerHTML={{__html: table.content.rendered}}/>
                                            <p style={{paddingLeft: 5}}>- {table.acf.timeframe}</p>
                                        </button>
                                    ))}
                                    <button className={isWaiting ? "btn btn-primary" : "btn btn-transparent"}
                                            onClick={isWaiting ? this.handleLeaveWaitingList : this.handleJoinWaitingList}>
                                        <p>{isWaiting ? "Leave waiting list" : "Join waiting list"}</p>
                                    </button>


                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12 col-sm-6"
                             style={{paddingLeft: 30, paddingRight: 30, marginBottom: 70}}>
                            <div className="hidden-xs col-sm-12 c-restaurant-page__title">
                                <h1>{restaurant.title.rendered}</h1>
                            </div>
                            <div dangerouslySetInnerHTML={{__html: restaurant.content.rendered}}
                                 className="col-xs-12 c-restaurant-page__description"/>

                            <div className="visible-xs">
                                {any && available.map((table, i) => (
                                    <div className="col-xs-12 c-restaurant-page__booking-mobile" key={i}>
                                        {i === 0 && <h4>
                                            Available tables
                                        </h4>}
                                        <div className="pull-left inline">
                                            <p className="passive-text small-text"
                                               dangerouslySetInnerHTML={{__html: table.content.rendered}}/>
                                            <p className="passive-text small-text">Latest arrival
                                                time: {table.acf.timeframe}</p>
                                        </div>
                                        <button className="btn btn-transparent inline pull-right"
                                                onClick={() => this.handlePopup(restaurant, table)}
                                                style={{marginTop: 7}}>
                                            <p>Book table</p>
                                        </button>
                                    </div>
                                ))}
                                <div className="col-xs-12 c-restaurant-page__waitlist">
                                    <p className="inline">Waiting List</p>
                                    <button
                                        className={isWaiting ? "btn btn-primary pull-right" : "btn btn-transparent pull-right"}
                                        onClick={isWaiting ? this.handleLeaveWaitingList : this.handleJoinWaitingList}
                                        style={{marginTop: -4}}>
                                        <p style={{margin: 0}}>{isWaiting ? "Leave list" : "Join list"}</p>
                                    </button>
                                </div>
                            </div>

                            <div className="col-xs-12 c-restaurant-page__info-item-wrapper">

                                <div className="col-xs-4 c-restaurant-page__info-item">
                                    <img src={isFavourite ? FavTrueIcon : FavFalseIcon} alt="Favourite"
                                         className="c-restaurant-page__info-icon" style={{cursor: "pointer"}}
                                         onClick={isFavourite ? this.handleRemoveFavourite : this.handleAddFavourite}
                                    />
                                    <p className="passive-text small-text">Favourite</p>
                                </div>

                                <div className="col-xs-4 c-restaurant-page__info-item">
                                    <img src={PriceIcon} alt="Restaurant kitchen"
                                         className="c-restaurant-page__info-icon"
                                         onClick={() => this.handlePriceBox(restaurant.acf.price_level)}
                                         style={{cursor: "pointer"}}/>
                                    <p className="passive-text small-text">{restaurant.acf.price_level}</p>

                                    {this.state.priceBox &&
                                    <PopupBox close={true}
                                              onClose={() => this.handlePriceBox(restaurant.acf.price_level)} text={
                                        <div>
                                            <div className="c-restaurant-page__price-info">
                                                <h4 className="inline">Price Level</h4>
                                                <p className="inline c-restaurant-page__price-level"
                                                   onClick={() => this.handlePriceLevel("Level 1")}
                                                   style={{
                                                       border: this.state.activePrice === "Level 1" && "1px solid"
                                                   }}>1</p>
                                                <p className="inline c-restaurant-page__price-level"
                                                   onClick={() => this.handlePriceLevel("Level 2")}
                                                   style={{
                                                       border: this.state.activePrice === "Level 2" && "1px solid"
                                                   }}>2</p>
                                                <p className="inline c-restaurant-page__price-level"
                                                   onClick={() => this.handlePriceLevel("Level 3")}
                                                   style={{
                                                       border: this.state.activePrice === "Level 3" && "1px solid"
                                                   }}>3</p>
                                                <p className="small-text">
                                                    {this.state.activePrice === "Level 1" && PriceLevelOne}
                                                    {this.state.activePrice === "Level 2" && PriceLevelTwo}
                                                    {this.state.activePrice === "Level 3" && PriceLevelThree}
                                                </p>
                                            </div>
                                        </div>}
                                    />
                                    }
                                </div>

                                <div className="col-xs-4 c-restaurant-page__info-item">
                                    <a href={restaurant.acf.website_link} target="blank">
                                        <img src={WebsiteIcon} alt="Restaurant kitchen"
                                             className="c-restaurant-page__info-icon"/>
                                    </a>
                                    <p className="passive-text small-text">Website</p>
                                </div>

                                <div className="col-xs-4 c-restaurant-page__info-item">
                                    {restaurant.acf.instagram ? (
                                        <a href={restaurant.acf.instagram ? restaurant.acf.instagram : "#"}
                                           target="blank">
                                            <img src={InstaIcon} alt="Restaurant instagram"
                                                 className="c-restaurant-page__info-icon"/>
                                        </a>
                                    ) : (
                                        <img src={NoInstaIcon} alt="Restaurant no instagram"
                                             className="c-restaurant-page__info-icon"/>
                                    )}
                                    <p className="passive-text small-text">Instagram</p>
                                </div>


                                <div className="col-xs-4 c-restaurant-page__info-item">
                                    <img src={ReviewIcon} alt="Restaurant kitchen"
                                         className="c-restaurant-page__info-icon"/>
                                    <p className="passive-text small-text">Reviews</p>
                                </div>


                                <div className="col-xs-4 c-restaurant-page__info-item">
                                    <a href={PhoneLink + restaurant.acf.phone}>
                                        <img src={PhoneIcon} alt="Restaurant kitchen"
                                             className="c-restaurant-page__info-icon"/>
                                    </a>
                                    <p className="passive-text small-text">{restaurant.acf.phone}</p>
                                </div>


                                <div className="col-xs-12 visible-xs c-restaurant-page__info-item">
                                    <img src={AddressIcon} alt="Restaurant kitchen"
                                         className="inline c-restaurant-page__address-icon"/>
                                    <p className="passive-text xs-text c-restaurant-page__address">{restaurant.acf.address.address}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                }

                {this.state.popup &&
                <PopupBox text="Do you want to book this table?"
                          extra={this.state.bookingData.acf.available_active && "You will have the table for " + Math.floor(this.state.bookingData.acf.available_for / 60) + " hours and " +
                          this.state.bookingData.acf.available_for % 60 + " minutes "}
                          btnLeft="Book" btnRight="Cancel" onLeftClick={this.handleBooking}
                          onRightClick={this.handlePopup}/>
                }

                {this.state.viewBooking &&
                <Reservation data={this.state.bookingData} table={this.state.bookingTable}/>
                }

            </div>
        )
    }
}

export default withRouter(connect((state) => ({
    restaurantData: Object.values(state.restaurantDatas),
    tables: Object.values(state.restaurantTables),
    user: Object.values(state.users),
}), {
    onRequestUserData: MyActions.requestUserData,
    onUpdateUserData: MyActions.updateUserAcfData,
    onRequestRestaurantData: MyActions.fetchRestaurantData,
    onRequestRestaurantTables: MyActions.fetchRestaurantTables,
})(RestaurantPage));