import React, {Component} from 'react';
import ReactSVG from 'react-svg';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import * as MyActions from '../../../actions/MyActionCreator';

import background from '../../../assets/images/background.png';
import logo from '../../../assets/images/blue-logo.svg';
import '../login.css';

class LogIn extends Component {
    state = {isLoading: false, notFound: false};

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    handleAuthentication = async() => {
        const {onRequestAuthentication} = this.props;

        //If user has no accessToken, start authentication flow
        if (!localStorage.getItem('accessToken')) {
            await onRequestAuthentication();
        }

        //Else let user in
        if (localStorage.getItem('accessToken')) {

            location.href = "/direction";
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

                        <p className="medium-text active-text">The fastest and easiest way to get a table at a good
                            restaurant in Copenhagen. FirstServed will give you an overview of the best restaurants in
                            town<span className="hidden-xs">, and in case of no availability, you can sign up on the online waiting list - we'll
                            send you a notification when there's an available table at the restaurants of your
                            choice</span>.</p>

                        <div className="c-login__buttons">
                            <button className="btn btn-primary" onClick={this.handleAuthentication}>Get served
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(connect((state) => ({
    undefined
}), {
    onRequestAuthentication: MyActions.requestAuthentication,
})(LogIn));