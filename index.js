// Import dependencies
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {enableBatching} from 'redux-batched-actions';
import {Router, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';

// Import Reducers
import rootReducer from './reducers';

// Import Authentication Routes
import LogIn from './containers/authentication/LogIn';
import PreparingAccess from './containers/authentication/PreparingAccess';
import Direction from './containers/authentication/Direction';

// Import RestaurantScope Routes
import RestaurantHome from './containers/restaurantScope/Tables';
import RestaurantSettings from './containers/restaurantScope/Settings';

// Import ConsumerScope Routes
import ListRestaurants from './containers/consumerScope/ListRestaurants';
import RestaurantPage from './containers/consumerScope/ListRestaurants/RestaurantPage';
import Favourites from './containers/consumerScope/Favourites';
import UserAccount from './containers/consumerScope/UserAccount';
import Bookings from './containers/consumerScope/Bookings';

// Import CSS
import './core.css';

const history = createBrowserHistory();

// Get the current location.
// eslint-disable-next-line
const location = history.location;

// Listen for changes to the current location.
// eslint-disable-next-line
const unlisten = history.listen((location, action) => {
    // location is an object like window.location
    console.log(action, location.pathname)
});

// To stop listening, call the function returned from listen().

// Connect Google Analytics
ReactGA.initialize('UA-104323292-1');

history.listen((location, action) => {
    ReactGA.set({page: window.location.pathname});
    ReactGA.pageview(window.location.pathname);

    // If we can find appInsights-JS lib, then we will register a pageView,
    // otherwise it will only be tracked on hard-reload
    if (window.appInsights) {
        window.appInsights.trackPageView();
    }
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk),
);

const store = createStore(enableBatching(rootReducer), enhancer);

// eslint-disable-next-line
let swRegistration = null;

// Check for browser support of service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            // Successful registration
            console.log('Hooray. Registration successful, scope is:', registration.scope);
            swRegistration = registration;
        }).catch(function (err) {
        // Failed registration, service worker won’t be installed
        console.log('Whoops. Service worker registration failed, error:');
    });
} else {
    console.warn('Push messaging is not supported');
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
                <div className="container-fluid root-element">
                    <Switch>
                        <Route exact path="/" component={LogIn}/>
                        <Route path="/access" component={PreparingAccess}/>
                        <Route path="/direction" component={Direction}/>
                        <Route path="/tables" component={RestaurantHome}/>
                        <Route path="/settings" component={RestaurantSettings}/>
                        <Route path="/restaurants" component={ListRestaurants}/>
                        <Route path="/favourites" component={Favourites}/>
                        <Route path="/account" component={UserAccount}/>
                        <Route path="/bookings" component={Bookings}/>
                        <Route exact path="/:slug" component={RestaurantPage}/>
                    </Switch>
                </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);