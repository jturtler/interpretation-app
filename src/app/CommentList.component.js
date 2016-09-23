
import React from 'react';
import Comment from './Comment.component';

const CommentList = React.createClass({
    propTypes: {
        list: React.PropTypes.text,
        currentUser: React.PropTypes.text,
        interpretationId: React.PropTypes.text,
        deleteCommentSuccess: React.PropTypes.func,
        updateCommentSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return { list: this.props.list };
    },

    render() {
        return (
            <div>
                {this.state.list.map(data =>
                    <div id={data.id}>
                        <Comment key={data.id} data={data} currentUser={this.props.currentUser} interpretationId={this.props.interpretationId} updateCommentSuccess={this.props.updateCommentSuccess} deleteCommentSuccess={this.props.deleteCommentSuccess} />
                    </div>
                )}
            </div>
        );
    },
});

export default CommentList;
