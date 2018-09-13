import {RECIEVE_ERROR} from "./types";

function generate_error(error_text) {
    return {
        type: RECIEVE_ERROR,
        payload: error_text,
        error: true
    }
}

export default generate_error;