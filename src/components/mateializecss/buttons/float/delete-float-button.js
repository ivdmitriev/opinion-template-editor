import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BasicFloatButton from "./base_float_button";

class DelFloatButton extends Component {
    render() {
        return (
            <BasicFloatButton
                icon={'delete'}
                large={this.props.large}
                color={'red'}
                text_color={'white'}
                on_click={this.props.on_click}
                depth={2}
            />
        );
    }
}

DelFloatButton.propTypes = {
    on_click: PropTypes.func.isRequired,
    large: PropTypes.bool.isRequired,
};

export default DelFloatButton;