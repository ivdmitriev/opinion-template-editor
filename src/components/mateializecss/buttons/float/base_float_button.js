import React, {Component} from 'react';
import PropTypes from 'prop-types';

class BasicFloatButton extends Component {
    render() {
        const {color, on_click, depth, icon, large, text_color} = this.props;
        return (
            <a className={`btn-floating ${large ? 'btn-large' : null} ${color ? color : null} ${depth ? `z-depth-${depth}` : null}
            ${text_color ? `${text_color}-text` : null}`} onClick={on_click}>
                <i className="material-icons">{icon}</i>
            </a>
        );
    }
}

BasicFloatButton.propTypes = {
    color: PropTypes.string,
    on_click: PropTypes.func,
    depth: PropTypes.number,
    icon: PropTypes.string.isRequired,
    large: PropTypes.bool.isRequired,
    text_color: PropTypes.string,

};

export default BasicFloatButton;