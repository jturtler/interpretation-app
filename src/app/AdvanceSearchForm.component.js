
import React, { Component } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui/lib/text-field';

export default class AdvanceSearchForm extends Component {
    constructor(props) {
        super(props);

        this.state = { type: '' };
    }

    componentWillReceiveProps(props) {
        //this.setState({ value: props.value });
    }

    _change(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>Type</td>
                        <td>
                            <SelectField
                            value={this.state.type}
                            floatingLabelText = "Type"
                            >
                            <MenuItem value={'ff0000'} primaryText="Red"/>
                            <MenuItem value={'00ff00'} primaryText="Green"/>
                            <MenuItem value={'0000ff'} primaryText="Blue"/>
                            </SelectField>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

AdvanceSearchForm.propTypes = { value: React.PropTypes.string };
AdvanceSearchForm.defaultProps = { value: '' };
