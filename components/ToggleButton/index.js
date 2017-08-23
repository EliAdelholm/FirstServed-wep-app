import React, {Component} from 'react';
import Toggle from 'react-toggle'

import './toggle.css';

class ToggleButton extends Component {

    handleChange = () => {
        this.props.onChange();
    };

    render() {

        return (
            <label>
                <Toggle
                    defaultChecked={this.props.isChecked}
                    icons={false}
                    onChange={this.handleChange} />
            </label>
        )
    }
}

export default ToggleButton;

