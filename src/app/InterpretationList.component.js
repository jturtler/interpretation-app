import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Interpretation from '../../src/app/Interpretation.component';
import actions from './actions/Interpretation.action';

const InterpretationList = React.createClass({
    propTypes: {
        d2: React.PropTypes.object,
    },

    childContextTypes: {
        d2: React.PropTypes.object,
    },

    getInitialState() {
        return {
            hasMore: true,
            items: [],
            searchTerm: undefined,
            currentUser: { name: this.props.d2.currentUser.displayName, id: this.props.d2.currentUser.id, superUser: this.isSuperUser() },
        };
    },

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    },

    onSearchChanged(searchTerm) {

        console.log( 'onSearchChanged called');

		// set the search terms on state memory and reset the item list
        this.state.searchTerm = searchTerm;
        this.state.items = [];

        // Search for Interpretation with first page.  searchTerm are passed as memory
        this.loadMore(1);
    },

    getFormattedData(itemList) {
		// Can not use itemList itself into the 'setState' since
		// we didn't resolve it yet?
        const dataList = [];

        for (let i = 0; i < itemList.length; i++) {
            const interpretation = itemList[i];

            let data = {};
            data = interpretation;
            data.userId = interpretation.user.id;
            data.user = interpretation.user.name;
            // data.comments = JSON.stringify(interpretation.comments);

            if (interpretation.type === 'CHART') {
                data.objId = interpretation.chart.id;
                data.name = interpretation.chart.name;
            } else if (interpretation.type === 'MAP') {
                data.objId = interpretation.map.id;
                data.name = interpretation.map.name;
            } else if (interpretation.type === 'REPORT_TABLE') {
                data.objId = interpretation.reportTable.id;
                data.name = interpretation.reportTable.name;
            }

            dataList.push(data);
        }

        return dataList;
    },

    getSearchTerms(searchTerm) {
        let searchTermUrl = '';

        if (searchTerm !== undefined) {
            // TODO: Will be changed from text to object
            if (searchTerm.keyword) searchTermUrl += `&filter=text:ilike:${searchTerm.keyword}`;

            if (searchTerm.moreTerms !== undefined) {
                if (searchTerm.moreTerms.author) searchTermUrl += `&filter=user.id:eq:${searchTerm.moreTerms.author.id}`;

                if (searchTerm.moreTerms.commentator) searchTermUrl += `&filter=comments.user.id:eq:${searchTerm.moreTerms.commentator.id}`;

                if (searchTerm.moreTerms.type !== '') searchTermUrl += `&filter=type:eq:${searchTerm.moreTerms.type}`;

                if (searchTerm.moreTerms.dateCreatedFrom) searchTermUrl += `&filter=created:ge:${searchTerm.moreTerms.dateCreatedFrom.format('YYYY-MM-DD')}`;

                if (searchTerm.moreTerms.dateCreatedTo) searchTermUrl += `&filter=created:le:${searchTerm.moreTerms.dateCreatedTo.format('YYYY-MM-DD')}`;

                if (searchTerm.moreTerms.dateModifiedFrom) searchTermUrl += `&filter=lastUpdated:ge:${searchTerm.moreTerms.dateModifiedFrom.format('YYYY-MM-DD')}`;

                if (searchTerm.moreTerms.dateModifiedTo) searchTermUrl += `&filter=lastUpdated:le:${searchTerm.moreTerms.dateModifiedTo.format('YYYY-MM-DD')}`;
            }
        }

        return searchTermUrl;
    },

    addToDivList(dataList, hasMore, resultPage) {
        this.setState({
            items: this.state.items.concat([this.createDiv(dataList, resultPage)]), hasMore,
        });
    },

    isSuperUser() {
        return this.props.d2.currentUser.authorities.has('ALL');
    },

    showProgressBar(show) {
        // if (show) Progress.show();
        // else Progress.hide();
    },

    loadMore(page) {
        const searchData = this.getSearchTerms(this.state.searchTerm);

        this.showProgressBar(true);

        actions.listInterpretation('', page, searchData).subscribe(result => {
            const d2 = this.props.d2;
            const d2Api = d2.Api.getApi();

            const dataList = this.getFormattedData(result.interpretations, d2Api.baseUrl);
            const hasMore = (result.pager.page < result.pager.pageCount);
            const resultPage = result.pager.page;

            this.addToDivList(dataList, hasMore, resultPage);

            this.showProgressBar(false);
        });
    },

    createDiv(dataList, page) {
        const divKey = `list_${page}`;

        return (
			<div key={divKey}>
			{dataList.map(data =>
                <Interpretation page={page} key={data.id} data={data} currentUser={this.state.currentUser} deleteInterpretationSuccess={this._deleteInterpretationSuccess} />
			)}
			</div>
        );
    },

    removeFromArray(list, propertyName, value) {
        let index;

        for (let i = 0; i < list.length; i++) {
            if (list[i][propertyName] === value) {
                index = i;
            }
        }

        if (index !== undefined) {
            list.splice(index, 1);
        }

        return list;
    },

    _deleteInterpretationSuccess(id) {
        const items = this.state.items;

        for (let i = 0; i < items.length; i++) {
            const children = items[i].props.children;
            this.removeFromArray(children, 'key', id);
        }

        this.setState({ items });
    },

    render() {
        return (
			<div>
				<InfiniteScroll key="interpretationListKey" loader={<div><img src="images/ajaxLoaderBar.gif" /></div>} loadMore={this.loadMore} hasMore={this.state.hasMore} useWindow>
                    {this.state.items}
				</InfiniteScroll>
			</div>
		);
    },
});

export default InterpretationList;
