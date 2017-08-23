import { RESTAURANT_TABLE_ADDED } from '../actions/MyActionCreator';

export default (state = {}, action) => {

    if (action.type === RESTAURANT_TABLE_ADDED) {
        return {
            ...state,
            ...action.payload
        };
    }

    return state;
}
