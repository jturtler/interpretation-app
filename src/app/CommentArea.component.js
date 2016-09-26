import React from 'react';
import CommentList from './CommentList.component';
import PostComment from './PostComment.component';

import actions from './actions/Comment.action';

const CommentArea = React.createClass({

    propTypes: {
        comments: React.PropTypes.string,
        likes: React.PropTypes.int,
        likedBy: React.PropTypes.array,
        interpretationId: React.PropTypes.string,
        currentUser: React.PropTypes.string,
    },

    getInitialState() {
        const comments = JSON.parse(this.props.comments);
        return {
            comments,
        };
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

    // _addCommentSuccess(id, text) {
    _addCommentSuccess() {
        actions.listComment(undefined, this.props.interpretationId).subscribe(result => {
            const comments = this.state.comments;
            comments.push(result.comments[result.comments.length - 1]);

            this.setState({ comments });

            const postComentTagId = `postComent_${this.props.interpretationId}`;
            $(`#${postComentTagId}`).closest('.interpretationCommentArea').show();
        });
    },

    _updateCommentSuccess(id, text) {
        const comments = this.state.comments;
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === id) {
                comments[i].text = text;
            }
        }

        this.setState({
            comments,
        });
    },

    _deleteCommentSuccess(commentId) {
        let comments = this.state.comments;
        comments = this.removeFromArray(comments, 'id', commentId);

        this.setState({ comments });
    },

    _getShowCommentListTag() {
        let commentPart = '';
        if (this.state.comments.length > 0) {
            const keyTagId = `showList_${this.props.interpretationId}`;
            commentPart = <CommentList list={this.state.comments} hidden={false} key={keyTagId} interpretationId={this.props.interpretationId} currentUser={this.props.currentUser} updateCommentSuccess={this._updateCommentSuccess} deleteCommentSuccess={this._deleteCommentSuccess} />;
        }

        return commentPart;
    },

    _getCommentAreaClazz() {
        let commentAreaClazzNames = 'interpretationCommentArea';
        if (this.state.comments.length === 0 && this.props.likes === 0) {
            commentAreaClazzNames += ' hidden';
        }

        return commentAreaClazzNames;
    },


    render() {
        return (
            <div className={this._getCommentAreaClazz()} >
                <PostComment currentUser={this.props.currentUser} interpretationId={this.props.interpretationId} postCommentSuccess={this._addCommentSuccess} />
                {this._getShowCommentListTag()}

            </div>
		);
    },
});

export default CommentArea;
