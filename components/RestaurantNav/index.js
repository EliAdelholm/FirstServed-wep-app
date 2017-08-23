import React, {Component} from 'react';
import ReactSVG from 'react-svg';
import {Link} from 'react-router-dom';

import logo from '../../assets/images/logo.svg';
import settingsGrey from '../../assets/images/settings.png';
import backButton from '../../assets/images/back.png';
import tablesButton from '../../assets/images/tablebooking.png';
import signOutIcon from '../../assets/icons/sign-out.png';

import './navbar.css';

class RestaurantNav extends Component {

    handleSignOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessSecret");

        location.href = "/"
    };

    render() {

        return (
            <div className="row o-navbar">

                <div className="col-xs-12 clearfix">
                    <Link to="/tables">
                        <ReactSVG
                            path={logo}
                            className=" hidden-xs o-navbar__logo pull-left inline"
                        />
                    </Link>

                    {this.props.pageTitle !== "Settings" &&
                    <Link to="/settings">
                        <div className="o-navbar__title">
                            <img src={settingsGrey} alt="settings" className="o-navbar__settings inline "/>
                            <p className="inline hidden-xs">{this.props.pageTitle}</p>
                            <h4 className="inline visible-xs">{this.props.pageTitle}</h4>
                        </div>
                    </Link>
                    }

                    {this.props.pageTitle === "Settings" &&
                    <div>
                        <h4 className="o-navbar__title active-text visible-xs">{this.props.pageTitle}</h4>
                        <div className="o-navbar__title hidden-xs">
                            <div className="inline" onClick={this.handleSignOut} style={{cursor: "pointer"}}>
                                <img src={signOutIcon} alt="Sign Out" className="o-navbar__settings inline"/>
                                <p className="o-navbar__sign-out inline">Sign Out</p>
                            </div>
                            <Link to="/tables">
                                <img src={tablesButton} alt="Back" className="o-navbar__settings inline"/>
                                <p className="inline">Tables</p>
                            </Link>
                        </div>
                    </div>
                    }
                    {this.props.icon === "settings" &&
                    <div>
                        <Link to="/settings"><img src={settingsGrey} alt="settings"
                                                  className="o-navbar__settings visible-xs"/></Link>
                    </div>
                    }
                    {this.props.icon === "back" &&
                    <div>
                        <Link to="/tables"><img src={backButton} alt="Back"
                                                className="o-navbar__back visible-xs"/></Link>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default RestaurantNav;