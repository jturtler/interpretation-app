
import React from 'react';
import { Dialog, FlatButton } from 'material-ui';
import MessageOwner from './MessageOwner.component';
import CommentArea from './CommentArea.component';

import actions from './actions/Interpretation.action';

const Interpretation = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        currentUser: React.PropTypes.string,
        deleteInterpretationSuccess: React.PropTypes.func,
    },

    getInitialState() {
        return {
            text: this.props.data.text,
            likes: this.props.data.likes,
            likedBy: this.props.data.likedBy,
            open: false,
            comments: this.props.data.comments,
        };
    },

    componentDidMount() {
        const currentUserId = this.props.currentUser.id;
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
        } else if (this.props.data.type === 'CHART') {
            DHIS.getChart(this._setChartOptions(id, divId, this.props.data.chart.relativePeriods, this.props.data.chart.periods, this.props.data.created));

            /* DHIS.getChart({
                uid: id,
                el: divId,
                url: '../../..',
                width: 600,
                height: 400,
            }); */


            /* DHIS.getChart({
                uid: id,
                el: divId,
                url: '../../..',
                width: 600,
                height: 400,
                columns: [{
					dimension: 'pe',
					items: [{id: '2016W52'}]
				}]
            }); */
        } else if (this.props.data.type === 'MAP') {
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

    _setChartOptions(id, divId, relativePeriodKeys, rootPeriods, createdDate) {
        const relativePeriods = this._converRelativePeriods(relativePeriodKeys, createdDate);

        const options = {};

        options.uid = id;
        options.el = divId;
        options.url = '../../..';
        options.width = 600;
        options.height = 400;

        if (relativePeriods.length > 0) {
            console.log('\n ==== 1');
            console.log(relativePeriods);
            relativePeriods.concat(rootPeriods);
            console.log('2');
            console.log(relativePeriods);
            if (this.props.data.chart.series === 'pe') {
                options.columns = [{
                    dimension: 'pe',
                    items: relativePeriods,
                }];
            } else if (this.props.data.chart.category === 'pe') {
                options.rows = [{
                    dimension: 'pe',
                    items: relativePeriods,
                }];
            } else if (this.props.data.chart.filterDimensions.indexOf('pe') >= 0) {
                options.filters = [{
                    dimension: 'pe',
                    items: relativePeriods,
                }];
            }
        }

        return options;
    },

    _convertToNumber(n) {
        return (n.startsWith('0')) ? eval(n[1]) : eval(n);
    },

// const relativePeriods = ['thisYear', 'lastYear', 'last5Years', 'thisMonth', 'lastMonth', 'monthsThisYear', 'last12Months', 'last3Months', 'last6Months'];

    _converRelativePeriods(relativePeriods, createdDate) {
        let periods = [];

        const created = createdDate.substring(0, 10).split('-');
        let month = this._convertToNumber(created[1]);
        month = month - 1;
        const day = this._convertToNumber(created[2]);
        const date = new Date(created[0], month, day);

        const currentYear = date.getFullYear();

        for (const key in relativePeriods) {
            if (relativePeriods[key]) {
                // Yearly periods
                if (key === 'thisYear') {
                    periods.push({ id: currentYear });
                }
                if (key === 'lastYear') {
                    const lastYear = currentYear - 1;
                    periods.push({ id: lastYear });
                }
                if (key === 'last5Years') {
                    const start = currentYear - 5;
                    const end = currentYear - 1;
                    for (let year = start; year >= end; year++) {
                        periods.push({ id: year });
                    }
                }
                // Monthy periods
                if (key === 'thisMonth') {
                    let currentMonth = date.getMonth() + 1;// Month from Date Object starts from 0
                    currentMonth = (currentMonth > 10) ? currentMonth : `0${currentMonth}`;
                    periods.push({ id: `${currentYear}${currentMonth}` });
                }
                if (key === 'lastMonth') {
                    let currentMonth = date.getMonth();// Month from Date Object starts from 0
                    currentMonth = (currentMonth > 10) ? currentMonth : `0${currentMonth}`;
                    periods.push({ id: `${currentYear}${currentMonth}` });
                }
                if (key === 'monthsThisYear') {
                    const currentMonth = date.getMonth();// Month from Date Object starts from 0
                    for (let m = 1; m <= currentMonth; m++) {
                        const k = (m > 10) ? m : `0${m}`;
                        periods.push({ id: `${currentYear}${k}` });
                    }
                }
                if (key === 'last12Months') {
                    console.log('last12Months :');
                    console.log(periods);
                    periods = periods.concat(this._getLastNMonth(12, currentYear, date.getMonth()));
                    console.log(periods);
                }
                if (key === 'last3Months') {
                    periods = periods.concat(this._getLastNMonth(3, currentYear, date.getMonth()));
                }
                if (key === 'last6Months') {
                    periods = periods.concat(this._getLastNMonth(6, currentYear, date.getMonth()));
                }
                // monthsLastYear
            }
        }
    /*    "": false,
"quartersLastYear": false,
"last52Weeks": false,
"thisWeek": false,
"": false,
"": false,
"last2SixMonths": false,
"thisQuarter": false,
"": true,
"last5FinancialYears": false,
"thisSixMonth": false,
"lastQuarter": false,
"thisFinancialYear": false,
"last4Weeks": false,
"": false,
"": false,
"": false,
"last6BiMonths": false,
"lastFinancialYear": false,
"": false,
"quartersThisYear": false,
"": false,
"lastWeek": false,
"thisBimonth": false,
"lastBimonth": false,
"lastSixMonth": false,
"": false,
"last12Weeks": false,
"last4Quarters": false
*/
        return periods;
    },

    _getLastNMonth(noNumber, year, month) {
        const currentYearPeriods = [];

        let count = 0;
        for (let m = month; m >= 1 && count < noNumber; m--) {
            const k = (m >= 10) ? m : `0${m}`;
            currentYearPeriods.push({ id: `${year}${k}` });
            count++;
        }

        const lastYearPeriods = [];
        if (count < noNumber - 1) {
            const lastYear = year - 1;
            for (let m = noNumber; m >= 1 && count < noNumber; m--) {
                const k = (m >= 10) ? m : `0${m}`;
                lastYearPeriods.push({ id: `${lastYear}${k}` });
                count++;
            }
        }

        const periods = [];
        for (let i = lastYearPeriods.length - 1; i >= 0; i--) {
            periods.push(lastYearPeriods[i]);
        }

        for (let i = currentYearPeriods.length - 1; i >= 0; i--) {
            periods.push(currentYearPeriods[i]);
        }

        return periods;
    },

    _showCommentHandler() {
        const postComentTagId = `postComent_${this.props.data.id}`;
        $(`#${postComentTagId}`).show();
        $(`#${postComentTagId}`).closest('.interpretationCommentArea').show();
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
            }, function () {
                const peopleLikeTagId = `peopleLike_${this.props.data.id}`;
                const postComentTagId = `postComent_${this.props.data.id}`;
                $(`#${peopleLikeTagId}`).show();
                $(`#${postComentTagId}`).closest('.interpretationCommentArea').show();
            });
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

    _editInterpretationTextSuccess(text) {
        this.props.data.text = text;

        const divEditText = `edit_${this.props.data.id}`;
        const divShowText = `show_${this.props.data.id}`;
        $(`#${divEditText}`).hide();
        $(`#${divShowText}`).show();

        this.setState({ text });
    },

    _getCommentAreaClazz() {
        let commentAreaClazzNames = 'interpretationCommentArea';
        if (this.props.data.comments.length === 0 && this.state.likes === 0) {
            commentAreaClazzNames += ' hidden';
        }

        return commentAreaClazzNames;
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

    render() {
        const likeLinkTagId = `likeLink_${this.props.data.id}`;
        const interpretationTagId = `interpretation_${this.props.data.id}`;
        const peopleLikeTagId = `peopleLike_${this.props.data.id}`;

        const peopleLikedByDialogActions = [
            <FlatButton type="button"
                onClick={this._closePeopleLikedHandler}
                label="Cancel"
                primary
            />,
        ];

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

                     <div className={this._getCommentAreaClazz()} >
                        <div id={peopleLikeTagId} className={this.state.likes > 0 ? '' : 'hidden'}>
                            <img src="./images/like.png" /> <a onClick={this._openPeopleLikedHandler}>{this.state.likes} people</a><span> liked this.</span>
                            <br />
                        </div>
                        <CommentArea comments={this.state.comments} likes={this.state.likes} interpretationId={this.props.data.id} likedBy={this.state.likedBy} currentUser={this.props.currentUser} />


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
			</div>
		);
    },
});

export default Interpretation;
