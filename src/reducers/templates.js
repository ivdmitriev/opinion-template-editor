import {Map} from 'immutable'
import {
    DELETE_TEMPLATE,

    RECIEVE_TEMPLATE,
    REQUEST_TEMPLATE, SET_FIELD_CREATOR_STATE, SET_FIELD_CREATOR_VALUES,
    SWITCH_LANG, TEMPLATE_EDITOR_CHANGE,
    TOGGLE_RENEW_TEMPLATE, TOGGLE_TEMPLATE_EDITOR_STATE
} from "../actions/types";

const initial_template_state = {
    is_fetching: true,
    needs_renew: false,
    editor_state: 'hidden',
    editor_values: Map({title: null, review_min_length: null}),
    field_creator_state: 'hidden',
    field_creator_values: Map({
        field_range: null,
        field_type: 'boolean',
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

const initial_templates_state = {};

function template(state = initial_template_state, action) {
    const m = Map(state);
    const p = action.payload;
    switch (action.type) {
        case TOGGLE_RENEW_TEMPLATE:
            return m.set('needs_renew', true);
        case REQUEST_TEMPLATE:
            return m.set('needs_renew', false).set('is_fetching', true);
        case RECIEVE_TEMPLATE:
            return m.set('is_fetching', false).merge(p.json);
        case SWITCH_LANG:
            if (m.get('current_lang') === 'en') {
                return m.set('current_lang', 'ru')
            } else {
                return m.set('current_lang', 'en')
            }
        case TOGGLE_TEMPLATE_EDITOR_STATE:
            return m.set('editor_state', p.state);
        case TEMPLATE_EDITOR_CHANGE:
            return m.set('editor_values', m.get('editor_values').merge(p.changes));
        case SET_FIELD_CREATOR_STATE:
            return m.set('field_creator_state', p.state);
        case SET_FIELD_CREATOR_VALUES:
            return m.set('field_creator_values', m.get('field_creator_values').merge(Map(p.values)));
        default:
            return m;
    }
}

function templates(state = initial_templates_state, action) {
    const m = Map(state);
    const p = action.payload;
    switch (action.type) {
        case TOGGLE_RENEW_TEMPLATE:
        case REQUEST_TEMPLATE:
        case RECIEVE_TEMPLATE:
        case SWITCH_LANG:
        case TOGGLE_TEMPLATE_EDITOR_STATE:
            return m.set(p.opinion_template.id, template(m.get(p.opinion_template.id), action));
        case TEMPLATE_EDITOR_CHANGE:
        case SET_FIELD_CREATOR_STATE:
        case SET_FIELD_CREATOR_VALUES:
            return m.set(p.id, template(m.get(p.id), action));
        case DELETE_TEMPLATE:
            return m.delete(p.opinion_template.id);
        default:
            return m;
    }
}

export default templates;