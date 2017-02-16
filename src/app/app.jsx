import React from 'react';
import ReactDOM from 'react-dom';

import FilterBar from './components/filter/FilterBar.jsx';

class App extends React.Component {
    render() {
        return (
            <FilterBar/>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);