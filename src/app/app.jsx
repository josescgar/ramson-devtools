import React from 'react';
import ReactDOM from 'react-dom';
import BackgroundMessenger, { Messages } from './services/BackgroundMessenger';

import FilterBar from './components/filter/FilterBar.jsx';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.onSourceSelected = this.onSourceSelected.bind(this);
        this.state = {
            messages: {},
            selectedSource: null
        };
    }

    componentDidMount() {
        BackgroundMessenger.connectToBackground();
        BackgroundMessenger.sendToBackgroundFromDevtools(Messages.INIT);
        BackgroundMessenger.onMessageFromBackground(message => this.onPageMessage(message));
    }

    render() {
        let messages = this.state.messages[this.state.selectedSource] || [];
        messages = messages.map((message, index) => <li key={index}>{message.type}: {message.data}</li>);

        return (
            <div>
                <FilterBar sources={Object.keys(this.state.messages)} onSourceSelected={this.onSourceSelected}/>
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

    onSourceSelected(source) {
        this.setState({selectedSource: source});
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);