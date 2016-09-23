import React from 'react';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import { LeftNav } from 'material-ui';

import SearchBox from './SearchBox.component';
import InterpretationList from './InterpretationList.component';


const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

export default React.createClass({
    propTypes: {
        d2: React.PropTypes.object,
        value: React.PropTypes.string,
    },

    childContextTypes: {
        d2: React.PropTypes.object,
        value: React.PropTypes.string,
    },

    getInitialState() {
        return {
            charts: [],
            value: '',
        };
    },

    getChildContext() {
        return {
            d2: this.props.d2,
            value: '',
        };
    },

    _onSearchChange(keyword) {
        this.refs.lists.onSearchChanged(keyword);
    },

    render() {
        return (
            <div className="app-wrapper">

                <HeaderBar />

				<LeftNav openRight="true" >

					<div className="rightNav">
						<div className="">Top 5 interpretations ( last 30 days )</div>
						<div>
							<ul>
								<li><a href="#">#1 favorite name</a></li>
								<li><a href="#">#2 favorite name</a></li>
								<li><a href="#">#3 favorite name</a></li>
								<li><a href="#">#4 favorite name</a></li>
								<li><a href="#">#5 favorite name</a></li>
							</ul>
						</div>
					</div>

					<table>
						<tr>
							<th>Top 5 authors ( last 30 days )</th>
						</tr>
						<tr>
							<td>
								<ul>
									<li><a href="#">#1 Rodolfo Melia</a></li>
									<li><a href="#">#2 James Chang</a></li>
									<li><a href="#">#3 Lars Overland</a></li>
									<li><a href="#">#4 Name Melia</a></li>
									<li><a href="#">#5 User Melia</a></li>
								</ul>
							</td>
						</tr>
					</table>
					<br />


					<table>
						<tr>
							<th>Top 5 commentators ( last 30 days )</th>
						</tr>
						<tr>
							<td>
								<ul>
									<li><a href="#">#1 Rodolfo Melia</a></li>
									<li><a href="#">#2 James Chang</a></li>
									<li><a href="#">#3 Lars Overland</a></li>
									<li><a href="#">#4 Name Melia</a></li>
									<li><a href="#">#5 User Melia</a></li>
								</ul>
							</td>
						</tr>
					</table>
					<br />

				</LeftNav>

				<mainPage>
					<div>
						<SearchBox
    onChangeEvent={this._onSearchChange}
    hintText="Search by name"
    value={this.state.value}
						/>
					</div>

					<InterpretationList d2={this.props.d2} ref="lists" />
				</mainPage>
			</div>
        );
    },
});
