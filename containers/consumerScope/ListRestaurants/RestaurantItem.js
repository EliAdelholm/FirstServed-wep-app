import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import moment from 'moment';

import ActionButton from '../../../components/ActionButton';

import * as MyActions from '../../../actions/MyActionCreator';

import DefaultImage from '../../../assets/images/default-image.png';
import FavFalseIcon from '../../../assets/icons/favourite-false.png';
import FavTrueIcon from '../../../assets/icons/favourite-true.png';
import AddressIcon from '../../../assets/images/address.png';

import './desktop.css';

class RestaurantItem extends Component {
    state = {isLoading: false};

    /*async componentDidMount() {
     const {onRequestRestaurantTables, restaurant} = this.props;
     this.setState({isLoading: true});

     try {
     await onRequestRestaurantTables(restaurant.id);

     this.setState({isLoading: false});


     } catch (err) {
     console.error(err);
     this.setState({isLoading: false})
     }

     };*/

    isEven = (value) => {
        if (value % 2 === 0) {
            return true;
        }
    };

    isSideRow = (value) => {
        if (value % 3 === 0 || (value - 2) % 3 === 0) {
            return true;
        }
    };

    handleAction = (actionType, available) => {
        const {user, restaurant} = this.props;

        if (actionType === "Book") {
            console.log("book table")

            this.props.onPopup(restaurant, available)
        }

        if (actionType === "isWaiting") {
            console.log("leave waiting list");

            this.props.leaveWaitingList(user, restaurant);
        }

        if (actionType === "Waiting") {
            console.log("join waiting list");
            this.props.joinWaitingList(user, restaurant);
        }

        if (actionType === "Website") {
            console.log("visit Website");
            window.open(restaurant.acf.website_link, '_blank');
        }

        if (actionType === "addFav") {
            console.log("Add favourite");

            this.props.addFavourite(user, restaurant);
        }

        if (actionType === "removeFav") {
            console.log("remove favourite");
            this.props.removeFavourite(user, restaurant);
        }
    };

