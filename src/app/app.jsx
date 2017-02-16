import React from 'react';
import ReactDOM from 'react-dom';
import BackgroundMessenger, { Messages } from './services/BackgroundMessenger';

import FilterBar from './components/filter/FilterBar.jsx';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sources: []
        };
    }

    componentDidMount() {
        BackgroundMessenger.connectToBackground();
        BackgroundMessenger.sendToBackgroundFromDevtools(Messages.INIT);
        BackgroundMessenger.onMessageFromBackground(message => this.onPageMessage(message));
    }

    render() {
        let sources = this.state.sources.map((source, index) => <li key={index}>{source}</li>);
        return (
            <div>
                <ul>{sources}</ul>
                <FilterBar/>
            </div>
        );
    }

    onPageMessage(message) {
        //Add to sources
        if (this.state.sources.indexOf(message.source) === -1) {
            this.state.sources.push(message.source);
            this.setState({
                sources: this.state.sources
            });
        }
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);