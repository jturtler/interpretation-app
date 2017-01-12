import React from 'react';

const AppVersionInfo = React.createClass({
    propTypes: {
        linkSrc: React.PropTypes.string,
    },

    getInitialState() {
        return {
        };
    },

    componentDidMount() {
        $.get('manifest.webapp', function(data) {
            const versionInfo = $.parseJSON(data);
            if (versionInfo.version) {
                $('.appVersionInfo').text(`ver ${versionInfo.version}`);
            }
        });
    },

    render() {
        return (
            <a className="appVersionInfo" style={{ fontSize: '8px', color: '#F4F4F4', textDecoration: 'none', cursor: 'pointer' }} href={this.props.linkSrc} target="_blank"></a>
		);
    },
});

export default AppVersionInfo;
