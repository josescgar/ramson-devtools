import React from 'react';
import ReactDOM from 'react-dom';
import BackgroundMessenger, { Messages } from './services/BackgroundMessenger';

import FilterBar from './components/filter/FilterBar.jsx';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sources: [],
            messages: []
        };
    }

    componentDidMount() {
        BackgroundMessenger.connectToBackground();
        BackgroundMessenger.sendToBackgroundFromDevtools(Messages.INIT);
        BackgroundMessenger.onMessageFromBackground(message => this.onPageMessage(message));
    }

    render() {
        let sources = this.state.sources.map((source, index) => <li key={index}>{source}</li>);
        let messages = this.state.messages.map((message, index) => <li key={index}>{message.type}: {message.data}</li>);
        return (
            <div>
                <ul>{sources}</ul>
                <FilterBar/>
                <ul>{messages}</ul>
            </div>
        );
    }

    onPageMessage(message) {
        let newState = {};

        //Add to sources
        if (this.state.sources.indexOf(message.source) === -1) {
            this.state.sources.push(message.source);
            newState.sources = this.state.sources;
        }

        //Add to transactions
        this.state.messages.push(message);
        newState.messages = this.state.messages;

        this.setState(newState);
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);