    render() {
        const {restaurant, index, tables, favourites, isWaitingFor} = this.props;
        const Image = restaurant.better_featured_image ? restaurant.better_featured_image.source_url : DefaultImage;

        const isFavourite = favourites.includes(restaurant.id);
        const isWaiting = isWaitingFor.includes(restaurant.id);

        let fullyBooked = restaurant.acf.fully_booked;
        let available = tables.filter(function (table) {
            if (table.parent === 0 && !table._links.children && table.acf.timeframe) {
                if (table.acf.timeframe > moment().format('HH:mm')) {
                    return table.post === restaurant.id;
                }
            } else {
                return null;
            }
        });

        return (
            <div>
                {/**/}
                <div className="col-xs-12 visible-xs c-restaurant-item" style={{padding: 0}}>
                    <Link to={restaurant.slug}>
                        <div className="col-xs-12 c-restaurant-item__header">
                            <h4 className="text-center">{restaurant.title.rendered}</h4>
                        </div>
                        <div className="col-xs-12 c-restaurant-item__image"
                             style={{backgroundImage: "url(" + Image + ")", paddingBottom: "60%"}}>
                        </div>
                    </Link>
                    <div className="col-xs-2" style={{padding: 0}}>
                        <img src={isFavourite ? FavTrueIcon : FavFalseIcon} alt="Add to favourites"
                             className="c-restaurant-mobile__fav-icon"
                             onClick={() => this.handleAction(isFavourite ? "removeFav" : "addFav")}/>
                    </div>
                    <div className="col-xs-10" style={{paddingLeft: 0, paddingRight: 10}}>
                        <div className="col-xs-12 c-restaurant-item__description">
                            <p className="medium-text passive-text">{restaurant.acf.short_description}</p>
                        </div>
                        <div className="col-xs-12 c-restaurant-desktop__address"
                             style={{textAlign: "left", paddingLeft: 0}}>
                            <p className="xs-text passive-text inline c-restaurant-desktop__address-text">
                                <img src={AddressIcon} alt="Restaurant Address"
                                     className="inline c-restaurant-desktop__address-icon"/>
                                {restaurant.acf.address.address}
                            </p>
                        </div>
                    </div>

                </div>
                <div
                    className="hidden-xs col-sm-12 col-md-10 col-md-offset-1 c-restaurant-item c-restaurant-desktop__item">
                    {this.isEven(index) &&
                    <div className="hidden-lg">
                        <img src={isFavourite ? FavTrueIcon : FavFalseIcon} alt="Add to favourites"
                             className="inline pull-right c-restaurant-desktop__fav-icon"
                             onClick={() => this.handleAction(isFavourite ? "removeFav" : "addFav")}/>
                        <Link to={restaurant.slug}>
                            <div className="col-sm-10 col-sm-offset-1 hidden-lg c-restaurant-item__image"
                                 style={{backgroundImage: "url(" + Image + ")", paddingBottom: "50%"}}>
                            </div>
                        </Link>
                        <div className="c-restaurant-desktop__address">
                            <p className="xs-text passive-text inline c-restaurant-desktop__address-text">
                                <img src={AddressIcon} alt="Restaurant Address"
                                     className="inline c-restaurant-desktop__address-icon"/>
                                {restaurant.acf.address.address}
                            </p>
                        </div>
                    </div>
                    }

                    {this.isSideRow(index) &&
                    <div className="visible-lg">
                        <img src={isFavourite ? FavTrueIcon : FavFalseIcon} alt="Add to favourites"
                             className="inline pull-right c-restaurant-desktop__fav-icon"
                             onClick={() => this.handleAction(isFavourite ? "removeFav" : "addFav")}/>
                        <Link to={restaurant.slug}>
                            <div className="col-lg-10 col-lg-offset-1 c-restaurant-item__image"
                                 style={{backgroundImage: "url(" + Image + ")", paddingBottom: "50%"}}>
                            </div>
                        </Link>
                        <div className="c-restaurant-desktop__address">
                            <p className="xs-text passive-text inline c-restaurant-desktop__address-text">
                                <img src={AddressIcon} alt="Restaurant Address"
                                     className="inline c-restaurant-desktop__address-icon"/>
                                {restaurant.acf.address.address}
                            </p>

                        </div>
                    </div>
                    }

                    <Link to={restaurant.slug}>
                        <div className="col-sm-12 c-restaurant-item__header">
                            <h1 className="col-sm-12 text-center">{restaurant.title.rendered}</h1>
                        </div>
                    </Link>
                    <div className="col-sm-8 col-sm-offset-2"
                         style={{borderBottom: "1px solid", marginBottom: 15}}/>
                    <div
                        className="col-xs-12 c-restaurant-item__description c-restaurant-desktop__description text-center medium-text"
                        dangerouslySetInnerHTML={{__html: restaurant.content.rendered}}/>


                    {!this.isEven(index) &&
                    <div className="hidden-lg">
                        <img src={isFavourite ? FavTrueIcon : FavFalseIcon} alt="Add to favourites"
                             className="inline pull-right c-restaurant-desktop__fav-icon" style={{bottom: "23%"}}
                             onClick={() => this.handleAction(isFavourite ? "removeFav" : "addFav")}/>
                        <Link to={restaurant.slug}>
                            <div className="col-sm-10 col-sm-offset-1 hidden-lg c-restaurant-item__image"
                                 style={{backgroundImage: "url(" + Image + ")", paddingBottom: "50%"}}>
                            </div>
                        </Link>
                        <div className="c-restaurant-desktop__address">

                            <p className="xs-text passive-text inline c-restaurant-desktop__address-text">
                                <img src={AddressIcon} alt="Restaurant Address"
                                     className="inline c-restaurant-desktop__address-icon"/>
                                {restaurant.acf.address.address}
                            </p>
                        </div>
                    </div>
                    }

                    {!this.isSideRow(index) &&
                    <div className="visible-lg">
                        <img src={isFavourite ? FavTrueIcon : FavFalseIcon} alt="Add to favourites"
                             className="inline pull-right c-restaurant-desktop__fav-icon" style={{bottom: "23%"}}
                             onClick={() => this.handleAction(isFavourite ? "removeFav" : "addFav")}/>
                        <Link to={restaurant.slug}>
                            <div className="visible-lg col-lg-10 col-lg-offset-1 c-restaurant-item__image"
                                 style={{backgroundImage: "url(" + Image + ")", paddingBottom: "50%"}}>
                            </div>
                        </Link>
                        <div className="c-restaurant-desktop__address">
                            <p className="xs-text passive-text inline c-restaurant-desktop__address-text">
                                <img src={AddressIcon} alt="Restaurant Address"
                                     className="inline c-restaurant-desktop__address-icon"/>
                                {restaurant.acf.address.address}
                            </p>
                        </div>
                    </div>
                    }

                </div>
                {this.props.activeFilter === "Available" && this.props.availableFilter === "Right Now" ? (
                    <div className="col-xs-12 c-restaurant-desktop__button">
                        {available.map((table, i) => (
                            <ActionButton key={i} primary={false}
                                          onClick={this.handleAction}
                                          actionType="Book"
                                          available={table}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="col-xs-12 c-restaurant-desktop__button">
                        <ActionButton primary={false}
                                      disabled={fullyBooked && true}
                                      onClick={this.handleAction}
                                      actionType="Website"
                                      available={null}
                        />
                        <ActionButton primary={isWaiting && true}
                                      onClick={this.handleAction}
                                      actionType={isWaiting ? "isWaiting" : "Waiting"}
                                      available={ null}
                        />
                    </div>
                )}
            </div>
        )
    }
}

export default connect((state) => ({
    tables: Object.values(state.restaurantTables),
}), {
    onRequestRestaurantTables: MyActions.fetchRestaurantTables,
})(RestaurantItem);