import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SaveFloatButton from "./mateializecss/buttons/float/save-float-button";
import DelFloatButton from "./mateializecss/buttons/float/delete-float-button";
import EditFloatButton from "./mateializecss/buttons/float/edit-float-button";

class TemplateEditForm extends Component {
    render() {
        const {edit_onclick, edit_mode, delete_onclick, save_onclick, template_name, comment_min_length} =this.props;
        if (edit_mode === true) {
            return (
                <div className="card-content">
                    <div className="row">
                        <div className="col l10 m 10 s12">
                            <div className="h5-inline-editor">
                                <span className="strong">Название шаблона: </span>
                                <div className="input-field inline">
                                    <input className="inline" type="text" value={template_name}/>
                                </div>
                            </div>
                            <div className="h6-inline-editor">
                                <span className="strong">Минимальная длина рецензии:</span>
                                <div className="input-field inline">
                                    <input className="inline" type="text" value={comment_min_length}/>
                                </div>
                            </div>

                        </div>
                        <div className="col l2 m2 s 12">
                            <div className="right valign-wrapper" style="height: 100%">
                                <SaveFloatButton on_click={save_onclick} large={true}/>
                                <DelFloatButton on_click={delete_onclick} large={true}/>
                            </div>

                        </div>
                    </div>

                </div>
            )
        }
        return (
            <div className="card-content">
                <div className="row">
                    <div className="col l10 m 10 s12">
                        <div className="h5-inline-editor">
                            <span className="strong">Название шаблона: </span>
                            {template_name}
                        </div>
                        <div className="h6-inline-editor">
                            <span className="strong">Минимальная длина рецензии:</span>
                            {comment_min_length}
                        </div>

                    </div>
                    <div className="col l2 m2 s 12">
                        <div className="right valign-wrapper" style="height: 100%">
                            <EditFloatButton on_click={edit_onclick} large={true}/>
                            <DelFloatButton on_click={delete_onclick} large={true}/>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}

TemplateEditForm.propTypes = {
    edit_onclick: PropTypes.func.isRequired,
    delete_onclick: PropTypes.func.isRequired,
    save_onclick: PropTypes.func.isRequired,
    edit_mode: PropTypes.bool.isRequired,
    template_name: PropTypes.string,
    comment_min_length: PropTypes.number,
};

export default TemplateEditForm;