import {RECIEVE_ERROR} from "../actions/types";
import {Map} from 'immutable';

function error_reducer(state={},action) {
    const m = Map(state);
    switch (action.type) {
        case RECIEVE_ERROR:
            console.log(action.payload);
            return m.set('error', action.payload);
        default:
            return m;
    }

}

export default error_reducer;