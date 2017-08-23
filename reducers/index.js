import { combineReducers } from 'redux';

import userReducer from './userReducer';
import restaurantReducer from './restaurantReducer';
import favouriteReducer from './favouriteReducer';
import waitingListReducer from './waitingListReducer';
import waitingUserReducer from './waitingUserReducer';
import restaurantDataReducer from './restaurantDataReducer';
import restaurantTableReducer from './restaurantTableReducer';
import bookingTableReducer from './bookingTableReducer';
import pageReducer from './pageReducer';

export default combineReducers({
    users: userReducer,
    restaurants: restaurantReducer,
    favourites: favouriteReducer,
    waitingList: waitingListReducer,
    waitingUsers: waitingUserReducer,
    restaurantDatas: restaurantDataReducer,
    restaurantTables: restaurantTableReducer,
    bookingTables: bookingTableReducer,
    pages: pageReducer,
});