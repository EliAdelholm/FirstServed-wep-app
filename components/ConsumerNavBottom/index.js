import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactSVG from 'react-svg';

import ConsumerNavTop from '../../components/ConsumerNavTop';

import logo from '../../assets/images/logo.svg';
import RestaurantsIcon from '../../assets/icons/nav-restaurants.png'
import RestaurantsActiveIcon from '../../assets/icons/nav-restaurants-active.png'
import FavIcon from '../../assets/icons/nav-favs.png'
import FavActiveIcon from '../../assets/icons/nav-favs-active.png'
import BookingsIcon from '../../assets/icons/nav-booking.png'
import BookingsActiveIcon from '../../assets/icons/nav-booking-active.png'
import AccountIcon from '../../assets/icons/nav-account.png'
import AccountActiveIcon from '../../assets/icons/nav-account-active.png'
import SignOutIcon from '../../assets/icons/sign-out.png'

import DesktopRestaurant from '../../assets/icons/desktop-menu-restaurant.png';
import DesktopFavourite from '../../assets/icons/desktop-menu-favourite.png';
import DesktopBooking from '../../assets/icons/desktop-menu-booking.png';
import DesktopAccount from '../../assets/icons/desktop-menu-account.png';


import './nav-bottom.css';

class Navigation extends Component {

    handleSignout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessSecret");

        location.href = "/"
    };

    render() {
        const {active, position} = this.props;

        return (
            <div className="row o-nav-bottom">

                {/* Logo for tablet and Desktop */}
                <div className="hidden-xs o-nav-desktop__logo-container col-sm-2 col-md-3">
                    <Link to="/restaurants">
                        <ReactSVG
                            path={logo}
                            className="o-nav-desktop__logo pull-left inline"
                        />
                    </Link>
                </div>


                {/* Mobile and tablet implementation */}
                <div className="col-xs-3 visible-xs o-nav-bottom__menu-item">
                    <Link to="/restaurants">
                        <img src={active === "restaurants" ? RestaurantsActiveIcon : RestaurantsIcon}
                             alt="All Restaurants" className="o-nav-bottom__menu-icon"/>
                        <p className="xs-text">Restaurants</p>
                    </Link>
                </div>
                <div className="col-xs-3 visible-xs o-nav-bottom__menu-item">
                    <Link to="/favourites">
                        <img src={active === "favourites" ? FavActiveIcon : FavIcon} alt="Favourite Restaurants"
                             className="o-nav-bottom__menu-icon"/>
                        <p className="xs-text">Favourites</p>
                    </Link>
                </div>
                <div className="col-xs-3 visible-xs o-nav-bottom__menu-item">
                    <Link to="bookings">
                        <img src={active === "bookings" ? BookingsActiveIcon : BookingsIcon} alt="All Restaurants"
                             className="o-nav-bottom__menu-icon"/>
                        <p className="xs-text">Bookings</p>
                    </Link>
                </div>
                <div className="col-xs-3 visible-xs o-nav-bottom__menu-item">
                    <Link to="/account">
                        <img src={active === "account" ? AccountActiveIcon : AccountIcon} alt="All Restaurants"
                             className="o-nav-bottom__menu-icon"/>
                        <p className="xs-text">Account</p>
                    </Link>
                </div>

                {/* Desktop implementation */}
                <div className="hidden-xs o-desktop-nav">
                    {active === "restaurants" && this.props.currentPage !== "restaurantPage" &&
                    <ConsumerNavTop currentPage="restaurants" mapView={this.props.mapView}
                                    desktop={true}
                                    activeFilter={this.props.activeFilter}
                                    availableFilter={this.props.availableFilter}
                                    kitchenFilter={this.props.kitchenFilter}
                                    priceFilter={this.props.priceFilter}
                                    onHandleMapView={this.props.onHandleMapView}
                                    onChangeFilter={this.props.onChangeFilter}
                                    onFilterAvailable={this.props.onFilterAvailable}
                                    onFilterKitchen={this.props.onFilterKitchen}
                                    onFilterPrice={this.props.onFilterPrice}
                                    position={position}/>
                    }

                    {active === "account" &&
                    <div className="o-desktop-nav__filter-map inline">
                        <div className="inline" onClick={this.handleSignout}>
                            <img src={SignOutIcon}
                                 alt="Sign Out" className="o-nav-bottom__menu-icon inline"/>
                            <p className="medium-text inline">Sign Out</p>
                        </div>
                    </div>
                    }

                    <Link to="/restaurants">
                        <img src={DesktopRestaurant}
                             alt="All Restaurants" className="o-nav-bottom__menu-icon inline"/>
                        <p className="medium-text inline" style={{
                            borderBottom: active === "restaurants" && "1px solid"
                        }}>Restaurants</p>
                    </Link>

                    <Link to="/favourites">
                        <img src={DesktopFavourite} alt="Favourite Restaurants"
                             className="o-nav-bottom__menu-icon inline"/>
                        <p className="medium-text inline" style={{
                            borderBottom: active === "favourites" && "1px solid"
                        }}>Favourites</p>
                    </Link>

                    <Link to="bookings">
                        <img src={DesktopBooking} alt="All Restaurants"
                             className="o-nav-bottom__menu-icon inline"/>
                        <p className="medium-text inline" style={{
                            borderBottom: active === "bookings" && "1px solid"
                        }}>Bookings</p>
                    </Link>

                    <Link to="/account">
                        <img src={DesktopAccount} alt="All Restaurants"
                             className="o-nav-bottom__menu-icon inline"/>
                        <p className="medium-text inline" style={{
                            borderBottom: active === "account" && "1px solid"
                        }}>Account</p>
                    </Link>
                </div>


            </div>
        )
    }
}

export default Navigation;