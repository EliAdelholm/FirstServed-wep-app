import React, {Component} from 'react';
import ReactSVG from 'react-svg';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import * as MyActions from '../../../actions/MyActionCreator';

import background from '../../../assets/images/background.png';
import logo from '../../../assets/images/blue-logo.svg';
import '../login.css';

class LogIn extends Component {
    state = {isLoading: false, notFound: false};

    async componentDidMount() {
        const {onAuthenticationAccess} = this.props;

        try {
            await onAuthenticationAccess();

            location.href = '/direction'

        } catch (err) {
            console.error(err);
        }

    }

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

                        <p className="medium-text">Wait while we log you in</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(connect((state) => ({
    undefined
}), {
    onAuthenticationAccess: MyActions.accessAuthentication,
})(LogIn));