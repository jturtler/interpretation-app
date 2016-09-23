
import React from 'react';
import { Dialog, FlatButton } from 'material-ui';

import MessageOwner from './MessageOwner.component';
import CommentList from './CommentList.component';
import PostComment from './PostComment.component';

import actions from './actions/Interpretation.action';

const Interpretation = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        currentUser: React.PropTypes.string,
        deleteInterpretationSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return {
            likes: this.props.data.likes,
            likedBy: this.props.data.likedBy,
            open: false,
            comments: JSON.parse(this.props.data.comments),
            text: this.props.data.text,
        };
    },

    componentDidMount() {
    
        //this.renderChartAndOthers(this.props.data);
	    
        const currentUserId = this.props.data.userId;
        for (let i = 0; i < this.props.data.likedBy.length; i++) {
            if (currentUserId === this.props.data.likedBy[i].id) {
                const likeLinkTagId = `likeLink_${this.props.data.id}`;
                $(`#${likeLinkTagId}`).replaceWith("<span class='disabledLink'>Like</span>");
            }
        }

        const id = this.props.data.objId;
        const divId = this.props.data.id;

        if (this.props.data.type === 'REPORT_TABLE') {
            DHIS.getTable({
                url: '../../..',
                el: divId,
                id,
                width: 600,
                height: 400,
                displayDensity: 'compact',
            });
            $('#' + divId).closest('.interpretationItem ').addClass('contentTable');
        }
        else if (this.props.data.type === 'CHART') {
            DHIS.getChart({
                uid: id,
                el: divId,
                url: '../../..',
                width: 600,
                height: 400,
            });
        }
		else {
            $('#' + divId).css('height', '308px');
            DHIS.getMap({
                url: '../../..',
                el: divId,
                id,
                width: 600,
                height: 400,
            });
        }
    },


    renderChartAndOthers(data) {
        const id = data.objId;
        const divId = data.id;

        if (this.props.data.type === 'REPORT_TABLE') {
            DHIS.getTable({
                url: '../../..',
                el: divId,
                id,
                width: 600,
                height: 400,
                displayDensity: 'compact',
            });                                                                                             $('#' + divId).closest('.interpretationItem ').addClass('contentTable');
        } else if (this.props.data.type === 'CHART') {
            DHIS.getChart({
                uid: id,
                el: divId,
                url: '../../..',
                width: 600,
                height: 400,
            });
        } else {                                                                                               $('#' + divId).css('height', '308px');
            DHIS.getMap({
                url: '../../..',
                el: divId,
                id,
                width: 600,
                height: 400,
            });
        }
    },


    _showCommentHandler() {
        const postComentTagId = `#postComent_${this.props.data.id}`;
        console.log('postComentTagId : ' + postComentTagId);
        $(`${postComentTagId}`).show();
        $(`${postComentTagId}`).closest('.interpretationCommentArea').show();
    },

    _likeHandler() {
        actions.updateLike(this.props.data, this.props.data.id).subscribe(() => {
            const likeLinkTagId = `likeLink_${this.props.data.id}`;
            $(`#${likeLinkTagId}`).replaceWith("<span class='disabledLink'>Like</span>");

            const likes = this.state.likes + 1;
            const likedBy = this.state.likedBy;
            likedBy.push({ name: this.props.data.user, id: this.props.data.userId });

            this.setState({
                likes,
                likedBy,
            });

            const peopleLikeTagId = `peopleLike_${this.props.data.id}`;
            const postComentTagId = `postComent_${this.props.data.id}`;
            $(`#${peopleLikeTagId}`).show();
            $(`#${postComentTagId}`).closest('.interpretationCommentArea').show();
        });
    },

    _openPeopleLikedHandler() {
        this.setState({
            open: true,
        });
    },

    _closePeopleLikedHandler() {
        this.setState({
            open: false,
        });
    },

    _deleteHandler() {
        actions.deleteInterpretation(this.props.data, this.props.data.id)
			.subscribe(() => {
    this.props.deleteInterpretationSuccess(this.props.data.id);
		});
    },

    _showEditHandler() {
        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;
        $(`#${divEditText}`).show();
        $(`#${divShowText}`).hide();
    },

    _updateCommentSuccess(id, text) {
        const comments = this.state.comments;
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].id === id) {
                comments[i].text = text;
            }
        }

        this.setState({ comments });
    },

    _addCommentSuccess(text) {
        const currentDateObj = new Date();
        let month = eval(currentDateObj.getMonth()) + 1;
        month = (month < 10) ? `0${month}` : month;
        const currentDate = `${currentDateObj.getFullYear()}-${month}-${currentDateObj.getDate()} ${currentDateObj.getHours()}:${currentDateObj.getMinutes()}:${currentDateObj.getSeconds()}`;
        const comments = this.state.comments;
        comments.push({
            id: '',
            created: `${currentDate}`,
            text: `${text}`,
            user: {
                id: this.props.currentUser.id,
                name: this.props.currentUser.name,
            },
        });

        this.setState({ comments });
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


    _deleteCommentSuccess(commentId) {
        const comments = this.state.comments;
        this.removeFromArray(comments, 'id', commentId);
        this.setState({ comments });
    },

    _editInterpretationTextSuccess(text) {
        this.props.data.text = text;

        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;
        $(`#${divEditText}`).hide();
        $(`#${divShowText}`).show();

        this.setState({ text });
    },

    render() {
        // Make a method of this - getCommentPart()
        let commentPart = '';
        if (this.state.comments.length > 0) {
            commentPart = <CommentList list={this.state.comments} key={this.props.data.id} interpretationId={this.props.data.id} currentUser={this.props.currentUser} updateCommentSuccess={this._updateCommentSuccess} deleteCommentSuccess={this._deleteCommentSuccess} />;
        }

        let commentAreaClazzNames = 'interpretationCommentArea';
        if (commentPart === '' && this.props.data.likes === 0) {
            commentAreaClazzNames += ' hidden';
        }

        const postComentTagId = `postComent_${this.props.data.id}`;
        const peopleLikeTagId = `peopleLike_${this.props.data.id}`;
        const peopleLikedByDialogActions = [
            <input type="button"
                value="Cancel"
                onClick={this._closePeopleLikedHandler}
            />,
        ];


        const likeLinkTagId = `likeLink_${this.props.data.id}`;
        const interpretationTagId = `interpretation_${this.props.data.id}`;

        return (
			<div id={interpretationTagId}>
				<div className="interpretationContainer" >

				<div>
					<div className="interpretationItem">
						<div className="title">{this.props.data.name}</div>
						<div id={this.props.data.id}></div>
					</div>
				</div>

				<MessageOwner data={this.props.data} text={this.state.text} editInterpretationTextSuccess={this._editInterpretationTextSuccess} />

				<div className="linkTag">
					<a onClick={this._likeHandler} id={likeLinkTagId}>  Like </a> |
					<a onClick={this._showCommentHandler}>  Comment </a>
					<span className={this.props.currentUser.id === this.props.data.userId || this.props.currentUser.superUser ? '' : 'hidden'} >|
					<a onClick={this._showEditHandler}>  Edit </a> |
					<a onClick={this._deleteHandler}>  Delete </a>
					</span>
				</div>

				<div className={commentAreaClazzNames} >
					<div id={peopleLikeTagId} className={this.state.likes > 0 ? '' : 'hidden'}>
						<img src="./images/like.png" /> <a onClick={this._openPeopleLikedHandler}>{this.state.likes} people</a><span> liked this.</span>
                        <br />
					</div>
					<PostComment postCommentId={postComentTagId} currentUser={this.props.currentUser} data={this.props.data} postCommentSuccess={this._addCommentSuccess} />
					{commentPart}
				</div>

				<Dialog
    title="People"
    actions={peopleLikedByDialogActions}
    modal="true"
    open={this.state.open}
    onRequestClose={this._closePeopleLikedHandler}
				>
					<div>
						{this.state.likedBy.map(likedByUserName =>
							<p>{likedByUserName.name}</p>
						)}
					</div>
				</Dialog>
				</div>
			</div>
		);
    },
});

export default Interpretation;
