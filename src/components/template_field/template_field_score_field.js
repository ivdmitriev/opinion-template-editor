import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Input from 'react-materialize/lib/Input'


class ScoreField extends Component {
    constructor(props){
        super(props);
        this.handle_score_change = this.handle_score_change.bind(this);
    }

    handle_score_change(e){
        const {score_field_type, change_handler} = this.props;
        const target_field = score_field_type === 'text' ? 'text_score' : 'numeric_score' ;
        change_handler({[target_field]:e.target.value})
    }

    render() {
        const {score_field_type, value,en } = this.props;
        switch (score_field_type) {
            case 'boolean':
                return (
                    <div className="section">
                        <h6>{`${en?'Choose between YES or NO':'Выберите ДА или НЕТ'}`}:</h6>
                        <Input s={12} type='select' value={value} onChange={this.handle_score_change}>
                            <option value="0">{en?'NO':'НЕТ'}</option>
                            <option value="1">{en?'YES':'ДА'}</option>
                        </Input>
                    </div>

                );
            case 'score':
                return (
                    <div className="section">
                        <h6>{`${en?'Select score below':'Выберите оценку'}`}:</h6>
                        <Input s={12} type='select' value={value} onChange={this.handle_score_change}>
                            {Array.from(Array(10).keys()).map(i => (<option value={i}>{i}</option>))}
                        </Input>
                    </div>

                );
            case 'text':
            default:
                return (
                    <div className="section">
                        <h6>{`${en?'Enter yout answer':'Введите ответ на вопрос'}`}:</h6>
                        <Input s={12} type='text' value={value} onChange={this.handle_score_change}/>
                    </div>
                )

        }
    }
}

ScoreField.propTypes = {
    score_field_type: PropTypes.oneOf(['boolean', 'score', 'text']).isRequired,
    change_handler: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    en: PropTypes.bool.isRequired,
};

export default ScoreField;