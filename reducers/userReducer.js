import { USER_ADDED } from '../actions/MyActionCreator';

export default (state = {}, action) => {

    if (action.type === USER_ADDED) {
        return {
            ...state,
            ...action.payload
        };
    }

    return state;
}
