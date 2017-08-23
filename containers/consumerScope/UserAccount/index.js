//Import Dependencies
import React, {Component} from 'react';
import {connect} from 'react-redux';

//Import Actions
import * as MyActions from '../../../actions/MyActionCreator';

//Import Components
import ConsumerNavTop from '../../../components/ConsumerNavTop';
import ConsumerNavBottom from '../../../components/ConsumerNavBottom';
import ToggleButton from '../../../components/ToggleButton';

//Import Assets
import signoutIcon from '../../../assets/icons/user-signout.png';
import accountIcon from '../../../assets/icons/user-account.png';
import notificationIcon from '../../../assets/icons/user-notifications.png';
import tableIcon from '../../../assets/icons/user-table.png';
import phoneIcon from '../../../assets/icons/user-phone.png';

//Import CSS
import './account.css';

class UserAccount extends Component {
    state = {isLoading: true, isSaved: false, phone: "", notifications: false, people: ""};

    async componentDidMount() {
        const {onRequestUserData} = this.props;

        try {
            await onRequestUserData();

            const [ user ] = this.props.user;
            this.setState({
                isLoading: false,
                phone: user.acf.phone,
                notifications: user.acf.notifications,
                people: user.acf.table_for
            });

        } catch (err) {
            console.error(err);
        }
    };

    handleSignout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessSecret");

        location.href = "/"
    };

    handleNotifications = () => {
        this.setState({notifications: !this.state.notifications});
        console.log(this.state.notifications);
    };

    handlePeople = (evt) => {
        this.setState({people: evt.target.value});
        console.log(this.state.people);
    };

    handlePhone = (evt) => {
        this.setState({phone: evt.target.value});
        console.log(this.state.phone);
    };

    handleSaveChanges = async(e) => {
        e.preventDefault();
        const {onUpdateUserData} = this.props;
        const [user] = this.props.user;

        await onUpdateUserData(user.id, {
            "fields": {
                "table_for": this.state.people,
                "notifications": this.state.notifications,
                "phone": this.state.phone,
            }
        });

        this.setState({isSaved: true});
    };

    render() {
        const [ user ] = this.props.user;

        return (

            <div className="row c-account">

                {/*Mobile Nav Top*/}
                <ConsumerNavTop currentPage="Account"/>

                {/*Mobile Sign Out Button*/}
                <div className="c-account__sign-out visible-xs" onClick={this.handleSignout}>
                    <p className="medium-text inline" >Sign out</p>
                    <img src={signoutIcon} alt="Sign Out" />
                </div>
                <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">

                    {/*Account Settings Form*/}
                    {!this.state.isLoading &&
                    <form className="c-account__form" onSubmit={this.handleSaveChanges}>

                        {/*Form Header*/}
                        <div className="c-account__form-header">
                            <img src={accountIcon} alt="edit account"/>
                            <h1 className="passive-text">{user && user.name}</h1>
                        </div>

                        {/*Notifications Toggle*/}
                        <div className="col-xs-12" style={{padding: 0, marginTop: 40, marginBottom: 15}}>
                            <img src={notificationIcon} alt="Toggle Notifications" className="inline c-account__icon"
                                 style={{marginTop: -30}}/>
                            <div className="c-account__notifications inline">
                                <p className="passive-text pull-left">Notifications</p>
                                <div className="pull-right c-restaurant-page__waitlist-toggle">
                                    <ToggleButton
                                        isChecked={this.state.notifications}
                                        onChange={this.handleNotifications}/>
                                </div>
                            </div>
                        </div>

                        {/*Table For X People*/}
                        <div className="col-xs-12" style={{padding: 0}}>
                            <img src={tableIcon} alt="Table for" className="inline c-account__icon"
                                 style={{}}/>
                            <div className="inline c-account__table-for">
                                <div className="c-account__table-for-input">
                                    <p className="passive-text inline">Table for</p>
                                    <input type="text" className="form-control " value={this.state.people}
                                           onChange={this.handlePeople}/>
                                    <p className="passive-text inline">people</p>
                                </div>
                            </div>
                        </div>

                        {/*Phone Number Input*/}
                        <div className="form-group col-xs-12">
                            <img src={phoneIcon} alt="Account Phone" className="inline c-account__icon"/>
                            <input type="telephone" className="form-control" value={this.state.phone}
                                   onChange={this.handlePhone}/>
                        </div>

                        {/*Save and Submit Button*/}
                        <div className="c-account__save-changes">
                            <button type="submit" className="btn btn-primary c-account__save-btn">Save changes</button>

                            {/* Saved Successfully Message */}
                            {this.state.isSaved &&
                            <p>Your changes have been saved!</p>
                            }
                        </div>
                    </form>
                    }
                </div>

                {/*Mobile Nav Bottom / Desktop Nav*/}
                <ConsumerNavBottom active="account"/>

            </div>
        )
    }
}

export default connect((state) => ({
    user: Object.values(state.users),
}), {
    onRequestUserData: MyActions.requestUserData,
    onUpdateUserData: MyActions.updateUserAcfData,
})(UserAccount);

