import React from 'react';
import css from './filter.less';

import imgPlay from '../../../img/glyphicons-174-play.png';
import imgPause from '../../../img/glyphicons-175-pause.png';
import imgClear from '../../../img/glyphicons-200-ban-circle.png';

export default class FilterBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleSourceChange = this.handleSourceChange.bind(this);
        this.handleGroupingChange = this.handleGroupingChange.bind(this);
        this.handleRecordStatusChange = this.handleRecordStatusChange.bind(this);
        this.onClean = this.onClean.bind(this);
    }

    render() {
        let sources = [<option key="-1" value="-1">No source selected</option>];
        sources.push(this.props.sources.map((source, index) => <option value={index} key={index}>{source}</option>));

        let recordImg = this.props.filters.recording ? imgPause : imgPlay;

        return (
            <div className="filter-bar">
                <form>
                    <div className="filter-item">
                        <a href="#" onClick={this.handleRecordStatusChange}><img src={recordImg} className="icon"/></a>
                    </div>
                    <div className="divider"/>
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
                    <div className="filter-item right clear">
                        <img className="icon" src={imgClear} onClick={this.onClean} alt="Clear"/>
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

    handleRecordStatusChange(event) {
        this.props.onFiltersChange({recording: !this.props.filters.recording});
    }

    onClean() {
        this.props.onClean();
    }
}