import { BOOKING_TABLE_ADDED } from '../actions/MyActionCreator';

export default (state = {}, action) => {

    if (action.type === BOOKING_TABLE_ADDED) {
        return {
            ...state,
            ...action.payload
        };
    }

    return state;
}
