import React, {Component} from 'react';

import PopupBox from '../../../../components/PopupBox';

import clock from '../../../../assets/icons/tables-clock.png';
import contactPerson from '../../../../assets/images/contact-person.png';
import contactPhone from '../../../../assets/images/contact-phone.png';
import deleteDesktop from '../../../../assets/images/delete-desktop.png';
import deletePopup from '../../../../assets/icons/popup-deletetable.png';

import './table.css';

class TableItem extends Component {
    state = {viewBooking: false, viewDelete: false};

    handleViewDelete = () => {
        this.setState({viewDelete: !this.state.viewDelete})
    };

    handleDelete = () => {
        const {table} = this.props;
        this.props.onDelete(table.id);
    };

    handleViewBooking = () => {
        this.setState({viewBooking: !this.state.viewBooking})
    };

    render() {
        const {table, children} = this.props;

        return (
            <div className="c-table__item passive-text col-xs-12">

                {/*Table Information*/}
                <div className="pull-left c-table__item-info">
                    <div dangerouslySetInnerHTML={{__html: table.content.rendered}}/>
                    <img src={clock} alt="estimated time" className="inline c-table__item-clock"/>
                    <p className="medium-text inline" style={{paddingLeft: 10}}>Estimated
                        time: {table.acf.timeframe}</p>
                    {children !== "null" &&
                    <img src={contactPerson} alt="contact-person" className="c-table__item--contact-icon pull-right"
                         onClick={this.handleViewBooking}/>
                    }
                    {children === "null" &&
                    <img src={deleteDesktop} alt="delete table" className="c-table__item--contact-icon pull-right"
                         onClick={this.handleViewDelete}
                    />
                    }
                </div>

                {/*Delete Table Popup*/}
                {this.state.viewDelete &&
                <PopupBox icon={deletePopup} text="Are you sure you want to delete this table?"
                          btnLeft="Delete" btnRight="Cancel" onLeftClick={this.handleDelete}
                          onRightClick={this.handleViewDelete}/>
                }


                {/*View Booking Information*/}
                {children !== "null" && this.state.viewBooking && children.parent !== 0 && children.map((child, i) => (
                    <div key={i} className="col-xs-12 c-table__booking">
                        {child.parent === table.id &&
                        <div>

                            {/*Mobile Booking Expansion*/}
                            <div className="visible-xs">
                                <img src={contactPhone} alt="Contact phone" className="inline"/>
                                <div className="inline c-table__booking-text">
                                    <p dangerouslySetInnerHTML={{__html: child.content.rendered}}/>
                                    <p>{child.acf.phone}</p>
                                </div>
                            </div>

                            {/*Desktop Booking Popup*/}
                            <div className="hidden-xs">
                                <PopupBox close={true} onClose={this.handleViewBooking} title="Booking information" text={
                                    <div>
                                        <p dangerouslySetInnerHTML={{__html: child.content.rendered}}/>
                                        <p>{child.acf.phone}</p>
                                    </div>
                                }/>
                            </div>
                        </div>
                        }

                    </div>
                ))}


            </div>
        )
    }
}

export default TableItem;
