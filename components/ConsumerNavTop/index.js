import React, {Component} from 'react';

import FilterIcon from '../../assets/icons/nav-filter.png';
import MapIcon from '../../assets/icons/nav-map.png';
import ListIcon from '../../assets/icons/list.png';
import CloseIcon from '../../assets/icons/nav-close.png';
import DesktopFilter from '../../assets/icons/nav-filter.png';
import DesktopMap from '../../assets/icons/nav-map.png';

import FilterMenu from './FilterMenu';

import './nav-top.css';

class ConsumerNavTop extends Component {
    state = {filterMenu: false};

    handleMapView = () => {
        this.props.onHandleMapView()
    };

    handleFilterMenu = () => {
        this.setState({filterMenu: !this.state.filterMenu})
    };

    handleChangeFilter = (filter) => {
        this.props.onChangeFilter(filter);
    };

    handleAvailable = (available) => {
        this.props.onFilterAvailable(available)
    };

    handleKitchen = (kitchen) => {
        this.props.onFilterKitchen(kitchen)
    };

    handlePrice = (price) => {
        this.props.onFilterPrice(price)
    };

    render() {
        const {mapView, currentPage, activeFilter, availableFilter, kitchenFilter, priceFilter, desktop, position} = this.props;

        return (
            <div className="inline">

                {!desktop &&
                <div className="row o-nav-top clearfix">

                    {currentPage === "restaurants" &&
                    <div>
                        <img src={FilterIcon} alt="Filter" className="pull-left inline o-nav-top__filter-icon"
                             onClick={this.handleFilterMenu}/>
                        <h4 className="inline">{activeFilter}</h4>
                        {activeFilter === "Available" &&
                        <span>{": " + availableFilter}</span>}
                        {activeFilter === "Kitchen" &&
                        <span>{": " + kitchenFilter}</span>}
                        {activeFilter === "Price" &&
                        <span>{": " + priceFilter}</span>}
                        <img src={mapView ? CloseIcon : MapIcon} alt="Map"
                             className="pull-right inline o-nav-top__map-icon"
                             onClick={this.handleMapView}/>
                    </div>
                    }

                    {currentPage !== "restaurants" &&
                    <div>
                        <h4 className="inline">{currentPage}</h4>
                    </div>
                    }

                </div>
                }

                {desktop &&
                <div className="o-desktop-nav__filter-map inline">
                    <div className="inline" onClick={this.handleFilterMenu}>
                        <img src={DesktopFilter}
                             alt="All Restaurants" className="o-nav-bottom__menu-icon inline"/>
                        <p className="medium-text inline">Filter</p>
                    </div>
                    <div className="inline" onClick={this.handleMapView}>
                        <img src={mapView ? ListIcon : DesktopMap}
                             alt="All Restaurants" className="o-nav-bottom__menu-icon inline"/>
                        <p className="medium-text inline">{mapView ? "List" : "Map"}</p>
                    </div>
                </div>
                }
                {this.state.filterMenu &&
                <FilterMenu onClose={this.handleFilterMenu}
                            onChangeFilter={this.handleChangeFilter}
                            onFilterAvailable={this.handleAvailable}
                            onFilterKitchen={this.handleKitchen}
                            onFilterPrice={this.handlePrice}
                            activeFilter={activeFilter}
                            availableFilter={availableFilter}
                            kitchenFilter={kitchenFilter}
                            priceFilter={priceFilter}
                            desktop={desktop}
                            position={position}/>
                }
            </div>
        )
    }
}

export default ConsumerNavTop;