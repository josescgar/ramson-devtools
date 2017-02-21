import React from 'react';
import css from './filter.less';

export default class FilterBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleSourceChange = this.handleSourceChange.bind(this);
        this.handleGroupingChange = this.handleGroupingChange.bind(this);
    }

    render() {
        let sources = [<option key="-1" value="-1">No source selected</option>];
        sources.push(this.props.sources.map((source, index) => <option value={index} key={index}>{source}</option>));

        return (
            <div className="filter-bar">
                <form>
                    <div className="filter-item">
                        <select value={this.props.sources.indexOf(this.props.filters.selectedSource)} onChange={this.handleSourceChange}>
                            {sources}
                        </select>
                    </div>
                    <div className="divider"/>
                    <div className="filter-item">
                        <label>
                            <input type="checkbox" checked={this.props.filters.group} onChange={this.handleGroupingChange}/>
                            Group request/response
                        </label>
                    </div>
                </form>
            </div>
        );
    }

    handleSourceChange(event) {
        let source = event.target.value >= 0 ? this.props.sources[event.target.value] : null;
        this.props.onFiltersChange({selectedSource: source});
    }

    handleGroupingChange(event) {
        this.props.onFiltersChange({group: event.target.checked});
    }
}