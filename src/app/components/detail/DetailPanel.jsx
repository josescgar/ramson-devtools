import React from 'react';
import JSONTree from 'react-json-tree';

export default class DetailPanel extends React.Component {

    render() {
        let json = null;
        if (this.props.message.json) {
            json = <div className="tree"><JSONTree data={this.props.message.json}/></div>
        }

        return (
            <div>
                <div className="raw">
                    {this.props.message.data}
                </div>
                {json}
            </div>
        )
    }
}