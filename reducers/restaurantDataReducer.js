import { RESTAURANT_DATA_ADDED } from '../actions/MyActionCreator';

export default (state = {}, action) => {

    if (action.type === RESTAURANT_DATA_ADDED) {
        return {
            ...state,
            ...action.payload
        };
    }

    return state;
}
