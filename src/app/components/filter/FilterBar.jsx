import React from 'react';

export default class FilterBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleSourceChange = this.handleSourceChange.bind(this);
    }

    render() {
        let sources = [<option key="-1" value="-1">No source selected</option>];
        sources.push(this.props.sources.map((source, index) => <option value={index} key={index}>{source}</option>));

        return (
            <form>
                <select value={this.props.selectedSource} onChange={this.handleSourceChange}>
                    {sources}
                </select>
            </form>
        );
    }

    handleSourceChange(event) {
        this.props.onSourceSelected(event.target.value >= 0 ? this.props.sources[event.target.value] : null);
    }
}