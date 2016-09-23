
import React from 'react';
import { Avatar } from 'material-ui';

import actions from './actions/Comment.action';

const PostComment = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.string,
        postCommentId: React.PropTypes.string,
        data: React.PropTypes.object,
        postCommentSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return {
            text: '',
        };
    },

    _addComment() {
        actions.addComment(this.props.data.id, this.state.text)
			.subscribe(() => {
    this.props.postCommentSuccess(this.state.text);
		});
    },

    _onChange(e) {
        this.setState({ text: e.target.value });
    },

    render() {
        const userName = this.props.currentUser.name.split(' ');
        let initChars = userName[0][0];
        if (userName.length > 1) {
            initChars += userName[userName.length - 1][0];
        }

        return (

			<div className="postComment hidden" id={this.props.postCommentId} >
				<table>
					<tr>
						<td>
							<Avatar color="black" size="32">{initChars}</Avatar>
						</td>
						<td>
							<table>
								<tr>
									<td>
										<textarea className="commentArea" hintText="Add a comment..." value={this.state.text} onChange={this._onChange} />
										<br />
										<a onClick={this._addComment}>Share you comment</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>
		);
    },

});


export default PostComment;

