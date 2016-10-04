import React from 'react';
import { MenuItem, AutoComplete } from 'material-ui';
import { delayOnceTimeAction, otherUtils } from './utils';
import { getInstance as getD2 } from 'd2/lib/d2';


const AutoCompleteSearchKeyword = React.createClass({
    propTypes: {
        value: React.PropTypes.any,
        searchId: React.PropTypes.string,
        onSelect: React.PropTypes.func,
        onChange: React.PropTypes.func,
    },

    getInitialState() {
        return {
            value: this.props.value,
            itemList: [],
            loading: false,
            open: false,
            keywordDataSource: [],
            keyword: this.getKeywordObj(),
        };
    },

    getKeywordObj(idInput, textInput) {
        const id = (!idInput) ? '' : idInput;
        const text = (!textInput) ? '' : textInput;
        return { id, text };
    },

    clear() {
        this.setState({ value: '', keyword: this.getKeywordObj() });
    },
    
    collapseMenu() {
        this.setState({ open: false });
    },

    _onUpdatekeywords(value) {

        this.setState({ value, loading: true, open: false });
        // Call back the parent passed in method for change 
        this.props.onChange(event, value);


        delayOnceTimeAction.bind(500, this.props.searchId, () => {
            if (value === '') {
                this.setState({ keywordDataSource: [], keyword: this.getKeywordObj() });
                this.props.onSelect(this.getKeywordObj());
            }
            else {
                getD2().then(d2 => {

                    this.performMultiItemSearch(d2, value, (resultItems, loadType) => {
                        // add to the result
                        console.log( 'FINISHED ONE SEARCH' );
                        console.log( resultItems );

                        const newList = this.combineList(this.state.keywordDataSource, resultItems);

                        otherUtils.removeFromList(newList, 'text', loadType);

                        this.setState({ keywordDataSource: newList });
                    });
                });
            }
        });
    },

    combineList(keywordDataSource, resultItems) {
        const newArray = this.state.keywordDataSource.slice();
        for (const item of resultItems) {
            newArray.push(item);
        }
        return newArray;
    },

    performMultiItemSearch(d2, value, updateItemList) {
        // 1. Favorite Name
        // TODO: SEARCH BY MANY DIFFERENT METHOD!!
        //      1. Favorite Name

        // updateItemList with placeholder of each section first..
        const placeHolderItems = [];
        placeHolderItems.push({ text: 'interpretation', value: <div><img src="./src/images/like.png" /> <span>loading</span></div>, source: { id: '', text: '' } });
        placeHolderItems.push({ text: 'test', value: <div><img src="./src/images/like.png" /> <span>loading</span></div>, source: { id: '', text: '' } });

        updateItemList(placeHolderItems);


        // Replace with loading message..

        const url = `interpretations?paging=false&fields=id,text&filter=text:ilike:${value}`;

        d2.Api.getApi().get(url).then(result => {
            const keywordList = [];

            for (const item of result.interpretations) {
                const source = this.getKeywordObj(item.id, item.text);
                keywordList.push({ text: source.text, value: <MenuItem primaryText={source.text} value={source.id} />, source });
            }

            updateItemList(keywordList, 'interpretation');
        });

        setTimeout(() => {
            const newVal = '7777';
            const url2 = `interpretations?paging=false&fields=id,text&filter=text:ilike:${newVal}`;

            d2.Api.getApi().get(url2).then(result => {
                const keywordList = [];

                for (const item of result.interpretations) {
                    const source = this.getKeywordObj(item.id, item.text);
                    keywordList.push({ text: source.text, value: <MenuItem primaryText={source.text} value={source.id} />, source });
                }

                updateItemList(keywordList, 'test');
            });
        }, 2000);
    },

    _onSelectkeyword(value, i) {
        if (i === undefined) {
            // Enter Key was pressed without selection
            this.props.onSelect(this.getKeywordObj('', value));
        }
        else {
            // Set real keyword here with setstate!!
            this.state.keyword = this.state.keywordDataSource[i].source;
            this.props.onSelect(this.state.keyword);
        }
    },

    render() {
        return (
            <AutoComplete hintText="Search Interpretation"
                filter={AutoComplete.noFilter}
                onUpdateInput={this._onUpdatekeywords}
                onNewRequest={this._onSelectkeyword}
                dataSource={this.state.keywordDataSource}
                fullWidth
                searchText={this.state.value}
            />
        );
    },
});

export default AutoCompleteSearchKeyword;
