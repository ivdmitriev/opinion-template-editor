import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as PropTypes from "prop-types";
import {Map} from 'immutable'
import Loader from "../components/common/loader";
import {
    destroy_field,
    fetch_field_if_needed,
    set_field_editor_state,
    set_field_editor_values,
    toggle_renew_field, update_field
} from "../actions/fields";
import OpinionFieldQuestion from "../components/template_field/template_field_header";
import ScoreField from "../components/template_field/template_field_score_field";
import OpinionScoreComments from "../components/template_field/template_field_comment";
import Button from 'react-materialize/lib/Button';
import TemplateFieldEditorComponent from "../components/template_field/template_field_editor";
import {toggle_template_renew} from "../actions/templates";

import {convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';



function mapStateToProps(state, ownProps) {
    const {fields} = state;
    return {
        field: fields.get(ownProps.id)
    }
}

class TemplateFieldEditor extends Component {
    constructor(props) {
        super(props);
        this.handle_edit_button = this.handle_edit_button.bind(this);
        this.handle_undo_button = this.handle_undo_button.bind(this);
        this.handle_delete_button = this.handle_delete_button.bind(this);
        this.handle_editor_change = this.handle_editor_change.bind(this);
        this.handle_save_button = this.handle_save_button.bind(this);
    }

    componentDidMount() {
        const dispatch = this.props.dispatch;
        dispatch(fetch_field_if_needed({id: this.props.id}))
    }

    componentDidUpdate() {
        const {dispatch, field} = this.props;
        if (field && field.get('needs_renew')) {
            dispatch(fetch_field_if_needed({id: this.props.id}));
        }
    }

    handle_score_change(ch) {
        console.log(ch)
    }

    handle_edit_button() {
        const dispatch = this.props.dispatch;
        const field_id = this.props.id;
        dispatch(set_field_editor_state(field_id, 'show'));

    }

    handle_undo_button() {
        const dispatch = this.props.dispatch;
        const field_id = this.props.id;
        dispatch(set_field_editor_state(field_id, 'hidden'));
        dispatch(toggle_renew_field({id: field_id}));

    }

    handle_editor_change(obj) {
        const dispatch = this.props.dispatch;
        const field_id = this.props.id;
        dispatch(set_field_editor_values(field_id, obj))
    }

    handle_delete_button() {
        const dispatch = this.props.dispatch;
        const field_id = this.props.id;
        const template_id = this.props.template_id;
        dispatch(destroy_field({id: field_id, opinion_template: template_id}));
        dispatch(toggle_template_renew({id: template_id}));
    }

    handle_save_button() {

        const dispatch = this.props.dispatch;
        const field_id = this.props.id;
        const field = this.props.field;
        const editor_state = field.get('editor_values');
        dispatch(set_field_editor_state(field_id, 'loading'));
        console.log(field.toObject());
        const description_state  = editor_state.get('description_state');
        const description_en_state = editor_state.get('description_en_state');
        const description = draftToHtml(convertToRaw(description_state.getCurrentContent()));
        const description_eng = draftToHtml(convertToRaw(description_en_state.getCurrentContent()));
        const field_data = editor_state.set('description', description).set('description_eng', description_eng)
            .remove('descrip[tion_state').remove('description_en_state').set('id', field_id)
            .set('opinion_template',field.get('opinion_template')).toObject();
        dispatch(update_field({id: field_id}, field_data));
        dispatch(set_field_editor_state(field_id, 'hidden'));


    }

    render() {
        const field = this.props.field;
        if (!field || field.get('is_fetching') === true) {
            return (
                <div>
                    <div className="section">
                        <Loader/>
                    </div>
                    <div className="divider"></div>
                </div>
            )
        }
        const range = field.get('field_range');
        const title = field.get('field_title');
        const title_en = field.get('field_title_en');
        const type = field.get('field_type');
        const description = field.get('description');
        const description_eng = field.get('description_eng');
        const editor_state = field.get('editor_state');
        const editor_values = field.get('editor_values');
        if (editor_state !== 'hidden') {
            return (
                <div className="yellow lighten-4">
                    <div className="section">
                        <div className="right">
                            <Button floating icon={'save'} className={'green'} onClick={this.handle_save_button}/>
                            <Button floating icon={'undo'} className={'orange'} onClick={this.handle_undo_button}/>
                            <Button floating icon={'delete'} className={'red'} onClick={this.handle_delete_button}/>
                        </div>
                        <TemplateFieldEditorComponent editor_values={editor_values} editor_state={editor_state}
                                                      on_edit={this.handle_editor_change}/>
                    </div>
                    <div className="divider"></div>
                </div>
            )
        }
        return (
            <div>
                <br/><br/>
                <div className="section">
                    <div className="right">
                        <Button floating icon={'edit'} className={'orange'} onClick={this.handle_edit_button}/>
                        <Button floating icon={'delete'} className={'red'} onClick={this.handle_delete_button}/>
                    </div>
                    <OpinionFieldQuestion
                        range={range}
                        title={title}
                        title_en={title_en}
                        en={this.props.en}
                        description={description}
                        description_en={description_eng}
                    />
                    <ScoreField score_field_type={type} change_handler={this.handle_score_change} value={""}
                                en={this.props.en}/>
                    <OpinionScoreComments comments_min_length={field.get('comment_min_length')} en={this.props.en}
                                          on_change={this.handle_score_change} comments_html={'None'}/>
                </div>
                <br/><br/><br/>
                <div className="divider"></div>
            </div>
        );
    }
}

TemplateFieldEditor.propTypes = {
    id: PropTypes.number.isRequired,
    template_id: PropTypes.number.isRequired,
    field: PropTypes.instanceOf(Map),
    en: PropTypes.bool.isRequired,
};

export default connect(
    mapStateToProps,
)(TemplateFieldEditor);