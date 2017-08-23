/* global google */

import canUseDOM from "can-use-dom";

import raf from "raf";

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withGoogleMap, GoogleMap, InfoWindow, Circle, Marker} from "react-google-maps";

import * as MyActions from '../../../actions/MyActionCreator';

import MapItem from './MapItem';

import googleMapStyles from '../../../assets/json/googleMapStyles.json';
import './consumer.css';

const geolocation = (
    canUseDOM && navigator.geolocation ?
        navigator.geolocation :
        ({
            getCurrentPosition(success, failure) {
                failure(`Your browser doesn't support geolocation.`);
            },
        })
);

const GettingStartedGoogleMap = withGoogleMap(props => (

    <GoogleMap
        center={props.center}
        defaultZoom={10}
        defaultOptions={{styles: googleMapStyles}}
        defaultCenter={{lat: -25.363882, lng: 131.044922}}
    >
        {props.center && (
            <InfoWindow position={props.center}>
                <div>{props.content}</div>
            </InfoWindow>
        )}
        {props.center && (
            <Circle
                center={props.center}
                radius={props.radius}
                options={{
                    fillColor: `red`,
                    fillOpacity: 0.20,
                    strokeColor: `red`,
                    strokeOpacity: 1,
                    strokeWeight: 1,
                }}
            />
        )}
        {props.markers.map((marker, index) => (
            <Marker
                key={index}
                position={marker.position}
                onClick={() => props.onMarkerClick(marker)}
            >
                {marker.showInfo && (
                    <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
                        <div>{marker.infoContent}</div>
                    </InfoWindow>
                )}
            </Marker>
        ))}
    </GoogleMap>
));

class RestaurantMap extends Component {
    state = {
        isLoading: true, mapView: true, markers: [], center: {
            lat: 55.663115,
            lng: 12.533715,
        }, content: null, radius: 6000,
    };

    isUnmounted = false;

    async componentDidMount() {
        const {onRequestRestaurants} = this.props;

        try {
            await onRequestRestaurants();

            const {restaurants} = this.props;

            const mapCoordinates = restaurants.map((restaurant, i) => (
                {
                    position: new google.maps.LatLng(parseFloat(restaurant.acf.address.lat), parseFloat(restaurant.acf.address.lng)),
                    showInfo: false,
                    infoContent: (<div className="c-map__info-window"><MapItem restaurant={restaurant}/></div>),
                    defaultAnimation: 2,
                }
            ));

            this.setState({markers: mapCoordinates})


        } catch (err) {
            console.error(err);
        }

        const tick = () => {
            if (this.isUnmounted) {
                return;
            }
            this.setState({radius: Math.max(this.state.radius - 20, 0)});

            if (this.state.radius > 200) {
                raf(tick);
            }

            this.setState({isLoading: false})
        };

        geolocation.getCurrentPosition((position) => {
            if (this.isUnmounted) {
                return;
            }
            this.setState({
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                },
                content: `This is you.`,
            });

            raf(tick);
        }, () => {
            if (this.isUnmounted) {
                return;
            }
            this.setState({
                center: {
                    lat: 55.663115,
                    lng: 12.533715,
                },
                content: `Could not find your position.`,
            });

            raf(tick);
        });
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    handleMapView = () => {
        this.setState({mapView: !this.state.mapView})
    };

    handleMarkerClick = this.handleMarkerClick.bind(this);
    handleMarkerClose = this.handleMarkerClose.bind(this);

    // Toggle to 'true' to show InfoWindow and re-renders component
    handleMarkerClick(targetMarker) {
        this.setState({
            markers: this.state.markers.map(marker => {
                if (marker === targetMarker) {
                    return {
                        ...marker,
                        showInfo: true,
                    };
                }
                return marker;
            }),
        });
    }

    handleMarkerClose(targetMarker) {
        this.setState({
            markers: this.state.markers.map(marker => {
                if (marker === targetMarker) {
                    return {
                        ...marker,
                        showInfo: false,
                    };
                }
                return marker;
            }),
        });
    }

    render() {

        return (
            <div className="row c-consumer__map">

                {this.state.mapView && !this.state.isLoading &&
                <div style={{height: "100vh"}}>
                    <GettingStartedGoogleMap
                        containerElement={
                            <div style={{height: `100%`}}/>
                        }
                        mapElement={
                            <div style={{height: `100%`}}/>
                        }
                        center={this.state.center}
                        markers={this.state.markers}
                        onMarkerClick={this.handleMarkerClick}
                        onMarkerClose={this.handleMarkerClose}
                        content={this.state.content}
                        radius={this.state.radius}
                    />
                </div>
                }

            </div>
        )
    }
}

export default connect((state) => ({
    restaurants: Object.values(state.restaurants),
}), {
    onRequestRestaurants: MyActions.fetchRestaurants,
})(RestaurantMap);
