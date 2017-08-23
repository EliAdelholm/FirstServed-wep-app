import { FAVOURITE_ADDED } from '../actions/MyActionCreator';

export default (state = {}, action) => {

    if (action.type === FAVOURITE_ADDED) {
        return {
            ...state,
            ...action.payload
        };
    }

    return state;
}
