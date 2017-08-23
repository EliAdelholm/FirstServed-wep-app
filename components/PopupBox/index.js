import React, {Component} from 'react';

import closeIcon from '../../assets/icons/nav-close.png';

import './popup.css';

class PopupBox extends Component {

    handleLeftClick = () => {
        this.props.onLeftClick();
    };

    handleRightClick = () => {
        this.props.onRightClick();
    };

    render() {

        return (
            <div className="o-popup">
                {this.props.close &&
                <img src={closeIcon} alt="Close Popup" className="o-popup-close" onClick={this.props.onClose}/>
                }
                {this.props.icon &&
                <img className="hidden-xs o-popup-icon" src={this.props.icon} alt="Popup icon"/>
                }
                {this.props.title &&
                <h4 className="o-popup__title">{this.props.title}</h4>
                }
                <div className="o-popup__text">{this.props.text}</div>
                {this.props.extra &&
                <div className="o-popup__extra">{this.props.extra}</div>
                }
                {this.props.btnLeft &&
                <button className="o-popup__button o-popup__button-left"
                        onClick={this.handleLeftClick}>{this.props.btnLeft}</button>
                }
                {this.props.btnRight &&
                <button className="o-popup__button o-popup__button-right"
                        onClick={this.handleRightClick}>{this.props.btnRight}</button>
                }
            </div>
        )
    }
}

export default PopupBox;

