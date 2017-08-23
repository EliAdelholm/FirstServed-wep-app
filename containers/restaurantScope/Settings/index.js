// Import dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PlacesAutocomplete, {geocodeByAddress} from 'react-places-autocomplete';

// Import actions
import * as MyActions from '../../../actions/MyActionCreator';

// Import components
import RestaurantNav from '../../../components/RestaurantNav';
import ToggleButton from '../../../components/ToggleButton';
import ContentEditable from '../../../components/ContentEditable';

// Import assets
import kithenTypes from '../../../assets/json/kitchenTypeList.json';
import signoutIcon from '../../../assets/icons/sign-out.png';
import accountIcon from '../../../assets/icons/settings-account.png';
import waitingListIcon from '../../../assets/icons/settings-table.png';
import timeframeIcon from '../../../assets/icons/settings-time.png';
import addressIcon from '../../../assets/icons/settings-address.png';
import mailIcon from '../../../assets/icons/settings-mail.png';
import phoneIcon from '../../../assets/icons/settings-phone.png';
import websiteIcon from '../../../assets/icons/settings-website.png';
import instaIcon from '../../../assets/icons/settings-insta.png';
import kitchenIcon from '../../../assets/icons/settings-kitchen.png';
import shortTextIcon from '../../../assets/icons/settings-short-text.png';
import longTextIcon from '../../../assets/icons/settings-long-text.png';
import photoIcon from '../../../assets/icons/settings-photo.png';

// Import CSS
import '../restaurant.css';

let notificationID;

window.onerror = function(error) {
    alert(error);
};

class RestaurantSettings extends Component {
    state = {
        isLoading: true,
        isSaved: false,
        shortDescription: null,
        longDescription: null,
        fullyBooked: null,
        title: null,
        mail: null,
        phone: null,
        website: null,
        instagram: null,
        notifications: null,
        notificationID: null,
        timeFrame: null,
        timeFrameH: null,
        timeFrameMin: null,
        availableActive: null,
        availableFor: null,
        availableForH: null,
        availableForMin: null,
        kitchen: null,
        address: null,
        lat: null,
        lng: null,
    };

    async componentDidMount() {
        const {onRequestRestaurantData, onRequestUserData} = this.props;
        const [ user ] = this.props.user;

        if (!user) {
            await onRequestUserData();
        }

        try {
            const [ user ] = this.props.user;
            await onRequestRestaurantData(user.slug);

        } catch (err) {
            console.error(err);
        }

        const [ restaurant ] = this.props.restaurantData;
        this.setState({
            isLoading: false,
            title: restaurant.title.rendered,
            timeFrame: restaurant.acf.time_frame,
            timeFrameH: Math.floor(restaurant.acf.time_frame / 60),
            timeFrameMin: restaurant.acf.time_frame % 60,
            mail: restaurant.acf.mail,
            phone: restaurant.acf.phone,
            website: restaurant.acf.website_link,
            instagram: restaurant.acf.instagram,
            kitchen: restaurant.acf.kitchen_type,
            longDescription: restaurant.content.rendered,
            shortDescription: restaurant.acf.short_description,
            fullyBooked: restaurant.acf.fully_booked,
            address: restaurant.acf.address.address,
            availableActive: restaurant.acf.available_active,
            availableFor: restaurant.acf.available_for,
            availableForH: Math.floor(restaurant.acf.available_for / 60),
            availableForMin: restaurant.acf.available_for % 60,
            notifications: restaurant.acf.notifications,
            notificationID: restaurant.acf.notification_id,

        });
    };

    handleAddressChange = (address) => {
        this.setState({ address: address })
        console.log(this.state.address)
    };


    handleSignout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessSecret");

