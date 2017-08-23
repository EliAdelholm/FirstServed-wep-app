import React, {Component} from 'react';

class ActionButton extends Component {

    render() {
        const buttonType = this.props.primary ? "btn btn-primary" : "btn btn-transparent";
        const {available} = this.props;

        return (
            <button className={buttonType} onClick={() => this.props.onClick(this.props.actionType, available)} disabled={this.props.disabled && this.props.disabled}>
                {this.props.actionType === "Book" &&
                <div>
                    <p className="inline" dangerouslySetInnerHTML={{__html: available.content.rendered}}/>
                    <p className="inline" style={{paddingLeft: 5}}>- {available.acf.timeframe}</p>
                </div>
                }
                {this.props.actionType === "isWaiting" && "Leave waiting list"}
                {this.props.actionType === "Waiting" && "Join waiting list"}
                {this.props.actionType === "Website" && this.props.disabled && "Fully booked"}
                {this.props.actionType === "Website" && !this.props.disabled && "Regular booking"}
            </button>
        )
    }
}

export default ActionButton;

