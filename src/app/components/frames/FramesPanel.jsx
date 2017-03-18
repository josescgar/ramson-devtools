import React from 'react';
import Messages from '../../constants/Messages';
import Frame from './Frame.jsx';

import css from './frames.less';

const KEY_UP = 38;
const KEY_DOWN = 40;

export default class FramesPanel extends React.Component {

    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        document.body.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyDown);
    }

    render() {
        let messages = [];
        this.selectedIndex = -1;

        this.props.frames.forEach((msg, index) => {
            
            let response = null;
            let print = true;

            if (msg === this.props.selected) {
                this.selectedIndex = index;
            }

            if (this.props.showGrouped) {

                let msgId = msg.json && msg.json.id || null;

                //If it is a send message and in group mode, look for the response
                if (msgId && msg.type === Messages.TYPE_SEND) {

                    let responseIndex = this.props.groupings[msgId][Messages.TYPE_RECEIVE];
                    response = responseIndex && this.props.frames[responseIndex];

                //Don't show only responses when in grouped mode
                } else if (msgId && Messages.TYPE_RECEIVE) {
                    print = false;
                }

            }

            if (print) {
                messages.push(<Frame message={msg} key={index} msgIndex={index} selected={this.props.selected} response={response} onFrameSelected={this.props.onFrameSelected}/>);
            }
        });


        return (
            <div className="panel">
                <ul>
                    {messages}
                </ul>
            </div>
        );
    }

    handleKeyDown(event) {
        if (this.selectedIndex === -1 || [KEY_UP, KEY_DOWN].indexOf(event.keyCode) === -1) {
            return;
        }

        let increment = event.keyCode === KEY_UP ? -1 : 1;
        let newIndex = (this.selectedIndex + increment) % this.props.frames.length;
        if (newIndex < 0) {
            newIndex = this.props.frames.length + newIndex;
        }

        this.props.onFrameSelected(this.props.frames[newIndex]);
    }

}