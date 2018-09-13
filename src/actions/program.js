import {
    PROGRAM_CREATOR_ERRORS_APPEND,
    PROGRAM_CREATOR_ERRORS_CLEAN,
    RECIEVE_GRANT_PROGRAM,
    REQUEST_GRANT_PROGRAM,
    TOGGLE_PROGRAM_CREATOR_STATE,
    TOGGLE_RENEW_GRANT_PROGRAM
} from "./types";
import apiConnector from "../constants/apiUrl";
import generate_error from "./error";


export function toggle_program_renew(program) {
    return {
        type: TOGGLE_RENEW_GRANT_PROGRAM,
        payload: {program:program},
        error:false
    }
}

function request_program(program) {
    return {
        type: REQUEST_GRANT_PROGRAM,
        payload: {program:program},
        error:false
    }
}

function recieve_program(program, json) {
    return {
        type: RECIEVE_GRANT_PROGRAM,
        payload: {program:program, json:json},
        error:false
    }
}

export function toggle_program_creator_state(state){
    return {
        type: TOGGLE_PROGRAM_CREATOR_STATE,
        payload:state,
        error:false,
    }
}

export function program_creator_errors_clean() {
    return {
        type: PROGRAM_CREATOR_ERRORS_CLEAN,
        payload: null,
        error: false,
    }
}

export function program_creator_errors(errors) {
    return {
        type: PROGRAM_CREATOR_ERRORS_APPEND,
        payload: errors,
        error: true
    }
}

function retrieve_program(program){
    return dispatch => {
        dispatch(request_program(program));
        return apiConnector.get(`opinion_templates/program/${program.id}/R/`)
            .then(response => {
                if (response.status === 200) {
                    const json = response.data;
                    dispatch(recieve_program(program, json));
                } else {
                    dispatch(generate_error(response))
                }

            })
            .catch(error => dispatch(generate_error(error)));
    }
}

function should_fetch_program(state, program) {
    const program_instanse = state.program;
    if (!program_instanse) {
        return true
    } else if (program_instanse.is_fetching === true) {
        return false;
    } else {
        return program_instanse.needs_renew;
    }
}

export function fetch_program_if_needed(program) {
    return (dispatch, get_state) => {
        if (should_fetch_program(get_state(), program)) {
            return dispatch(retrieve_program(program))
        } else {
            Promise.resolve();
        }
    }
}