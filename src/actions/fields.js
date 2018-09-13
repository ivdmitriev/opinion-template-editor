import {
    DELETE_FIELD,
    RECIEVE_FIELD,
    REQUEST_FIELD, SET_FIELD_EDITOR_STATE, SET_FIELD_EDITOR_VALUES,
    TOGGLE_RENEW_FIELD
} from "./types";
import apiConnector from "../constants/apiUrl";
import generate_error from "./error";
import {fetch_template_if_needed, toggle_template_renew} from "./templates";
import {EditorState, ContentState} from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

export function toggle_renew_field(field) {
    return {
        type: TOGGLE_RENEW_FIELD,
        payload: {field: field},
        error: false
    }
}

function request_field(field) {
    return {
        type: REQUEST_FIELD,
        payload: {field: field},
        error: false
    }
}

function recieve_field(field, json) {
    return {
        type: RECIEVE_FIELD,
        payload: {field: field, json: json},
        error: false
    }
}

export function delete_field(field) {
    return {
        type: DELETE_FIELD,
        payload: {field: field},
        error: false
    }
}


export function set_field_editor_state(field_id, state) {
    return {
        type: SET_FIELD_EDITOR_STATE,
        payload: {id: field_id, state: state},
        error: false
    }
}

export function set_field_editor_values(field_id, values) {
    return {
        type: SET_FIELD_EDITOR_VALUES,
        payload: {id: field_id, values: values},
        error: false
    }
}


function retrieve_field(field) {
    return dispatch => {
        dispatch(request_field(field));
        return apiConnector.get(`opinion_templates/field/${field.id}/RUD/`)
            .then(response => {
                dispatch(recieve_field(field, response.data));
                dispatch(set_field_editor_values(field.id, response.data));
                const blocksFromHtml = htmlToDraft(response.data.description);
                const {contentBlocks, entityMap} = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                const description_state = EditorState.createWithContent(contentState);
                const blocksFromHtmlen = htmlToDraft(response.data.description_eng ? response.data.description_eng : '<div></div>');
                const contentBlocksen = blocksFromHtmlen.contentBlocks;
                const entityMapen = blocksFromHtmlen.entityMap;
                const contentStateen = ContentState.createFromBlockArray(contentBlocksen, entityMapen);
                const description_en_state = EditorState.createWithContent(contentStateen);
                dispatch(set_field_editor_values(field.id, {
                    description_state: description_state,
                    description_en_state: description_en_state
                }))
            })
            .catch(error => dispatch(generate_error(error)));
    }
}

export function create_field(data, field = {id: -1}) {
    return dispatch => {
        return apiConnector.post(`opinion_templates/field/C/`, data)
            .then(response => {
                if (response.status === 201) {
                    dispatch(toggle_renew_field(response.data));
                    dispatch(toggle_template_renew({id: response.data.opinion_template}));
                    dispatch(toggle_renew_field(response.data));
                    dispatch(fetch_field_if_needed({id: response.data.id}));
                    dispatch(fetch_template_if_needed({id: response.data.opinion_template}));
                } else if (response.status === 400) {
                    dispatch(generate_error(response))
                } else {
                    dispatch(generate_error(response))
                }
            })
            .catch(error => dispatch(generate_error(error)));
    }
}


export function update_field(field, data) {

    return dispatch => {
        return apiConnector.put(`opinion_templates/field/${field.id}/RUD/`, data)
            .then(response => {
                if (response.status === 200) {
                    dispatch(toggle_renew_field(field));
                    if (field.field_range !== data.field) {
                        dispatch(toggle_template_renew({id: field.opinion_template}))
                    }
                } else if (response.status === 400) {
                    dispatch(generate_error(response))
                } else {
                    dispatch(generate_error(response))
                }
            })
            .catch(error => dispatch(generate_error(error)));
    }
}

export function destroy_field(field) {
    return dispatch => {

        return apiConnector.delete(`opinion_templates/field/${field.id}/RUD/`)
            .then(response => {
                if (response.status !== 204) {
                    dispatch(generate_error(response));
                } else {
                    dispatch(delete_field(field));
                    dispatch(toggle_template_renew({id: field.opinion_template}))
                }
            })
            .catch(error => dispatch(generate_error(error)));
    }
}


function should_fetch_field(state, field) {
    const field_instance = state.fields[field.id];
    if (!field_instance) {
        return true;
    } else if (field_instance.is_fetching === true) {
        return false;
    } else {
        return field_instance.needs_renew
    }
}

export function fetch_field_if_needed(field) {
    return (dispatch, get_state) => {
        if (should_fetch_field(get_state(), field)) {
            return dispatch(retrieve_field(field));
        } else {
            return Promise.resolve();
        }
    }
}