import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from "../common/loader";
import Input from "react-materialize/lib/Input";
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ToolBarConfig from "../common/draft_wysiwyg_toolbar_conf";
import {Map} from 'immutable'

class TemplateFieldEditorComponent extends Component {
    constructor(props) {
        super(props);
        this.handle_change_common = this.handle_change_common.bind(this);
        this.handle_change_description = this.handle_change_description.bind(this);
        this.handle_change_description_en = this.handle_change_description_en.bind(this);
    }

    handle_change_common(e) {
        const on_edit = this.props.on_edit;
        const ftitle = e.target.name;
        const fvalue = e.target.value;
        on_edit({[ftitle]: fvalue})
    }

    handle_change_description(state){
        const on_edit = this.props.on_edit;
        on_edit({description_state: state})
    }

    handle_change_description_en(state){
        const on_edit = this.props.on_edit;
        on_edit({description_en_state: state})
    }


    render() {
        const {editor_values, editor_state,} = this.props;
        if (editor_state === 'loading') {
            return (<div className="row">
                <div className="col s12">
                    <Loader/>
                </div>
            </div>)
        }

        const {
            field_range,
            field_type,
            field_title,
            field_title_en,
            comment_min_length,
            description_state,
            description_en_state,
        } = editor_values.toObject();

        return (
            <div className='container'>
                <div className="row">
                    <h6>Номер вопроса, длина комментариев</h6>
                    <Input
                        s={6}
                        type={'number'}
                        name={'field_range'}
                        value={field_range}
                        label={'№ вопроса'}
                        onChange={this.handle_change_common}
                    />
                    <Input
                        s={6}
                        type={'number'}
                        name={'comment_min_length'}
                        value={comment_min_length}
                        label={'Мин. коммент.'}
                        onChange={this.handle_change_common}
                    />
                </div>
                <div className="row">
                    <h6>Тип вопроса</h6>
                    <Input s={12} type={'select'} value={field_type} name={'field_type'} defaultValue={'boolean'}
                           onChange={this.handle_change_common}>
                        <option value="boolean">ДА/НЕТ</option>
                        <option value="score">Оценка от 1 до 10</option>
                        <option value="text">Текстовое поле для оценки</option>
                    </Input>
                </div>
                <div className="row">
                    <h6>Текст вопроса</h6>
                    <Input
                        s={12}
                        type={'text'}
                        name={'field_title'}
                        value={field_title}
                        label={'Рус.'}
                        onChange={this.handle_change_common}
                    />
                    <Input
                        s={12}
                        type={'text'}
                        name={'field_title_en'}
                        value={field_title_en}
                        label={'Eng.'}
                        onChange={this.handle_change_common}
                    />
                </div>
                <div className="row">
                    <div className="col s12">
                        <h6>Описание вопроса</h6>
                    </div>
                    <div className="col s12 grey lighten-4">
                        <div className="container">
                            <Editor
                                editorState={description_state}
                                toolbar={ToolBarConfig}
                                onEditorStateChange={this.handle_change_description}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <h6>Описание вопроса (Eng.)</h6>
                    </div>
                    <div className="col s12 grey lighten-4">
                        <div className="container">
                            <Editor
                                editorState={description_en_state}
                                toolbar={ToolBarConfig}
                                onEditorStateChange={this.handle_change_description_en}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TemplateFieldEditorComponent.propTypes = {
    editor_values: PropTypes.instanceOf(Map).isRequired,
    editor_state: PropTypes.string.isRequired,
    on_edit: PropTypes.func.isRequired,
};

export default TemplateFieldEditorComponent;