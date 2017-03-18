import React from 'react';
import BackgroundMessenger from '../services/BackgroundMessenger';
import Messages from '../constants/Messages';
import classNames from 'classnames';

import FilterBar from './filter/FilterBar.jsx';
import FramesPanel from './frames/FramesPanel.jsx';
import DetailPanel from './detail/DetailPanel.jsx';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.onPageMessage = this.onPageMessage.bind(this);
        this.onFrameSelected = this.onFrameSelected.bind(this);

        this.state = {
            messages: {},
            groupings: {},
            detail: null,
            filters: {
                selectedSource: '',
                group: false
            }
        };
    }

    componentDidMount() {
        BackgroundMessenger.connectToBackground();
        BackgroundMessenger.sendToBackgroundFromDevtools(Messages.MESSAGE_INIT);
        BackgroundMessenger.onMessageFromBackground(this.onPageMessage);
    }

    render() {
        let frames = this.state.messages[this.state.filters.selectedSource] || [];
        let groupings = this.state.groupings[this.state.filters.selectedSource] || {};

        let framesClasses = classNames({
            'fullh': true,
            'frames': true,
            'no-detail': !this.state.detail
        });

        let detail = this.state.detail ? <DetailPanel message={this.state.detail}/> : [];

        return (
            <div className="fullh">
                <div className="top-bar">
                    <FilterBar sources={Object.keys(this.state.messages)} filters={this.state.filters} onFiltersChange={this.onFiltersChange}/>
                </div>
                <div className="content fullh">
                    <div className={framesClasses}>
                        <FramesPanel 
                            frames={frames} 
                            groupings={groupings} 
                            showGrouped={this.state.filters.group} 
                            onFrameSelected={this.onFrameSelected} 
                            selected={this.state.detail}/>
                    </div>
                    <div className="detail fullh">
                        {detail}
                    </div>
                </div>
            </div>
        );
    }

    onPageMessage(message) {
        if (!this.state.messages.hasOwnProperty(message.source)) {
            this.state.messages[message.source] = [];
            this.state.groupings[message.source] = {};
        }

        //Push message to stream
        let newLength = this.state.messages[message.source].push(message);

        //Try to parse payload as JSON to search for request/response id
        let jsonPayload = this.checkForGrouping(message, newLength - 1);
        if (jsonPayload) {
            this.state.messages[message.source][newLength - 1].json = jsonPayload;
        }

        this.setState({messages: this.state.messages});
    }

    onFiltersChange(filters) {
        let newFilters = Object.assign({}, this.state.filters, filters);
        this.setState({filters: newFilters});
    }

    onFrameSelected(message) {
        this.setState({detail: message});
    }

    checkForGrouping(message, streamIndex) {
        try {
            let jsonPayload = JSON.parse(message.data);
            if (jsonPayload.hasOwnProperty(Messages.FIELD_ID)) {

                let messageId = jsonPayload[Messages.FIELD_ID];
                let groupings = this.state.groupings[message.source];
                if (!groupings.hasOwnProperty(messageId)) {
                    groupings[messageId] = {};
                }

                groupings[messageId][message.type] = streamIndex;
            }

            return jsonPayload;

        } catch (e) {
            return null;
        }
    }

}