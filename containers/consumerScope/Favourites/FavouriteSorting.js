import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import * as MyActions from '../../../actions/MyActionCreator';

import MobileAvailableItem from './mobile/MobileAvailableItem';
import DesktopAvailableItem from './desktop/DesktopAvailableItem';
import MobileWaitingItem from './mobile/MobileWaitingItem';
import DesktopWaitingItem from './desktop/DesktopWaitingItem';
import MobileWebsiteItem from './mobile/MobileWebsiteItem';
import DesktopWebsiteItem from './desktop/DesktopWebsiteItem';

class FavouriteItem extends Component {
    state = {isLoading: false, updating: false};

    handleToggleWait = (restaurant, toggle) => {
        console.log(toggle);
        if (toggle) {
            console.log("leave list");
            this.props.onLeaveWait(restaurant);
        } else {
            console.log("join list");
            this.props.onJoinWait(restaurant);
        }
    };

    render() {
        const {data, tables, view, waitingList} = this.props;

        let toggle = waitingList.includes(data.id);

        let available = tables.filter(function (table) {
            if(table.parent === 0 && !table._links.children && table.acf.timeframe) {
                if(table.acf.timeframe > moment().format('HH:mm')) {
                    return table.post === data.id;
                }
            } else {
                return null;
            }
        });

        const [any] = available;

        return (
            <div>
                {view !== "Waiting" && available &&
                <div>
                    <MobileAvailableItem data={data} available={available}
                                         onRemoveFav={() => this.props.onRemoveFav(data.id)}
                                         onPopup={this.props.onPopup}
                    />
                    <DesktopAvailableItem data={data} available={available}
                                          onRemoveFav={() => this.props.onRemoveFav(data.id)}
                                          onPopup={this.props.onPopup}
                    />
                </div>
                }

                {view !== "Available" &&
                <div>
                    <MobileWaitingItem data={data} toggle={toggle} view={view}
                                       onRemoveFav={() => this.props.onRemoveFav(data.id)}
                                       onToggleWait={() => this.handleToggleWait(data.id, toggle)}
                    />
                    <DesktopWaitingItem data={data} toggle={toggle} view={view} available={available}
                                        onRemoveFav={() => this.props.onRemoveFav(data.id)}
                                        onToggleWait={() => this.handleToggleWait(data.id, toggle)}
                    />
                </div>
                }

                {view === "All" && !any && !data.acf.queue_active &&
                <div>
                    <MobileWebsiteItem data={data} onRemoveFav={() => this.props.onRemoveFav(data.id)}/>
                    <DesktopWebsiteItem data={data} onRemoveFav={() => this.props.onRemoveFav(data.id)}/>
                </div>
                }
            </div>
        )
    }
}

export default FavouriteItem;
