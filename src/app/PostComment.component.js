
import React from 'react';
import { Avatar } from 'material-ui';

const PostComment = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.string,
        postCommentId: React.PropTypes.string,
    },

    getInitialState() {
        return {
            list: [],
        };
    },

    render() {
        const userName = this.props.currentUser.split(' ');
        let initChars = userName[0][0];
        if (userName.length > 1) {
            initChars += userName[userName.length - 1][0];
        }


        return (

			<div className="postComment hidden" id={this.props.postCommentId} >
				<table>
					<tr>
						<td>
							<Avatar color="black">{initChars}</Avatar>
						</td>
						<td>
							<table>
								<tr>
									<td>
										<textarea className="commentArea" hintText="Add a comment..." ></textarea>
										<br />
										<span className="funcLink">Share you comment</span>
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
