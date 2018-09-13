import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BasicFloatButton from "./base_float_button";

class SaveFloatButton extends Component {
    render() {
        return (
            <BasicFloatButton
                icon={'save'}
                large={this.props.large}
                color={'green'}
                text_color={'white'}
                on_click={this.props.on_click}
                depth={2}
            />
        );
    }
}

SaveFloatButton.propTypes = {
    on_click: PropTypes.func.isRequired,
    large: PropTypes.bool.isRequired,
};

export default SaveFloatButton;