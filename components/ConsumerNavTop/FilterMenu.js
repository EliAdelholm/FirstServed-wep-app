import React, {Component} from 'react';
import 'rc-checkbox/assets/index.css';
import Checkbox from 'rc-checkbox';

import kithenTypes from '../../assets/json/kitchenTypeList.json';

import CloseIcon from '../../assets/icons/nav-close.png';

import './nav-top.css';

class FilterMenu extends Component {
    state = {isLoading: true};

    componentDidMount = () => {
        this.setState({isLoading: false})
    };

    handleCloseMenu = () => {
        this.props.onClose()
    };

    handleAvailableChange = (available) => {
        this.props.onFilterAvailable(available);
    };

    handleKitchenChange = (kitchen) => {
        this.props.onFilterKitchen(kitchen);
    };

    handlePriceChange = (price) => {
        this.props.onFilterPrice(price);
    };

    handleActiveFilter = (filter) => {
        this.props.onChangeFilter(filter);
    };

    render() {
        const {activeFilter, position} = this.props;

        return (
            <div className="row o-filter-menu">
                {!this.state.isLoading &&
                <div className="col-xs-12 o-filter-scrollable">
                    <img src={CloseIcon} alt="Close menu"
                         className="pull-right inline o-filter-menu__close"
                         onClick={this.handleCloseMenu}/>

                    <div className="col-xs-12 o-filter-menu__list-item">
                        <Checkbox
                            checked={activeFilter === "A-Z"}
                            onChange={() => this.handleActiveFilter("A-Z")}
                            className="o-filter-menu__list-checkbox pull-left"
                        />
                        <p className="o-filter-menu__list-checked-p"
                           onClick={() => this.handleActiveFilter("A-Z")}>
                            BROWSE A-Z</p>
                    </div>

                    <div className="col-xs-12 o-filter-menu__list-item">
                        <label className="o-filter-menu__list-label">
                            <Checkbox
                                checked={activeFilter === "Available"}
                                onChange={() => this.handleActiveFilter("Available")}
                                className="o-filter-menu__list-checkbox pull-left"
                            />
                            <p className="o-filter-menu__list-checked-p"
                               onClick={() => this.handleActiveFilter("Available")}>
                                AVAILABLE</p>
                        </label>

                        {activeFilter === "Available" &&
                        <div>
                            <label className="o-filter-menu__list-label">
                                <span className="o-filter-menu__list-text">Right now</span>
                                <Checkbox
                                    checked={this.props.availableFilter === "Right Now"}
                                    onChange={() => this.handleAvailableChange("Right Now")}
                                    className="o-filter-menu__list-checkbox pull-left"
                                />
                            </label>
                            <label className="o-filter-menu__list-label">
                                <span className="o-filter-menu__list-text">Regular Booking</span>
                                <Checkbox
                                    checked={this.props.availableFilter === "Regular Booking"}
                                    onChange={() => this.handleAvailableChange("Regular Booking")}
                                    className="o-filter-menu__list-checkbox pull-left"
                                />
                            </label>
                        </div>
                        }
                    </div>

                    <div className="col-xs-12 o-filter-menu__list-item">
                        <label className="o-filter-menu__list-label">
                            <Checkbox
                                checked={activeFilter === "Kitchen"}
                                onChange={() => this.handleActiveFilter("Kitchen")}
                                className="o-filter-menu__list-checkbox pull-left"
                            />
                            <p className="o-filter-menu__list-checked-p">
                                KITCHEN</p>
                        </label>

                        {activeFilter === "Kitchen" &&
                        <div>
                            {kithenTypes.map((kitchen, i) => {
                                return (
                                    <label className="o-filter-menu__list-label" key={i}>
                                        <span className="o-filter-menu__list-text">{kitchen}</span>
                                        <Checkbox
                                            checked={this.props.kitchenFilter === kitchen}
                                            onChange={() => this.handleKitchenChange(kitchen)}
                                            className="o-filter-menu__list-checkbox pull-left"
                                        />
                                    </label>
                                )
                            })}
                        </div>
                        }
                    </div>

                    <div className="col-xs-12 o-filter-menu__list-item">
                        <label className="o-filter-menu__list-label">
                            <Checkbox
                                checked={activeFilter === "Price"}
                                onChange={() => this.handleActiveFilter("Price")}
                                className="o-filter-menu__list-checkbox pull-left"
                            />
                            <p className="o-filter-menu__list-checked-p">
                                PRICE</p>
                        </label>

                        {activeFilter === "Price" &&
                        <div>
                            <label className="o-filter-menu__list-label">
                                <span className="o-filter-menu__list-text">Lowest first</span>
                                <Checkbox
                                    checked={this.props.priceFilter === "Low to High"}
                                    onChange={() => this.handlePriceChange("Low to High")}
                                    className="o-filter-menu__list-checkbox pull-left"
                                />
                            </label>
                            <label className="o-filter-menu__list-label">
                                <span className="o-filter-menu__list-text">Highest first</span>
                                <Checkbox
                                    checked={this.props.priceFilter === "High to Low"}
                                    onChange={() => this.handlePriceChange("High to Low")}
                                    className="o-filter-menu__list-checkbox pull-left"
                                />
                            </label>
                        </div>
                        }
                    </div>
                    {position &&
                    <div className="col-xs-12 o-filter-menu__list-item">
                        <label className="o-filter-menu__list-label">
                            <Checkbox
                                checked={activeFilter === "Nearby"}
                                onChange={() => this.handleActiveFilter("Nearby")}
                                className="o-filter-menu__list-checkbox pull-left"
                            />
                            <p className="o-filter-menu__list-checked-p">
                                NEARBY</p>
                        </label>
                    </div>
                    }
                </div>
                }
            </div>
        )
    }
}

export default FilterMenu;
