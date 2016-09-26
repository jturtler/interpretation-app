
import React from 'react';
import Autocomplete from 'react-autocomplete';
import { delayOnceTimeAction } from './utils';
import { getInstance as getD2 } from 'd2/lib/d2';

const autoSearchStyles = {
    item: {
        padding: '2px 6px',
        cursor: 'default',
    },
    highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '2px 6px',
        cursor: 'default',
    },
    menu: {
        border: 'solid 1px #ccc',
    },
};

const AutoCompleteSearchKeyword = React.createClass({
    propTypes: {
        userType: React.PropTypes.string,
        onUserSelect: React.PropTypes.func,
    },

    getInitialState() {
        return {
            value: '',
            itemList: [],
            loading: false,
        };
    },

    render() {
        return (
            <div className="divAuthorSelector">
                <Autocomplete
                    className="searchStyle author"
                    inputProps={{ text: 'Type Keyword', id: '' }}
                    ref="autocomplete"
                    value={this.state.value}
                    items={this.state.itemList}
                    getItemValue={(item) => item.text}
                    onSelect={(value, item) => {
                        this.setState({ value, itemList: [item] });
                        this.props.onUserSelect(item);
                    }}
                    onChange={(event, value) => {
                        this.setState({ value, loading: true });

                        delayOnceTimeAction.bind(700, this.props.userType, () => {
                            getD2().then(d2 => {
                                const url = `interpretations?paging=false&fields=id,text&filter=text:ilike:${value}`;

                                d2.Api.getApi().get(url).then(result => {
                                    this.setState({ itemList: result.interpretations, loading: false });
                                })
                                .catch(errorResponse => {
                                    console.log(`error ${errorResponse}`);
                                });
                            });
                        });
                    }}
                    renderItem={(item, isHighlighted) => (
                        <div style={isHighlighted ? autoSearchStyles.highlightedItem : autoSearchStyles.item}
                            key={item.id}
                            id={item.id}
                        >{item.text}</div>
                    )}
                />
            </div>
        );
    },
});

export default AutoCompleteSearchKeyword;
