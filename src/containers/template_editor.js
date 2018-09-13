import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loader from "../components/common/loader";
import * as PropTypes from "prop-types";
import EditFloatButton from "../components/mateializecss/buttons/float/edit-float-button";
import SaveFloatButton from "../components/mateializecss/buttons/float/save-float-button";
import DelFloatButton from "../components/mateializecss/buttons/float/delete-float-button";
import Collapsible from 'react-materialize/lib/Collapsible';
import CollapsibleItem from 'react-materialize/lib/CollapsibleItem';
import Input from 'react-materialize/lib/Input';
import Button from 'react-materialize/lib/Button';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import {
    destroy_template,
    editor_state_act, fetch_template_if_needed, set_field_creator_state, set_field_creator_values,
    toggle_template_editor_state,
    toggle_template_lang, toggle_template_renew, update_template
} from "../actions/templates";
import renderHTML from 'react-render-html';
import ToolBarConfig from "../components/common/draft_wysiwyg_toolbar_conf";
import TemplateFieldEditor from "./field_editor";
import {create_field} from "../actions/fields";
import TemplateFieldCreator from "../components/template_field/template_field_creator";


function mapStateToProps(state, ownProps) {
    const {program_reducer, templates} = state;
    const template = templates.get(ownProps.template_id);
    return {
        program: program_reducer,
        template: template,
    };
}


class TemplateEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            review_text: '',
            review_text_length: 0
        };
        this.handle_switch_lang = this.handle_switch_lang.bind(this);
        this.hande_delete = this.hande_delete.bind(this);
        this.handle_review_change = this.handle_review_change.bind(this);
        this.handle_editor_change = this.handle_editor_change.bind(this);
        this.hande_edit = this.hande_edit.bind(this);
        this.handle_undo = this.handle_undo.bind(this);
        this.handle_save = this.handle_save.bind(this);
        this.handle_field_creator_change = this.handle_field_creator_change.bind(this);
        this.handle_field_creator_edit = this.handle_field_creator_edit.bind(this);
        this.handle_field_creator_undo = this.handle_field_creator_undo.bind(this);
        this.handle_fieldcreator_save = this.handle_fieldcreator_save.bind(this);
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetch_template_if_needed({id: this.props.template_id}))
    }

    componentDidUpdate(prevProps) {
        const {dispatch, template} = this.props;
        if (template.get('needs_renew')) {
            dispatch(fetch_template_if_needed({id: this.props.template_id}))
        }
    }

    handle_switch_lang() {
        this.props.dispatch(toggle_template_lang(this.props.template.toObject()))
    }

    hande_edit() {
        const dispatch = this.props.dispatch;
        const template = this.props.template;
        const title = template.get('title');
        const review_min_length = template.get('review_min_length');
        dispatch(editor_state_act(template.get('id'), {title: title, review_min_length: review_min_length}));
        dispatch(toggle_template_editor_state(template.toObject(), 'show'));
    }

    handle_editor_change(e) {
        const dispatch = this.props.dispatch;
        const sender = e.target.name;
        const value = e.target.value;
        const template = this.props.template;
        dispatch(editor_state_act(this.props.template.get('id'), {[sender]: value}));
        dispatch(toggle_template_editor_state(template.toObject(), 'edited'));

    }

    handle_undo() {
        const dispatch = this.props.dispatch;
        const template = this.props.template;
        const title = template.get('title');
        const review_min_length = template.get('review_min_length');
        dispatch(editor_state_act(template.get('id'), {title: title, review_min_length: review_min_length}));
        dispatch(toggle_template_editor_state(template.toObject(), 'hidden'));
    }

    handle_save() {
        const template = this.props.template;
        const dispacth = this.props.dispatch;
        const data = {
            id: this.props.template_id,
            program: template.get('program'),
            title: template.get('editor_values').get('title'),
            review_min_length: template.get('editor_values').get('review_min_length'),
        };
        dispacth(toggle_template_editor_state(template.toObject(), 'exchanging_data'));
        dispacth(update_template(template.toObject(), data));
    }

    hande_delete() {
        this.props.dispatch(destroy_template(this.props.template.toObject()))
    }

    handle_review_change(editor_state) {
        this.setState({
            review_text_length: editor_state.getCurrentContent().getPlainText().length
        })
    }

    handle_field_creator_edit(){
        const dispatch = this.props.dispatch;
        const template_id = this.props.template_id;
        dispatch(set_field_creator_state(template_id, 'shown'));
    }

    handle_field_creator_change(obj){
        const dispatch = this.props.dispatch;
        const template_id = this.props.template_id;
        dispatch(set_field_creator_values(template_id, obj));
    };

    handle_field_creator_undo(){
        const dispatch = this.props.dispatch;
        const template_id = this.props.template_id;
        dispatch(set_field_creator_state(template_id, 'hidden'));
    }
    handle_fieldcreator_save(){
        const dispatch = this.props.dispatch;
        const template_id = this.props.template_id;
        const creator_values = this.props.template.get('field_creator_values');
        dispatch(set_field_creator_state(template_id, 'loading'));
        const description_state = creator_values.get('description_state');
        const description_en_state = creator_values.get('description_en_state');
        const description = draftToHtml(convertToRaw(description_state.getCurrentContent()));
        const description_en = draftToHtml(convertToRaw(description_en_state.getCurrentContent()));
        const data_map = creator_values.delete('description_state').delete('description_en_state').set('description', description)
            .set('description_eng', description_en).set('opinion_template', template_id).toObject();
        dispatch(create_field(data_map));
        dispatch(set_field_creator_state(template_id, 'hidden'));
        dispatch(toggle_template_renew({id:template_id}));
    };

    render() {
        const {template, program} = this.props;
        if (! template || template.get('is_fetching') !== false) {


            return (
                <div className="row">
                    <div className="col s12">
                        <div className="card">
                            <div className="card-content">
                                <Loader/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        const template_title = template.get('title');
        const template_review_length = template.get('review_min_length');
        const editor_state = template.get('editor_state');
        let editor_value_title = template.get('editor_values').get('title');
        let editor_value_review_length = template.get('editor_values').get('review_min_length');
        editor_value_title = editor_value_title ? editor_value_title : template_title;
        editor_value_review_length = editor_value_review_length ? editor_value_review_length : template_review_length;
        const en = template.get('current_lang') === 'en';
        const field_creator_state = template.get('field_creator_state');
        const field_creator_values = template.get('field_creator_values');
        return (
            <div className={'row'}>
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <div className={`row ${editor_state === 'edited' ? 'yellow lighten-4' : 'grey lighten-3'}`}>
                                <div className="col s12 l10 m10">
                                    {editor_state === 'hidden' ? (

                                            <h5>{template_title}</h5>
                                        ) :
                                        <div className="row">
                                            <Input type={'text'} s={12} l={10} m={10}
                                                   onChange={this.handle_editor_change}
                                                   label={'Название шаблона'}
                                                   value={editor_value_title}
                                                   name={'title'}
                                            />
                                            <Input type={'number'} s={12} l={2} m={2}
                                                   onChange={this.handle_editor_change}
                                                   label={'Минимальная длина комментариев'}
                                                   value={editor_value_review_length}
                                                   name={'review_min_length'}
                                            />
                                        </div>
                                    }

                                </div>
                                <div className="col l2 m2 s12">
                                    <div className="right">
                                        {editor_state === 'hidden' &&
                                        <EditFloatButton on_click={this.hande_edit} large={false}/>
                                        }
                                        {editor_state !== 'hidden' &&
                                        <SaveFloatButton on_click={this.handle_save} large={false}/>
                                        }
                                        {editor_state !== 'hidden' &&
                                        <Button floating large={false} icon={'undo'} className={'orange'}
                                                onClick={this.handle_undo}
                                        />
                                        }
                                        <DelFloatButton on_click={this.hande_delete} large={false}/>
                                    </div>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="row">
                                <div className="col s12">
                                    <div className="section">
                                        <div className="right">
                                            <a onClick={this.handle_switch_lang}
                                               className="btn green white-text">{en ? 'Переключить на русский' : 'Switch to English'}</a>
                                        </div>

                                        <h4>{en ? 'Expert opinion' : 'Экспертное заключение'}</h4>
                                    </div>
                                    <Collapsible>
                                        <CollapsibleItem header={en ? 'Details' : 'Сведения'}>
                                            <div className="divider"></div>
                                            <div className="section">
                                                <h5>{en ? 'Program details' : 'Сведения о конкурсе'}</h5>
                                                <Collapsible>
                                                    {program.get('regulations') && <CollapsibleItem
                                                        header={en ? 'Program terms & conditions' : 'Правила проведения программы'}
                                                    >{renderHTML(program.get('regulations'))}</CollapsibleItem>}
                                                    <CollapsibleItem
                                                        header={en ? 'Privacy policy' : 'Политика конфеденциальности'}>
                                                        {renderHTML(program.get('privacy_policy'))}</CollapsibleItem>
                                                </Collapsible>
                                            </div>
                                            <div className="divider"></div>
                                            <div className="section">
                                                <h5>{en ? 'Project details' : 'Сведения о проекте'}</h5>
                                                <p><span
                                                    className="strong">{en ? 'Project title' : 'Название проекта'}: </span>{en ? 'Project title' : 'Название проекта'}
                                                </p>
                                                <p><span
                                                    className="strong">{en ? 'Project author' : 'Заявитель'}: </span>{en ? 'Project title' : 'Название проекта'}
                                                </p>
                                            </div>
                                            <div className="divider">
                                            </div>
                                            <div className="section">
                                                <h5>{en ? 'Project attachements' : 'Приложения к проекту'}</h5>
                                                <div className="chip green white-text z-depth-3">
                                                    <i className="material-icons left">archive</i>
                                                    Текст заявки
                                                </div>

                                            </div>
                                        </CollapsibleItem>
                                    </Collapsible>
                                    <div className="divider"></div>

                                    <div className="section">
                                        <h5>{en ? 'Ranking criterias' : 'Критерии оценки'}</h5>
                                        <div>
                                            {renderHTML(en ? program.get('ranking_criterias_description_en') ? program.get('ranking_criterias_description_en') : 'null' : program.get('ranking_criterias_description'))}
                                        </div>
                                    </div>
                                    <div className="divider"></div>
                                    <div className="section">
                                        <TemplateFieldCreator
                                            creator_state={field_creator_state}
                                            creator_values={field_creator_values}
                                            editor_change={this.handle_field_creator_change}
                                            add_click={this.handle_field_creator_edit}
                                            undo_click={this.handle_field_creator_undo}
                                            save_click={this.handle_fieldcreator_save}
                                        />
                                    </div>
                                    <div className="divider"></div>
                                    {template.get('template_fields').map(fld => <TemplateFieldEditor key={fld} id={fld} template_id={this.props.template_id} en={en}/>)}
                                    <div className="section">
                                        <h5>Рецензия эксперта
                                            ({this.state.review_text_length}/{template.get('review_min_length')})</h5>
                                        <div>
                                            {renderHTML(en ? program.get('review_description_en') ? program.get('review_description_en') : 'null' : program.get('review_description'))}
                                        </div>
                                        <div className="section">
                                            <h6>{en ? 'Input review in the field below (expandable)' : 'Введите текст в поле ниже (расширяется в зависимости от количества строк)'}</h6>
                                            <div className='grey lighten-3 container'>
                                                <Editor toolbar={ToolBarConfig} onEditorStateChange={this.handle_review_change}/>
                                            </div>
                                        </div>



                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className="card-action right-align">
                            <a className={'btn green white-text'}>{en ? 'Save' : 'Сохранить'}</a>
                            <a className={'btn green white-text'}>{en ? 'Send opinion' : 'Отправить заключение'}</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TemplateEditor.propTypes = {
    template_id: PropTypes.number.isRequired,
    editor_state: PropTypes.string,
    program: PropTypes.object,
    current_lang: PropTypes.string,
    template: PropTypes.object,
};

export default connect(
    mapStateToProps,
)(TemplateEditor);