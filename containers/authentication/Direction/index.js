import React, {Component} from 'react';
import ReactSVG from 'react-svg';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import * as MyActions from '../../../actions/MyActionCreator';

import background from '../../../assets/images/background.png';
import logo from '../../../assets/images/blue-logo.svg';
import '../login.css';

class Direction extends Component {
    state = {isLoading: false, notFound: false};

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    componentDidMount = async() => {
        const {onRequestUserData, onUpdateUserData} = this.props;
        const {history} = this.props;

        if (localStorage.getItem('accessToken')) {
            this.setState({isLoading: true});
            await onRequestUserData();

            this.setState({isLoading: false});

            const [ user ] = this.props.user;

            console.log(user.acf.member_type);

            if(!user.acf.member_type) {
                console.log("this is where we update the user data on first login")
                await onUpdateUserData(user.id, {
                    "fields": {
                        "table_for": 2,
                        "notifications": true,
                        "favourites": [],
                        "waiting_for": [],
                        "member_type": "User",
                    }
                });

                history.push('/restaurants');
            }

             if(user.acf.member_type === "User") {
                history.push('/restaurants');
             }

             if(user.acf.member_type === "Restaurant") {
             history.push('/tables');
             }
        }
    };

    render() {

        return (
            <div className="row c-login" style={{backgroundImage: "url(" + background + ")"}}>

                <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3"
                     style={{height: "100vh"}}>

                    <div className="c-login__content">

                    <ReactSVG
                        path={logo}
                        className="c-login__logo"
                    />

                    <p className="active-text">Please wait while we log you in</p>
                    </div>

                </div>
            </div>
        )
    }
}

export default withRouter(connect((state) => ({
    user: Object.values(state.users),
}), {
    onRequestUserData: MyActions.requestUserData,
    onUpdateUserData: MyActions.updateUserAcfData,
})(Direction));
