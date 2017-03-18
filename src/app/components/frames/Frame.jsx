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

        let liClass = {
            frame: true,
            send: this.props.message.type === Messages.TYPE_SEND,
            selected: this.props.selected === this.props.message
        };

        let respClass = {
            frame: true,
            send: false,
            response: true,
            selected: this.props.selected === this.props.response
        }

        return (
            <span>
                {this.generateItem(this.onMessageSelected, liClass, this.props.msgIndex, this.props.message.data)}
                {this.generateItem(this.onResponseSelected, respClass, this.props.msgIndex + '-resp', this.props.response && this.props.response.data)}
            </span>
        );
    }

    onMessageSelected() {
        this.props.onFrameSelected(this.props.selected === this.props.message ? null : this.props.message);
    }

    onResponseSelected() {
        this.props.onFrameSelected(this.props.selected === this.props.response ? null : this.props.response);
    }

    generateItem(callback, classes, key, message) {
        if (!message) {
            return null;
        }

        return (
            <li className={classNames(classes)} key={key}>
                <div><a href="#" onClick={callback}>{message}</a></div>
            </li>
        )
    }
}