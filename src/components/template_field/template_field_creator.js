import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable'
import Loader from "../common/loader";
import Button from 'react-materialize/lib/Button';
import Icon from 'react-materialize/lib/Icon';
import TemplateFieldEditorComponent from "./template_field_editor";

class TemplateFieldCreator extends Component {
    render() {
        const creator_state = this.props.creator_state;
        switch (creator_state) {
            case 'hidden':
                const add_click = this.props.add_click;
                return (
                    <div className="section">
                        <br/>
                        <div className="right">
                            <Button onClick={add_click} className={"green"} icon={'add'} large={false} floating/>
                        </div>
                        <h5>Добавить поле</h5>
                        <br/>
                    </div>
                );
            case 'shown':
                const save_click = this.props.save_click;
                const undo_click = this.props.undo_click;
                const creator_values = this.props.creator_values;
                const editor_change = this.props.editor_change;
                return (
                    <div className="section">
                        <div className="row">
                            <div className="col s12">
                                <div className="right">
                                    <Button onClick={undo_click} className={"orange"} icon={'edit'} large={false} floating/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <TemplateFieldEditorComponent editor_values={creator_values} editor_state={creator_state} on_edit={editor_change}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <div className="right">
                                    <Button waves="light" className="green" onClick={save_click}>
                                        <Icon left>save</Icon>
                                        Сохранить
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return (<Loader/>)

        }
    }
}

TemplateFieldCreator.propTypes = {
    creator_state: PropTypes.oneOf(['hidden', 'shown', 'loading']).isRequired,
    creator_values: PropTypes.instanceOf(Map).isRequired,
    editor_change: PropTypes.func.isRequired,
    add_click: PropTypes.func.isRequired,
    undo_click: PropTypes.func.isRequired,
    save_click: PropTypes.func.isRequired,
};

export default TemplateFieldCreator;