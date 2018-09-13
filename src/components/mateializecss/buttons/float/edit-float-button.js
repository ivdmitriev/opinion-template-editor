import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BasicFloatButton from "./base_float_button";

class EditFloatButton extends Component {
    render() {
        return (
            <BasicFloatButton
                icon={'edit'}
                large={this.props.large}
                color={'orange'}
                text_color={'white'}
                on_click={this.props.on_click}
                depth={2}
            />
        );
    }
}

EditFloatButton.propTypes = {
    on_click: PropTypes.func.isRequired,
    large: PropTypes.bool.isRequired,
};

export default EditFloatButton;