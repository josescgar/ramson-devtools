import React from 'react';
import BackgroundMessenger from '../services/BackgroundMessenger';
import Messages from '../constants/Messages';
import moment from 'moment';

import FilterBar from './filter/FilterBar.jsx';
import FramesPanel from './frames/FramesPanel.jsx';
import DetailPanel from './detail/DetailPanel.jsx';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.onPageMessage = this.onPageMessage.bind(this);
        this.onFrameSelected = this.onFrameSelected.bind(this);
        this.onCleanCurrentSource = this.onCleanCurrentSource.bind(this);
        this.closeDetail = this.onFrameSelected.bind(this, null);

        this.state = {
            messages: {},
            groupings: {},
            detail: null,
            filters: {
                selectedSource: '',
                group: false,
                recording: false
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

        let detail = null;
        if (this.state.detail) {
            detail = (
                <div className="detail fullh">
                    <DetailPanel 
                        message={this.state.detail}
                        closeDetail={this.closeDetail}/>
                </div>
            );
        }

        return (
            <div className="fullh">
                <div className="top-bar">
                    <FilterBar 
                        sources={Object.keys(this.state.messages)} 
                        filters={this.state.filters} 
                        onFiltersChange={this.onFiltersChange}
                        onClean={this.onCleanCurrentSource}
                        />
                </div>
                <div className="content fullh">
                    <FramesPanel 
                        frames={frames} 
                        groupings={groupings} 
                        showGrouped={this.state.filters.group} 
                        onFrameSelected={this.onFrameSelected} 
                        selected={this.state.detail}/>
                        
                    {detail}
                </div>
            </div>
        );
    }

    onPageMessage(message) {
        if (!this.state.messages.hasOwnProperty(message.source)) {
            this.state.messages[message.source] = [];
            this.state.groupings[message.source] = {};
        }

        //Add timestamp
        message.timestamp = moment();

        //Push message to stream
        let newLength = this.state.messages[message.source].push(message);

        //Try to parse payload as JSON to search for request/response id
        let jsonPayload = this.checkForGrouping(message, newLength - 1);
        if (jsonPayload) {
            this.state.messages[message.source][newLength - 1].json = jsonPayload;
        }

        this.setState({messages: this.state.messages});
    }

    changeRecordingStatus(shouldRecord) {
        BackgroundMessenger.sendToBackgroundFromDevtools(Messages.MESSAGE_RECORDING_STATUS, shouldRecord);
    }

    onFiltersChange(filters) {
        let newFilters = Object.assign({}, this.state.filters, filters);
        if (filters.recording !== this.state.recording) {
            this.changeRecordingStatus(filters.recording);
        }

        this.setState({filters: newFilters, detail: null});
    }

    onFrameSelected(message) {
        this.setState({detail: message});
    }

    onCleanCurrentSource() {
        let currentSource = this.state.filters.selectedSource;
        if (!currentSource) {
            return;
        }

        delete this.state.messages[currentSource];
        delete this.state.groupings[currentSource];
        this.state.detail = null;
        this.state.selectedSource = '';

        this.setState(this.state);
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