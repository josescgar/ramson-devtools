import React from 'react';
import classNames from 'classnames';
import Messages from '../../constants/Messages.js';

export default class FrameItem extends React.Component {
    constructor(props) {
        super(props);
        this.onMessageSelected = this.onMessageSelected.bind(this);
        this.onResponseSelected = this.onResponseSelected.bind(this);
    }

    render() {

        let liClass = classNames({
            frame: true,
            grouped: this.props.response
        });

        let msgClass = classNames({
            send: this.props.message.type === Messages.TYPE_SEND,
            selected: this.props.selected === this.props.message
        });

        let response = null;
        if (this.props.response) {
            let responseClass = classNames({response: true, selected: this.props.selected === this.props.response});
            response = <div className={responseClass}><a href="#" onClick={this.onResponseSelected}>{this.props.response.data}</a></div>;
        }

        return (
            <li className={liClass} key={this.props.msgIndex}>
                <div><a href="#" className={msgClass} onClick={this.onMessageSelected}>{this.props.message.data}</a></div>
                {response}
            </li>
        )
    }

    onMessageSelected() {
        this.props.onFrameSelected(this.props.selected === this.props.message ? null : this.props.message);
    }

    onResponseSelected() {
        this.props.onFrameSelected(this.props.selected === this.props.response ? null : this.props.response);
    }
}