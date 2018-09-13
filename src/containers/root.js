import configureStore from "../store";
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import ProgramTemplateEditor from "./program_template_editor";

const store = configureStore();


export default class Root extends Component {


    render(){
        return (
            <Provider store={store}>
                <ProgramTemplateEditor program_id={this.props.program_id}/>
            </Provider>
        )
    }
    
}

