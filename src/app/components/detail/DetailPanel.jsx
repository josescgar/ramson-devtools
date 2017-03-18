import React from 'react';
import JSONTree from 'react-json-tree';

import css from './detail.less';

const TAB_RAW = 'raw';
const TAB_JSON = 'json';
const TREE_THEME = {
scheme: "Tomorrow",
author: "Chris Kempson (http://chriskempson.com)",
base00: "#1d1f21",
base01: "#282a2e",
base02: "#373b41",
base03: "#969896",
base04: "#b4b7b4",
base05: "#c5c8c6",
base06: "#e0e0e0",
base07: "#ffffff",
base08: "#cc6666",
base09: "#de935f",
base0A: "#f0c674",
base0B: "#b5bd68",
base0C: "#8abeb7",
base0D: "#81a2be",
base0E: "#b294bb",
base0F: "#a3685a"
};

export default class DetailPanel extends React.Component {

    constructor(props) {
        super(props);
        this.onRawTabSelected = this.onTabSelected.bind(this, TAB_RAW);
        this.onJsonTabSelected = this.onTabSelected.bind(this, TAB_JSON);
        this.state = {
            selectedTab: TAB_RAW
        };
    }

    render() {
        let options = [<a key="raw" href="#" className={this.state.selectedTab === TAB_RAW ? 'selected' : ''} onClick={this.onRawTabSelected}>Raw</a>];
        if (this.props.message.json) {
            options.push(<a key="json" href="#" className={this.state.selectedTab === TAB_JSON ? 'selected' : ''} onClick={this.onJsonTabSelected}>JSON</a>);
        }

        return (
            <div className="detail-panel">
                <div className="options">
                    {options}
                </div>
                <div className="content">
                    {this.generateContent()}
                </div>
            </div>
        )
    }

    generateContent() {
        let content = null;
        if (this.state.selectedTab === TAB_JSON) {
            content = (<div className="tree"><JSONTree hideRoot={true} data={this.props.message.json} theme={TREE_THEME}/></div>);
        } else {
            content = (<pre>{this.props.message.data}</pre>);
        }

        return content;
    }

    onTabSelected(tab) {
        this.setState({
            selectedTab: tab
        });
    }
}