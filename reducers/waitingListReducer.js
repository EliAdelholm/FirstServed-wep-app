import { WAITING_LIST_ADDED, WAITING_LIST_REMOVED } from '../actions/MyActionCreator';

export default (state = {}, action) => {

    if (action.type === WAITING_LIST_ADDED) {
        return {
            ...state,
            ...action.payload
        };
    }

    if (action.type === WAITING_LIST_REMOVED) {
        const nextState = {...state};
        delete nextState[action.payload];

        return nextState;
    }

    return state;
}
