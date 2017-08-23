import { PAGE_ADDED } from '../actions/MyActionCreator';

export default (state = {}, action) => {

    if (action.type === PAGE_ADDED) {
        return {
            ...state,
            ...action.payload
        };
    }

    return state;
}
