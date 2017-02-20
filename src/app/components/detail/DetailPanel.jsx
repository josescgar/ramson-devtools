import React from 'react';

export default class DetailPanel extends React.Component {

    render() {
        return (
            <div>
                {this.props.message.data}
            </div>
        )
    }
}