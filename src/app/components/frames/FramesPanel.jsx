import React from 'react';
import Messages from '../../constants/Messages';
import Frame from './Frame.jsx';

import css from './frames.less';

export default class FramesPanel extends React.Component {
    render() {
        let messages = [];

            this.props.frames.forEach((msg, index) => {

                let response = null;
                let print = true;

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

}