import {
    DELETE_FIELD,
    HIDE_FIELD_MODAL,
    RECIEVE_FIELD,
    REQUEST_FIELD, SET_FIELD_EDITOR_STATE, SET_FIELD_EDITOR_VALUES,
    SHOW_FIELD_MODAL,
    TOGGLE_RENEW_FIELD
} from "../actions/types";
import {Map} from 'immutable';

const initial_field_state = {
    is_fetching: true,
    needs_renew: false,
    editor_state: 'hidden',
    editor_values: Map({
        id: null,
        field_range: null,
        field_type: null,
        field_title: null,
        field_title_en: null,
        comment_min_length: null,
        opinion_template: null,
        description:null,
        description_eng: null,
        description_state: null,
        description_en_state: null,
    })
};
const initial_fields_state = {};


function field(state=initial_field_state, action) {
    const m = Map(state);
    const p = action.payload;
    switch (action.type) {
        case TOGGLE_RENEW_FIELD:
            return m.set('needs_renew', true);
        case REQUEST_FIELD:
            return m.set('needs_renew', false).set('is_fetching', true);
        case RECIEVE_FIELD:
            return m.set('is_fetching', false).merge(p.json);
        case SHOW_FIELD_MODAL:
            return m.set('modal', Map({show:true, type:p.type, errors:p.errors}));
        case HIDE_FIELD_MODAL:
            return m.delete('modal');
        case SET_FIELD_EDITOR_STATE:
            return m.set('editor_state', p.state);
        case SET_FIELD_EDITOR_VALUES:
            return m.set('editor_values', m.get('editor_values').merge(Map(p.values)));
        default:
            return m;
    }

}

function fields(state = initial_fields_state, action) {
    const m = Map(state);
    const p = action.payload;
    switch (action.type) {
        case TOGGLE_RENEW_FIELD:
        case REQUEST_FIELD:
        case RECIEVE_FIELD:
        case SHOW_FIELD_MODAL:
        case HIDE_FIELD_MODAL:
            return m.set(p.field.id, field(m.get(p.field.id), action));
        case DELETE_FIELD:
            return m.delete(p.field.id);
        case SET_FIELD_EDITOR_STATE:
        case SET_FIELD_EDITOR_VALUES:
            return m.set(p.id, field(m.get(p.id), action));
        default:
            return m;
    }
}

export default fields