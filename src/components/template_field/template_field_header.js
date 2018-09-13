import React, {Component} from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

class OpinionFieldQuestion extends Component {
    render() {
        const {en, range, title, title_en, description, description_en} = this.props;
        let translated_title = en ? title_en : title;
        let translated_description  =  en ? description_en: description;
        let rendered_description = translated_description?renderHTML(translated_description):'NaN';



        return (
            <div className="section">
                <h5>{range}. {translated_title}</h5>
                <div>
                    {rendered_description}
                </div>
            </div>
        );
    }
}

OpinionFieldQuestion.propTypes = {
    range: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    en: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    title_en: PropTypes.string,
    description_en: PropTypes.string,
};

export default OpinionFieldQuestion;