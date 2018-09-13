import React, {Component} from 'react';
import {connect} from 'react-redux';
import {program_creator_errors_clean, toggle_program_creator_state} from "../actions/program";
import {create_template} from "../actions/templates";
import SaveFloatButton from "../components/mateializecss/buttons/float/save-float-button";
import DelFloatButton from "../components/mateializecss/buttons/float/delete-float-button";
import Loader from "../components/common/loader";

function mapStateToProps(state) {
    const {program_reducer} = state;
    const program = program_reducer;

    return {
        creator_state: program.get('creator_state'),
        program_id: program.get('id'),
        creator_errors: program.get('creator_errors'),
    };
}

class TemplateCreator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            template_name: '',
            comments_min_length: 0
        };
        this.handle_comments_min_length_change = this.handle_comments_min_length_change.bind(this);
        this.handle_template_name_change = this.handle_template_name_change.bind(this);
        this.handle_delete_click = this.handle_delete_click.bind(this);
        this.handle_save_click = this.handle_save_click.bind(this);
    }

    handle_template_name_change(e) {
        this.setState({template_name: e.target.value});
        this.props.dispatch(toggle_program_creator_state('edited'));
    }

    handle_comments_min_length_change(e) {
        this.setState({comments_min_length: e.target.value});
        this.props.dispatch(toggle_program_creator_state('edited'));
    }

    handle_save_click() {
        const template_data = {
            program: this.props.program_id,
            title: this.state.template_name,
            review_min_length: this.state.comments_min_length
        };
        this.props.dispatch(create_template(template_data));
    }

    handle_delete_click(){
        this.props.dispatch(program_creator_errors_clean());
        this.props.dispatch(toggle_program_creator_state('hidden'));
    }


    render() {
        const { creator_errors } = this.props;
        if (this.props.creator_state === 'exchanging_data') {
            return (
                <div className="row">
                    <div className="col s12">
                        <div className={`card`}>
                            <div className="card-content">
                                <Loader/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="row">
                <div className="col s12">
                    <div className={`card ${this.props.creator_state === 'edited'?'yellow ligthen-4':''}`}>
                        <div className="card-content">
                            <div className="row">
                                <div className="col l10 m 10 s12">
                                    <div className="h5-inline-editor">
                                        <span className="strong">Название шаблона: </span>
                                        <div className="input-field inline">
                                            <input type="text" value={this.state.template_name} onChange={this.handle_template_name_change}/>
                                        </div>

                                    </div>
                                    {creator_errors && creator_errors.title?creator_errors.title.map(function (err) {
                                        return (
                                            <div className="card red">
                                                <div className="card-content white-text">
                                                    <p>{err}</p>
                                                </div>
                                            </div>
                                        )
                                    }):''}
                                    <div className="h6-inline-editor">
                                        <span className="strong">Минимальная длина рецензии:</span>
                                        <div className="input-field inline">
                                            <input type="number" value={this.state.comment_min_length} onChange={this.handle_comments_min_length_change}/>
                                        </div>
                                    </div>

                                </div>
                                <div className="col l2 m2 s 12">
                                    <div className="right valign-wrapper">
                                        <SaveFloatButton on_click={this.handle_save_click} large={true}/>
                                        <DelFloatButton on_click={this.handle_delete_click} large={true}/>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(TemplateCreator);