import { Map } from 'immutable';
import {
    PROGRAM_CREATOR_ERRORS_APPEND,
    PROGRAM_CREATOR_ERRORS_CLEAN,
    RECIEVE_GRANT_PROGRAM,
    REQUEST_GRANT_PROGRAM,
    TOGGLE_PROGRAM_CREATOR_STATE,
    TOGGLE_RENEW_GRANT_PROGRAM
} from "../actions/types";

function program_reducer(state=Map({creator_state:'hidden'}), action) {
    const m = state;
    const p = action.payload;
    switch (action.type) {
        case TOGGLE_RENEW_GRANT_PROGRAM:
            return m.set('needs_renew', true);
        case REQUEST_GRANT_PROGRAM:
            return m.set('needs_renew', false).set('is_fetching', true);
        case RECIEVE_GRANT_PROGRAM:
            return m.set('is_fetching', false).merge(p.json);
        case TOGGLE_PROGRAM_CREATOR_STATE:
            return m.set('creator_state', p);
        case PROGRAM_CREATOR_ERRORS_CLEAN:
            return m.delete('creator_errors');
        case PROGRAM_CREATOR_ERRORS_APPEND:
            return m.set('creator_errors', p);
        default:
            return m;
    }

}
export default program_reducer;