        location.href = "/"
    };

    handleFullyBooked = () => {
        this.setState({fullyBooked: !this.state.fullyBooked});
    };

    handleNotifications = async() => {
        if(Notification.permission === "granted") {
            this.setState({notifications: !this.state.notifications});
        }
        if(Notification.permission !== "granted") {
            await this.subscribeToNotifications();
            this.setState({notifications: true});
        }
    };

    subscribeToNotifications = async() => {
        const {onUpdateRestaurantAcfData} = this.props;
        var OneSignal = window.OneSignal || [];

        await OneSignal.push(function() {
            OneSignal.registerForPushNotifications();
        });

        await OneSignal.push(function() {
            // Occurs when the user's subscription changes to a new value.
            OneSignal.on('subscriptionChange', function (isSubscribed) {
                OneSignal.getUserId(function(userId) {
                    console.log("OneSignal User ID:", userId);
                    // (Output) OneSignal User ID: 270a35cd-4dda-4b3f-b04e-41d7463a2316
                    onUpdateRestaurantAcfData({
                        "fields": {
                            "notification_id": userId,
                            "notifications": true,
                            }
                    })
                });
                console.log("The user's subscription state is now:", isSubscribed);
            });
        });

    };

    handleAvailableActive = () => {
        this.setState({availableActive: !this.state.availableActive});
    };

    handleTimeFrameH = (evt) => {
        this.setState({timeFrameH: evt.target.value});

        this.handleTimeFrame(evt.target.value, this.state.timeFrameMin);
    };

    handleTimeFrameMin = (evt) => {
        this.setState({timeFrameMin: evt.target.value});

        this.handleTimeFrame(this.state.timeFrameH, evt.target.value);
    };

    handleTimeFrame = (hours, minutes) => {
        let calculation = parseFloat(hours * 60) + parseFloat(minutes);
        this.setState({timeFrame: calculation });
    };

    handleAvailableForH = (evt) => {
        this.setState({availableForH: evt.target.value});

        this.handleAvailableTime(evt.target.value, this.state.availableForMin);
    };

    handleAvailableForMin = (evt) => {
        this.setState({availableForMin: evt.target.value});

        this.handleAvailableTime(this.state.availableForH, evt.target.value);
    };

    handleAvailableTime = (hours, minutes) => {
        let calculation = parseFloat(hours * 60) + parseFloat(minutes);
        this.setState({availableFor: calculation });
    };

    handleMail = (evt) => {
        this.setState({mail: evt.target.value});
    };

    handlePhone = (evt) => {
        this.setState({phone: evt.target.value});
    };

    handleWebsite = (evt) => {
        this.setState({website: evt.target.value});
    };

    handleInstagram = (evt) => {
        this.setState({instagram: evt.target.value});
    };

    handleKitchen = (evt) => {
        this.setState({kitchen: evt.target.value});
    };

    handleShortText = (evt) => {
        this.setState({shortDescription: evt.target.value});
    };

    handleLongText = (evt) => {
        this.setState({longDescription: evt.target.value});
    };

    handleSaveChanges = async(e) => {
        e.preventDefault();
        this.setState({isLoading: true});
        const {onUpdateRestaurantData, onUpdateRestaurantAcfData} = this.props;
        const [ restaurant ] = this.props.restaurantData;

        const data = {
            content: this.state.longDescription,
        };

        try {
            onUpdateRestaurantData(restaurant.id, data);

            if (this.state.address !== '') {
                geocodeByAddress(this.state.address, async(err, {lat, lng,}) => {
                    if (err) {
                        console.log('Oh no!', err)
                    }

                    console.log(this.state.notificationID);

                    await onUpdateRestaurantAcfData(restaurant.id, {
                        "fields": {
                            "fully_booked": this.state.fullyBooked,
                            "notifications": this.state.notifications,
                            "notification_id": notificationID ? notificationID : this.state.notificationID,
                            "time_frame": this.state.timeFrame,
                            "available_active": this.state.availableActive,
                            "available_for": this.state.availableFor,
                            "mail": this.state.mail,
                            "phone": this.state.phone,
                            "kitchen_type": this.state.kitchen,
                            "short_description": this.state.shortDescription,
                            "address": {
                                "address": this.state.address,
                                "lat": lat,
                                "lng": lng
                            }
                        }
                    })
                })
            }

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false})
        }
        this.setState({isLoading: false, isSaved: true})
    };

    render() {
        const [ restaurant ] = this.props.restaurantData;

        // inputProps for Google Places Autocomplete
        const inputProps = {
            value: this.state.address,
            onChange: this.handleAddressChange,
        };

        // Styles for Google Places Autocomplete
        const myStyles = {
            root: { zIndex: 100, display: "inline-block", width: "90%" },
            input: { width: '100%', paddingLeft: 4, paddingBottom: 2, zIndex: 100, outline: "none" },
            autocompleteContainer: { marginLeft: "5%",  },
            autocompleteItem: { backgroundColor: "#112533", color: "#dbdbdb"},
            autocompleteItemActive: { backgroundColor: "#998670", color: 'black' }
        };

        return (
            <div className="row c-settings">
                <RestaurantNav pageTitle="Settings" icon="back"/>

                {/*Sign Out Button Mobile*/}
                <div className="col-xs-12 visible-xs c-settings__sign-out">
                    <img src={signoutIcon} alt="Sign Out" onClick={this.handleSignout}/>
                    <p className="medium-text active-text inline" onClick={this.handleSignout}>Sign out</p>
                </div>

                {!this.state.isLoading &&
                <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                    <form className="c-settings__form" onSubmit={this.handleSaveChanges}>

                        {/*Form Header*/}
                        <div className="c-settings__form-header">
                            <img src={accountIcon} alt="edit account"/>
                            <h1 className="passive-text">{this.state.title}</h1>
                        </div>

                        {/*Fully Booked Toggle*/}
                        <div className="col-xs-12" style={{padding: 0, marginTop: 40}}>
                            <img src={waitingListIcon} alt="Toggle Waiting list" className="inline c-settings__icon"
                                 style={{verticalAlign: "top", marginTop: 7}}/>
                            <div className="c-settings__waiting-list inline">
                                <p className="passive-text pull-left">Fully Booked</p>
                                <div className="pull-right">
                                    <ToggleButton
                                    isChecked={this.state.fullyBooked}
                                    onChange={this.handleFullyBooked}/>
                                </div>
                            </div>
                        </div>

                         {/*Notifications Toggle*/}
                        <div className="col-xs-12" style={{padding: 0, marginTop: 15}}>
                            <img src={waitingListIcon} alt="Toggle Notifications" className="inline c-settings__icon"
                                 style={{verticalAlign: "top", marginTop: 7}}/>
                            <div className="c-settings__waiting-list inline">
                                <p className="passive-text pull-left">Notifications</p>
                                <div className="pull-right">
                                    {("Notification" in window) && Notification.permission !== "denied" &&
                                    <ToggleButton
                                        isChecked={Notification.permission === "granted" && this.state.notifications}
                                        onChange={this.handleNotifications}/>}
                                </div>
                                {("Notification" in window) && Notification.permission === "denied" &&
                                <p className="c-settings__notifications-denied">You have denied notifications. Click the i in the address bar to change this</p>
                                }
                                {!("Notification" in window) && <p className="c-settings__notifications-denied">Your browser does not support this function</p>}
                            </div>
                        </div>

                        {/* Timeframe Input */}
                        <div className="form-group col-xs-12">
                            <img src={timeframeIcon} alt="Restaurant Time Frame" className="inline c-settings__icon"/>
                            <div className="c-settings__time-frame-input">
                                <p className="passive-text inline">Time frame</p>
                                <input type="number" className="form-control" max="12" min="0" value={this.state.timeFrameH} onChange={this.handleTimeFrameH}/>
                                <p className="passive-text inline" style={{marginLeft: -7}}>h</p>
                                <input type="number" className="form-control" max="59" min="0" value={this.state.timeFrameMin} onChange={this.handleTimeFrameMin}/>
                                <p className="passive-text inline" style={{marginLeft: -7}}>min</p>
                            </div>
                        </div>

                        {/*Available for Toggle and Input*/}
                        <div className="form-group col-xs-12">
                            <img src={timeframeIcon} alt="Restaurant Time Frame" className="inline c-settings__icon"/>
                            <div className="c-settings__time-frame-input">
                                <p className="passive-text inline">Available for</p>
                                <input type="number" className="form-control" max="12" min="0" value={this.state.availableForH} onChange={this.handleAvailableForH}/>
                                <p className="passive-text inline" style={{marginLeft: -7}}>h</p>
                                <input type="number" className="form-control" max="59" min="0" value={this.state.availableForMin} onChange={this.handleAvailableForMin}/>
                                <p className="passive-text inline" style={{marginLeft: -7}}>min</p>
                                <div className="pull-right" style={{marginTop: 10}}>
                                    <ToggleButton
                                        isChecked={this.state.availableActive}
                                        onChange={this.handleAvailableActive}/>
                                </div>
                            </div>
                        </div>

                        {/*Address Input with Autocomplete*/}
                        <div className="form-group col-xs-12">
                            <img src={addressIcon} alt="Restaurant Address" className="inline c-settings__icon"/>
                            <PlacesAutocomplete inputProps={inputProps} styles={myStyles}/>
                        </div>

                        {/*Email Input*/}
                        <div className="form-group col-xs-12">
                            <img src={mailIcon} alt="Restaurant Mail" className="inline c-settings__icon"/>
                            <input type="email" className="form-control" placeholder="Mail"
                                   value={this.state.mail} onChange={this.handleMail}/>
                        </div>

                        {/*Phone Input*/}
                        <div className="form-group col-xs-12">
                            <img src={phoneIcon} alt="Restaurant Phone" className="inline c-settings__icon"/>
                            <input type="telephone" className="form-control" placeholder="Phone"
                                   value={this.state.phone} onChange={this.handlePhone}/>
                        </div>

                        {/*Website Input*/}
                        <div className="form-group col-xs-12">
                            <img src={websiteIcon} alt="Restaurant Website" className="inline c-settings__icon"/>
                            <input type="url" className="form-control" placeholder="Website"
                                   value={this.state.website} onChange={this.handleWebsite}/>
                        </div>

                        {/*Instagram Input*/}
                        <div className="form-group col-xs-12">
                            <img src={instaIcon} alt="Restaurant Instagram" className="inline c-settings__icon"/>
                            <input type="url" className="form-control" placeholder="Link to Instagram"
                                   value={this.state.instagram} onChange={this.handleInstagram}/>
                        </div>

                        {/*Kitchen Select Box with options from JSON file*/}
                        <div className="form-group col-xs-12">
                            <img src={kitchenIcon} alt="Restaurant Kitchen" className="inline c-settings__icon"/>
                            <select className="form-control" value={this.state.kitchen} onChange={this.handleKitchen}>
                                {kithenTypes.map((kitchen, i) => {
                                    return (
                                        <option key={i} value={kitchen} style={{backgroundColor: "#112533"}}>{kitchen}</option>
                                    )})}
                            </select>
                        </div>

                        {/*Short Description Content*/}
                        <div className="form-group col-xs-12">
                            <img src={shortTextIcon} alt="Restaurant Short Description"
                                 className="inline c-settings__icon c-settings__text-icon"/>
                            <ContentEditable className="o-content-editable c-settings__short-text notes"
                                             html={this.state.shortDescription ? this.state.shortDescription : "Short Description" }
                                             disabled={false}
                                             onChange={this.handleShortText}
                            />
                        </div>

                        {/*Long Description Content*/}
                        <div className="form-group col-xs-12">
                            <img src={longTextIcon} alt="Restaurant Long Description"
                                 className="inline c-settings__icon c-settings__text-icon"/>
                            <ContentEditable className="o-content-editable c-settings__long-text notes"
                                             html={this.state.longDescription ? this.state.longDescription : "Long Description" }
                                             disabled={false}
                                             onChange={this.handleLongText}
                            />
                        </div>

                        {/* Featured Image Display - Edit not currently possible */}
                        <div className="form-group col-xs-12">
                            <img src={photoIcon} alt="Featured"
                                 className="inline c-settings__icon c-settings__text-icon"/>
                            <div className="c-settings__image-div">
                                <img src={restaurant.better_featured_image.source_url} alt="Featured"
                                     className="c-settings__featured-image inline"/>
                            </div>
                        </div>

                        {/* Save and Submit Button */}
                        <div className="col-xs-12 c-settings__save-changes">
                            <button type="submit" className="btn btn-primary c-settings__save-btn">Save changes</button>

                            {/* Saved Successfully Message */}
                            {this.state.isSaved &&
                            <p>Your changes have been saved!</p>
                            }
                        </div>

                    </form>
                </div>
                }

            </div>
        )
    }
}

export default connect((state) => ({
    restaurantData: Object.values(state.restaurantDatas),
    user: Object.values(state.users),
}), {
    onRequestUserData: MyActions.requestUserData,
    onRequestRestaurantData: MyActions.fetchRestaurantData,
    onUpdateRestaurantData: MyActions.updateRestaurantData,
    onUpdateRestaurantAcfData: MyActions.updateRestaurantAcfData,
})(RestaurantSettings);