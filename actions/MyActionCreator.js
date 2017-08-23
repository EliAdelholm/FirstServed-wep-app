import { batchActions } from 'redux-batched-actions';

import * as MyService from '../services/MyService';

export const USER_ADDED = 'user/USER_ADDED';
const addUser = (users = {}) => ({
    type: USER_ADDED,
    payload: users,
});

export const WAITING_USER_ADDED = 'waitingUser/WAITING_USER_ADDED';
const addWaitingUser = (waitingUsers = {}) => ({
    type: WAITING_USER_ADDED,
    payload: waitingUsers,
});

export const RESTAURANT_ADDED = 'restaurant/RESTAURANT_ADDED';
const addRestaurant = (restaurants = {}) => ({
    type: RESTAURANT_ADDED,
    payload: restaurants,
});

export const FAVOURITE_ADDED = 'favourite/FAVOURITE_ADDED';
const addFavourite = (favourites = {}) => ({
    type: FAVOURITE_ADDED,
    payload: favourites,
});

export const WAITING_LIST_ADDED = 'waitingList/WAITING_LIST_ADDED';
const addWaitingList = (waitingLists = {}) => ({
    type: WAITING_LIST_ADDED,
    payload: waitingLists,
});

export const WAITING_LIST_REMOVED = 'waitingList/WAITING_LIST_REMOVED';
export const removeWaitingList = (wait) => {
    return async (dispatch) => {

        console.log("Hulla?");
        dispatch({
            type: WAITING_LIST_REMOVED,
            payload: wait
        });
    }
};

export const RESTAURANT_DATA_ADDED = 'restaurantData/RESTAURANT_DATA_ADDED';
const addRestaurantData = (restaurantDatas = {}) => ({
    type: RESTAURANT_DATA_ADDED,
    payload: restaurantDatas,
});

export const RESTAURANT_TABLE_ADDED = 'restaurantTable/RESTAURANT_TABLE_ADDED';
const addRestaurantTable = (restaurantTables = {}) => ({
    type: RESTAURANT_TABLE_ADDED,
    payload: restaurantTables,
});

export const BOOKING_TABLE_ADDED = 'bookingTable/BOOKING_TABLE_ADDED';
const addBookingTable = (bookingTables = {}) => ({
    type: BOOKING_TABLE_ADDED,
    payload: bookingTables,
});

export const requestAuthentication = () => {
    return async (dispatch) => {
        const response = await MyService.authenticationRequest();
    }
};

export const accessAuthentication = () => {
    return async (dispatch) => {
        const response = await MyService.authenticationAccess();
    }
};

export const sendReservationNotification = (id) => {
    return async (dispatch) => {
        const response = await MyService.createReservationNotification(id);
    }
};

export const fetchRestaurants = () => {
    return async (dispatch) => {
        const response = await MyService.fetchRestaurantsAsync();

        dispatch(batchActions([
            addRestaurant(response.entities.restaurants),
        ]));
    }
};

export const fetchWaitingList = (selection) => {
    return async (dispatch) => {
        const response = await MyService.fetchWaitingListAsync(selection);

        dispatch(batchActions([
            addWaitingList(response.entities.waitingLists),
        ]));
    }
};

export const fetchFavourites = (selection) => {
    return async (dispatch) => {
        const response = await MyService.fetchFavouritesAsync(selection);

        dispatch(batchActions([
            addFavourite(response.entities.favourites),
        ]));
    }
};

export const fetchRestaurantData = (slug) => {
    return async (dispatch) => {
        const response = await MyService.fetchRestaurantDataAsync(slug);

        dispatch(batchActions([
            addRestaurantData(response.entities.restaurantDatas),
        ]));
    }
};

export const updateRestaurantData = (id, data) => {
    return async (dispatch) => {
        const response = await MyService.updateRestaurantDataAsync(id, data);

        dispatch(batchActions([
            addRestaurantData(response.entities.restaurantDatas),
        ]))
    }
};

export const updateRestaurantAcfData = (id, fields) => {
    return async (dispatch) => {
        const response = await MyService.updateRestaurantAcfDataAsync(id, fields);

        dispatch(batchActions([
            addRestaurantData(response.entities.restaurantDatas),
        ]))
    }
};

export const fetchAllRestaurantTables = () => {
    return async (dispatch) => {
        const response = await MyService.fetchAllRestaurantTablesAsync();

        dispatch(batchActions([
            addRestaurantTable(response.entities.restaurantTables),
        ]));
    }
};

export const fetchRestaurantTables = (id) => {
    return async (dispatch) => {
        const response = await MyService.fetchRestaurantTablesAsync(id);

        dispatch(batchActions([
            addRestaurantTable(response.entities.restaurantTables),
        ]));
    }
};

export const fetchTableBooking = (id) => {
    return async (dispatch) => {
        const response = await MyService.fetchTableBookingAsync(id);

        dispatch(batchActions([
            addBookingTable(response.entities.bookingTables),
        ]));
    }
};

export const postAvailableTable = (post, content) => {
    return async (dispatch) => {
        const response = await MyService.postAvailableTableAsync(post, content);

        dispatch(batchActions([
            addRestaurantTable(response.entities.restaurantTables),
        ]));
    }
};

export const bookTable = (content, post, parent) => {
    return async (dispatch) => {
        const response = await MyService.bookTableAsync(content, post, parent);

        dispatch(batchActions([
            addRestaurantTable(response.entities.restaurantTables),
        ]));
    }
};

export const setTableTimeframe = (id, fields) => {
    return async (dispatch) => {
        const response = await MyService.setTableTimeframeAsync(id, fields);

        dispatch(batchActions([
            addRestaurantTable(response.entities.restaurantTables),
        ]));
    }
};

export const deleteAvailableTable = (id) => {
    return async (dispatch) => {
        const response = await MyService.deleteAvailableTableAsync(id);

        dispatch(batchActions([
            addRestaurantTable(response.entities.restaurantTables),
        ]));
    }
};

export const requestAllUsers = () => {
    return async (dispatch) => {
        const response = await MyService.requestAllUsersAsync();

        dispatch(batchActions([
            addWaitingUser(response.entities.waitingUsers)
        ]));
    }
};

export const requestUserData = () => {
    return async (dispatch) => {
        const response = await MyService.requestUserDataAsync();

        dispatch(batchActions([
            addUser(response.entities.users)
        ]));
    }
};

export const updateUserAcfData = (id, fields) => {
    return async (dispatch) => {
        const response = await MyService.updateUserAcfDataAsync(id, fields);

        dispatch(batchActions([
            addUser(response.entities.users),
        ]))
    }
};