
import React from 'react';
//import Autocomplete from 'react-autocomplete';
import { MenuItem, AutoComplete } from 'material-ui';
import { delayOnceTimeAction } from './utils';
import { getInstance as getD2 } from 'd2/lib/d2';


const AutoCompleteUsers = React.createClass({
    propTypes: {
        searchId: React.PropTypes.string,
        value: React.PropTypes.string,
        item: React.PropTypes.object,
    },

    getInitialState() {
        return {
            value: this.props.item.displayName,
            itemList: [],
            loading: false,
            open: false,
            authorDataSource: [],
            author: { id: '', displayName: '' },
        };
    },

    _onUpdateAuthors(value) {
        // this.setState({ value, loading: true, open: false });
        delayOnceTimeAction.bind(700, this.props.searchId, () => {
            if (value === '') {
                this.setState({ authorDataSource: [], author: { id: '', displayName: '' } });

                this.props.item.id = '';
                this.props.item.displayName = '';
            }
            else {
                getD2().then(d2 => {
                    const url = `users.json?paging=false&fields=id,displayName,userCredentials[username]&filter=name:ilike:${value}`;

                    d2.Api.getApi().get(url).then(result => {
                        const authorList = [];

                        for (const user of result.users) {
                            const source = { id: user.id, displayName: `${user.displayName} (${user.userCredentials.username})` };
                            authorList.push({ text: source.displayName, value: <MenuItem primaryText={source.displayName} value={source.id} />, source });
                        }

                        this.setState({ authorDataSource: authorList });
                    })
                    .catch(errorResponse => {
                        console.log(`error ${errorResponse}`);
                    });
                });
            }
        });
    },

    _onSelectAuthor(value, i) {
        console.log( value );
        console.log( i );
        console.log( this.state.authorDataSource[i].source );
        // Set real author here with setstate!!
        this.state.author = this.state.authorDataSource[i].source;
        this.props.item.id = this.state.author.id;
        this.props.item.displayName = this.state.author.displayName;
    },

    render() {
        return (
            <AutoComplete hintText="Enter User Name"
                filter={AutoComplete.noFilter}
                onUpdateInput={this._onUpdateAuthors}
                onNewRequest={this._onSelectAuthor}
                dataSource={this.state.authorDataSource}
            />
        );
    },
});

export default AutoCompleteUsers;
