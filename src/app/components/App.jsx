import React from 'react';
import BackgroundMessenger from '../services/BackgroundMessenger';
import Messages from '../constants/Messages';

import FilterBar from './filter/FilterBar.jsx';

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
        let messages = this.state.messages[this.state.filters.selectedSource] || [];
        messages = messages.map((message, index) => <li key={index}>{message.type}: {message.data}</li>);

        return (
            <div>
                <FilterBar sources={Object.keys(this.state.messages)} filters={this.state.filters} onFiltersChange={this.onFiltersChange}/>
                <ul>{messages}</ul>
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
        this.checkForGrouping(message, newLength - 1);

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
            
        } catch (e) {
            console.debug("Payload is not JSON", message.data);
        }
    }
    
}