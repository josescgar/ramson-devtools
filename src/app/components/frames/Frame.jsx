import React from 'react';

export default class FrameItem extends React.Component {
    render() {
        if (this.props.response) {
            return (
                <li>
                    <div><strong>{this.props.message.type}</strong> {this.props.message.data}</div>
                    <div><i><strong>{this.props.response.type}</strong> {this.props.response.data}</i></div>
                </li>
            );
        } else {
            return <li><strong>{this.props.message.type}</strong> {this.props.message.data}</li>;
        }
    }
}