import React from 'react';
import actions from './actions/Interpretation.action';

import { otherUtils } from './utils';

const TopRankItems = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        deleteInterpretationSuccess: React.PropTypes.func,
        onTopRankItemClicked: React.PropTypes.func,
    },

    getInitialState() {
        return {
            top5Interpretations: [],
            top5Authors: [],
            top5Commentators: [],
        };
    },

    componentDidMount() {
        this._loadTopList();
    },

    _getNDateBefore(noDays) {
        const date = new Date();
        date.setDate(date.getDate() - noDays);

        let month = date.getMonth() + 1;
        month = (month >= 10) ? month : `0${month}`;

        let day = date.getDate();
        day = (day >= 10) ? day : `0${day}`;

        return `${date.getFullYear()}-${month}-${day}`;
    },

    _loadTopList() {
        const startDate = this._getNDateBefore(30);
        const endDate = this._getNDateBefore(1);
        const searchData = `&filter=created:ge:${startDate}`;

        actions.listInterpretation('', searchData).subscribe(result => {
            this.setState({
                top5Interpretations: this._getTop5Interpretations(result.interpretations),
                top5Authors: this._getTop5Authors(result.interpretations),
                top5Commentators: this._getTop5Commentator(result.interpretations),
            });
        });
    },

    _getTop5Interpretations(list) {
        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            let count = 0;
            if (data.comments !== undefined) {
                count += data.comments.length;
            }
            if (data.likes !== undefined) {
                count += data.likes;
            }
            data.count = count;
        }

        const interpretations = otherUtils.sortByKey(list, 'count');
        const len = interpretations.length;
        const idx = (len <= 5) ? 0 : len - 5;
        return interpretations.slice(idx, len).reverse();
    },

    _getTop5Authors(list) {
        let authors = [];
        for (let i = 0; i < list.length; i++) {
            const author = list[i].user;
            const searched = otherUtils.findItemFromList(authors, 'id', author.id);
            if (searched === undefined) {
                author.count = 1;
                authors.push(author);
            } else {
                searched.count = searched.count + 1;
            }
        }

        authors = otherUtils.sortByKey(authors, 'count');
        const len = authors.length;
        const idx = (len <= 5) ? 0 : len - 5;
        return authors.slice(idx, len).reverse();
    },

    _getTop5Commentator(list) {
        let commentators = [];
        for (let i = 0; i < list.length; i++) {
            const comments = list[i].comments;
            for (let j = 0; j < comments.length; j++) {
                const commentator = comments[j].user;
                const searched = otherUtils.findItemFromList(commentators, 'id', commentator.id);
                if (searched === undefined) {
                    commentator.count = 1;
                    commentators.push(commentator);
                } else {
                    searched.count = searched.count + 1;
                }
            }
        }

        commentators = otherUtils.sortByKey(commentators, 'count');
        const len = commentators.length;
        const idx = (len <= 5) ? 0 : len - 5;
        return commentators.slice(idx, len).reverse();
    },

    _increaseIdx(index) {
        return index + 1;
    },

    _getKeys(id, prefix) {
        return `${prefix}_${id}`;
    },

    _topInterpretationClicked(id) {
        this.props.onTopRankItemClicked({ id });
    },

    _topAuthorClicked(id) {
        this.props.onTopRankItemClicked({ moreTerms: { author: { id } } });
    },

    _topCommentatorClicked(id) {
        this.props.onTopRankItemClicked({ moreTerms: { commentator: { id } } });
    },

    render() {
        return (
           <table className="rightPanel">
                <tbody>
                    <tr>
                        <td className="header">Top 5 interpretations (last 30 days)</td>
                    </tr>

                    {this.state.top5Interpretations.map((data, index) =>
                        <tr key={this._getKeys(data.id, 'top5Interpretations')} >
                            <td>
                                 <a title={data.text} onClick={this._topInterpretationClicked.bind(null, data.id)}>#{this._increaseIdx(index)} {data.text.substring(0, 25)} {data.text.length > 25 ? '...' : ''}</a>
                            </td>
                        </tr>
                    )}

                     <tr>
                        <td className="header">Top 5 authors (last 30 days)</td>
                    </tr>

                     {this.state.top5Authors.map((data, index) =>
                        <tr key={this._getKeys(data.id, 'top5Authors')} >
                            <td>
                                <a onClick={this._topAuthorClicked.bind(null, data.id)}>#{this._increaseIdx(index)} {data.name}</a>
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td className="header">Top 5 Commentator (last 30 days)</td>
                    </tr>

                    {this.state.top5Commentators.map((data, index) =>
                        <tr key={this._getKeys(data.id, 'top5Commentators')} >
                            <td>
                                <a onClick={this._topCommentatorClicked.bind(null, data.id)}>#{this._increaseIdx(index)} {data.name}</a>
                            </td>
                        </tr>
                    )}
                </tbody>
           </table>
		);
    },
});

export default TopRankItems;
