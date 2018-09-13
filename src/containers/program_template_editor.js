import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {fetch_program_if_needed, toggle_program_creator_state} from "../actions/program";
import Loader from "../components/common/loader";

import TemplateEditor from './template_editor'
import AddFloatButton from "../components/mateializecss/buttons/float/add-float-button";
import TemplateCreator from "./template_creator";

class ProgramTemplateEditor extends Component {
    constructor(props) {
        super(props);
        this.handle_template_add_click = this.handle_template_add_click.bind(this);

    }


    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetch_program_if_needed({id: this.props.program_id}))
    }

    componentDidUpdate(prevProps) {
        const {dispatch, program} =this.props;
        if (program.get('needs_renew')) {
            dispatch(fetch_program_if_needed(program.toObject()))
        }

    }

    handle_template_add_click(){
        this.props.dispatch(toggle_program_creator_state('showed'));
    }


    render() {
        const {program} = this.props;
        if (!program || program.get('is_fetching') || !program.get('opinion_templates')) {
            return (
                <div className="row">
                    <div className="col s12">
                        <nav>
                            <div className="nav-wrapper">
                                <div className="container">
                                    <div className="brand-logo">Редактор шаблонов ЭЗ</div>
                                </div>
                            </div>
                        </nav>
                        <Loader/>
                    </div>
                </div>

            )
        }

        return (
            <div className="container">
                <div className='row'>
                    <div className="col s12">
                        <nav>
                            <div className="nav-wrapper">
                                <div className="container">
                                    <div className="brand-logo">Редактор шаблонов ЭЗ</div>
                                </div>
                                <ul className="right">
                                    <li>{program && program.get('creator_state') === 'hidden' && <AddFloatButton on_click={this.handle_template_add_click} large={false}/>}</li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
                {program && program.get('creator_state') !== 'hidden' && <TemplateCreator/>}
                {program.get('opinion_templates').map(tpl => <TemplateEditor  key={tpl} template_id={tpl}/>)}
            </div>


        );
    }


}

ProgramTemplateEditor.propTypes = {
    program_id: PropTypes.number.isRequired,
    program: PropTypes.object.isRequired,
    error: PropTypes.object,
    program_title: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {program_reducer, templates} = state;
    return {
        program: program_reducer,
        templates: templates
    }
}

export default connect(mapStateToProps)(ProgramTemplateEditor);