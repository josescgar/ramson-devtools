import React from 'react';
import BackgroundMessenger from '../services/BackgroundMessenger';
import Messages from '../constants/Messages';

import FilterBar from './filter/FilterBar.jsx';
import FramesPanel from './frames/FramesPanel.jsx';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.onPageMessage = this.onPageMessage.bind(this);

        this.state = {
            messages: {},
            groupings: {},
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

        return (
            <div>
                <div className="wide">
                    <FilterBar sources={Object.keys(this.state.messages)} filters={this.state.filters} onFiltersChange={this.onFiltersChange}/>
                </div>
                <div className="frames no-detail">
                    <FramesPanel frames={frames} groupings={groupings} showGrouped={this.state.filters.group}/>
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
            console.debug("Payload is not JSON", message.data);
            return null;
        }
    }

}