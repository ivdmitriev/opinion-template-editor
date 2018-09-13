import {
    DELETE_TEMPLATE,
    RECIEVE_TEMPLATE,
    REQUEST_TEMPLATE, SET_FIELD_CREATOR_STATE, SET_FIELD_CREATOR_VALUES,
    SWITCH_LANG,
    TEMPLATE_EDITOR_CHANGE,
    TOGGLE_RENEW_TEMPLATE,
    TOGGLE_TEMPLATE_EDITOR_STATE
} from "./types";
import apiConnector from "../constants/apiUrl";
import generate_error from "./error";
import {delete_field} from "./fields";
import {
    program_creator_errors,
    program_creator_errors_clean,
    toggle_program_creator_state,
    toggle_program_renew
} from "./program";
import {Map} from 'immutable';

export function toggle_template_renew(opinion_template) {
    return {
        type: TOGGLE_RENEW_TEMPLATE,
        payload: {opinion_template: opinion_template},
        error: false
    }
}

function request_template(opinion_template) {
    return {
        type: REQUEST_TEMPLATE,
        payload: {opinion_template: opinion_template},
        error: false
    }
}

function recieve_template(opinion_template,json) {
    return {
        type: RECIEVE_TEMPLATE,
        payload: {opinion_template: opinion_template, json:json},
        error: false
    }
}

export function toggle_template_lang(opinion_template){
    return {
        type: SWITCH_LANG,
        payload:{opinion_template:opinion_template},
        error: false
    }
}

function delete_template(opinion_template) {
    return {
        type: DELETE_TEMPLATE,
        payload: {opinion_template: opinion_template,},
        error: false
    }
    
}

export function toggle_template_editor_state(opinion_template, state) {
    return {
        type: TOGGLE_TEMPLATE_EDITOR_STATE,
        payload: {opinion_template: opinion_template, state: state},
        error: false
    }
}

export function set_field_creator_state(template_id, state) {
    return {
        type: SET_FIELD_CREATOR_STATE,
        payload: {id: template_id, state:state},
        error: false
    }
}

export function set_field_creator_values(template_id, values) {
    return {
        type: SET_FIELD_CREATOR_VALUES,
        payload: {id: template_id, values:values},
        error: false
    }
}

export function editor_state_act(template_id, changes) {
    return {
        type: TEMPLATE_EDITOR_CHANGE,
        payload: {id:template_id, changes:changes},
        error:false
    }
    
}


function retireve_template(opinion_template) {
    return dispatch => {
        dispatch(request_template(opinion_template));
        return apiConnector.get(`opinion_templates/template/${opinion_template.id}/RUD/`)
            .then(response => {
                dispatch(recieve_template(opinion_template, Map(response.data)));
            })
            .catch(error => dispatch(generate_error(error)));
    }
}

export function create_template(template_data, opinion_template={id:-1}){
    const data = {
        program: template_data.program,
        title: template_data.title,
        review_min_length: template_data.review_min_length,
    };
    return dispatch => {
        dispatch(toggle_program_creator_state('exchanging_data'));
        dispatch(program_creator_errors_clean());
        return apiConnector.post(`opinion_templates/template/C/`, data)
            .then(response => {
                if (response.status === 201) {
                    dispatch(toggle_program_renew(response.data));
                    dispatch(toggle_program_creator_state('hidden'));
                } else if (response.status === 400) {
                    dispatch(program_creator_errors(response.data));
                    dispatch(toggle_program_creator_state('edited'));
                } else {
                    console.log(response);
                    dispatch(generate_error(response))
                }
            })
            .catch(error => {
                if (error.response.status === 400) {
                    dispatch(program_creator_errors(error.response.data));
                    dispatch(toggle_program_creator_state('edited'));
                }
            });
    }

}

export function destroy_template(opinion_template) {
    return dispatch => {
        return apiConnector.delete(`opinion_templates/template/${opinion_template.id}/RUD/`)
            .then(response => {
                if (response.status !== 204) {
                    dispatch(generate_error(response));
                } else {
                    dispatch(delete_template(opinion_template));
                    dispatch(toggle_program_renew({id:opinion_template.program}));
                }
            })
            .catch(error => dispatch(generate_error(error)));
    }
}

export function update_template(opinion_template, template_data) {
    const data = {
        id: template_data.id,
        program: template_data.program,
        title: template_data.title,
        review_min_length: template_data.review_min_length,
    };
    return dispatch => {
        return apiConnector.put(`opinion_templates/template/${opinion_template.id}/RUD/`, data)
            .then(response => {
                if (response.status === 200) {
                    dispatch(toggle_template_renew(opinion_template));
                    dispatch(toggle_template_editor_state(opinion_template, 'hidden'));
                } else if (response.status === 400) {
                    dispatch(generate_error(response))
                } else {
                    dispatch(generate_error(response))
                }
            })
            .catch(error => dispatch(generate_error(error)));
    }
}

function should_fetch_template(state, opinion_template) {
    const tpl_instance = state.templates[opinion_template.id];
    if (!tpl_instance){
        return true;
    } else if (tpl_instance.is_fetching === true) {
        return false;
    } else {
        return tpl_instance.needs_renew
    }
}

export function fetch_template_if_needed(opinion_template) {
    return (dispatch, get_state) => {
        if (should_fetch_template(get_state(), opinion_template)) {
            return dispatch(retireve_template(opinion_template))
        } else {
            return Promise.resolve();
        }
    }
}