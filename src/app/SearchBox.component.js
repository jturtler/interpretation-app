import React, { Component } from 'react';
import { TextField } from 'material-ui';
import Modal from 'react-modal';
import AdvanceSearchForm from './AdvanceSearchForm.component';
import AutoCompleteSearchKeyword from './AutoCompleteSearchKeyword.component';

const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    content: {
        position: 'absolute',
        top: '100px',
        left: '20px',
        right: 'auto',
        bottom: 'auto',
        width: '500px',
        'box-shadow': '3px 3px 2px #DDD',
        'font-size': '13px !important',
    },
};

export default class SearchBox extends Component {
    constructor(props) {
        super(props);

        this.state = { value: props.value, open: false, searchList: [] };

        this._change = this._change.bind(this);
        this._clickPerformSearch = this._clickPerformSearch.bind(this);
        this._handleOpenAdvancedSearch = this._handleOpenAdvancedSearch.bind(this);
        this._handleCloseAdvancedSearch = this._handleCloseAdvancedSearch.bind(this);
        this._handleAdvancedSearch = this._handleAdvancedSearch.bind(this);
        this._keyDown = this._keyDown.bind(this);
        this._clickTest = this._clickTest.bind(this);

        this._handleKeywordAutoSearch = this._handleKeywordAutoSearch.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ value: props.value });
    }

    _change(e) {
        this.setState({ value: e.target.value });
    }

    _clickPerformSearch() {
        this.props.onChangeEvent({ keyword: this.state.value });
    }

    _handleOpenAdvancedSearch() {
        console.log('_handleOpen_AdvancedSearch');

        const offSet = $('div.searchDiv').offset();

        customStyles.content.top = `${Number(offSet.top) + 45}px`;
        customStyles.content.left = `${offSet.left}px`;

        this.setState({ open: true });
    }

    _handleCloseAdvancedSearch() {
        console.log('_handleClose_AdvancedSearch');
        this.setState({ open: false });
    }

    _handleAdvancedSearch() {
        // get data from ref.        
        const moreTerms = this.refs.advancedSearchForm.getSearchConditions();

        // Call back with search term and keyword
        this.props.onChangeEvent({ keyword: this.state.value, moreTerms });

        this.setState({ open: false });
    }

    _handleKeywordAutoSearch() {
        // console.log( '_handleKeywordAutoSearch' );
    }

    _clickTest() {
        console.log('_clickTest');
        this.setState({ open: false });
    }

    _keyDown(e) {
        if (e.keyCode === 13) {
            console.log( 'keydown: ' + this.state.value );
            this.props.onChangeEvent({ keyword: this.state.value });
        }
    }

    render() {
        const errorStyle = {
            lineHeight: this.props.multiLine ? '48px' : '12px',
            marginTop: this.props.multiLine ? -16 : 0,
        };

        return (
            <div className="searchDiv">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#BBB" height="36" viewBox="0 0 24 24" width="36" className="searchImg" onClick={this._clickPerformSearch}>
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>
                <TextField errorStyle={errorStyle} {...this.props} value={this.state.value} onChange={this._change} style={{ width: 350 }} onKeyDown={this._keyDown} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="#BBB" height="36" viewBox="0 0 24 24" width="36" className="searchImg" onClick={this._handleOpenAdvancedSearch}>
                    <path d="M7 10l5 5 5-5z"></path>
                    <path d="M0 0h24v24H0z" fill="none"></path>
                </svg>

                <Modal
                    isOpen={this.state.open}
                    onRequestClose={this._handleCloseAdvancedSearch}
                    style={customStyles}
                    shouldCloseOnOverlayClick={true}>
                    <AdvanceSearchForm ref="advancedSearchForm" />
                    <div className="advanceSearchFormBtns">
                        <button className="searchStyle" onClick={this._handleAdvancedSearch}>Search</button>&nbsp;&nbsp;&nbsp;
                        <button className="searchStyle" onClick={this._handleCloseAdvancedSearch}>Close</button>
                    </div>
                </Modal>
            </div>
        );
    }
}

SearchBox.propTypes = { value: React.PropTypes.string,
    multiLine: React.PropTypes.bool,
    onChangeEvent: React.PropTypes.func,
     };
SearchBox.defaultProps = { value: '' };

/*
*/
