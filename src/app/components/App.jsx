import React from 'react';
import BackgroundMessenger, { Messages } from '../services/BackgroundMessenger';

import FilterBar from './filter/FilterBar.jsx';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.onPageMessage = this.onPageMessage.bind(this);

        this.state = {
            messages: {},
            filters: {
                selectedSource: '',
                group: false
            }
        };
    }

    componentDidMount() {
        BackgroundMessenger.connectToBackground();
        BackgroundMessenger.sendToBackgroundFromDevtools(Messages.INIT);
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
        }

        this.state.messages[message.source].push(message);
        this.setState({messages: this.state.messages});
    }

    onFiltersChange(filters) {
        let newFilters = Object.assign({}, this.state.filters, filters);
        this.setState({filters: newFilters});
    }
    
}