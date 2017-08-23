import React, {Component} from 'react';
import NumericInput from 'react-numeric-input';
import {connect} from 'react-redux';
import moment from 'moment';

import * as MyActions from '../../../actions/MyActionCreator';

import RestaurantNav from '../../../components/RestaurantNav';
import PopupBox from '../../../components/PopupBox';

import TableItem from './TableItem';

import AvailableTableIcon from '../../../assets/icons/tables-available.png';
import BookedTableIcon from '../../../assets/icons/tables-booked.png';
import WaitingActiveIcon from '../../../assets/icons/waiting-tables-grey.png';

import '../restaurant.css';

class RestaurantHome extends Component {
    state = {isLoading: false, peopleNumber: 2, viewWaiting: false, isPosting: false, deletedIDs: [], updating: false};

    handleUpdate = async() => {
        this.setState({updating: true});
        const {onRequestRestaurantTables, onRequestUsers} = this.props;
        const [user] = this.props.user;

        await onRequestRestaurantTables(user.acf.restaurant_id);
        await onRequestUsers();
        this.setState({updating: false});
    };

    async componentDidMount() {
        this.interval = setInterval(this.handleUpdate, 5000);
        const {onRequestRestaurantData, onRequestRestaurantTables, onRequestUsers, onRequestUserData} = this.props;
        const [ user ] = this.props.user;
        this.setState({isLoading: true});

        if (!user) {
                await onRequestUserData();
        }

        try {
            const [ user ] = this.props.user;
            await onRequestRestaurantData(user.slug);
            await onRequestRestaurantTables(user.acf.restaurant_id);

            onRequestUsers();

            this.setState({isLoading: false})

        } catch (err) {
            console.error(err);
            this.setState({isLoading: false})
        }

    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    handleValidTime = (time) => {
        let now = moment().format('HH:mm');
        return time > now;
    };

    handleViewWaiting = () => {
        this.setState({viewWaiting: !this.state.viewWaiting})
    };

    handlePeople = (valueAsString) => {
        this.setState({peopleNumber: valueAsString})
    };

    handlePostTable = async(e) => {
        e.preventDefault();
        const {onPostAvailableTable, onRequestRestaurantTables} = this.props;
        const [ user ] = this.props.user;
        const content = this.state.peopleNumber + ' people';
        this.setState({isPosting: true});

        try {
            await onPostAvailableTable(user.acf.restaurant_id, content);
        } catch (err) {
            console.error(err);
        }
        await onRequestRestaurantTables(user.acf.restaurant_id);

        this.handleTimeframe();
    };

    handleTimeframe = async() => {
        const {tables, onSetTableTimeframe, onRequestRestaurantTables} = this.props;
        const [ restaurant ] = this.props.restaurantData;

        let tablesById = tables.map((tab, i) => (
            tab.id && tab.id
        ));

        let validIds = tablesById.filter(function (item) {
            return typeof item === 'number';
        });

        let id = validIds[validIds.length - 1];

        const duration = moment.duration({'minutes': restaurant.acf.time_frame});
        const time = moment().add(duration).format('HH:mm');

        const availableTime = restaurant.acf.available_active ? restaurant.acf.available_for : null;

        console.log(time);

        await onSetTableTimeframe(id, {
                "fields": {
                    "timeframe": time,
                    "available_for": availableTime,
                }
            }
        );

        await onRequestRestaurantTables(restaurant.id);

        const {waitingUsers} = this.props;
        let waiters = waitingUsers.filter(function (user) {
            return user.acf.member_type === "User" && user.acf.waiting_for.includes(restaurant.id) && user.acf.notifications;
        });

        const numbers = waiters.map(function (waiter) {
            return waiter.acf.phone.replace(/\s/g, '');
        });

        const name = restaurant.title.rendered;


        window.location.href = "http://api.firstserved.co/notify.php?name=" + name + "&numbers=" + numbers;

    };

    handleDeleteTable = async(id) => {
        const {onDeleteAvailableTable} = this.props;

        this.setState({isLoading: true});

        try {
            await onDeleteAvailableTable(id);

            this.setState({isLoading: false, deletedIDs: this.state.deletedIDs.concat([id])});

        } catch (err) {
            console.error(err);
        }

    };

    render() {
        const {tables, waitingUsers} = this.props;
        const [ restaurant ] = this.props.restaurantData;
        const deletedIDs = this.state.deletedIDs;

        let waiters = waitingUsers.filter(function (user) {
            return user.acf.member_type === "User" && user.acf.waiting_for.includes(restaurant.id);
        });

        let findValues = waiters.map(function (user) {
            return user.acf.table_for;
        });

        let uniqueValue = findValues.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });

        let userCount = (value) => {
            return waiters.filter(function (waiter) {
                return waiter.acf.table_for === value;
            }).length

        };

        let filtered = tables.filter(function (item) {
            return deletedIDs.indexOf(item.id) === -1;
        });

        function myFormat(num) {
            return num + ' people';
        }

        let date = moment().format('MMMM Do YYYY, HH:mm');


        return (
            <div className="row c-table">
                <RestaurantNav pageTitle={restaurant && restaurant.title.rendered} icon="settings"/>

                <div className="c-table__split-line"></div>

                <div className="col-xs-12">

                    {/*Submit Table Form*/}
                    <form className="c-table__form col-xs-12" onSubmit={this.handlePostTable}>
                        <p className="small-text passive-text">Available table for</p>
                        <NumericInput mobile={true} min={2} max={20} value={this.state.peopleNumber}
                                      disabled={this.state.isLoading}
                                      onChange={(valueAsString) => this.handlePeople(valueAsString)} format={myFormat}
                                      style={{
                                          wrap: {
                                              background: 'transparent',
                                              border: '1px solid #998670',
                                          },
                                          input: {
                                              borderRadius: 0,
                                              background: 'transparent',
                                              border: 'none'
                                          },
                                          'input:not(.form-control)': {
                                              border: 'none',
                                              lineHeight: 2,
                                              width: 250
                                          },
                                          'input:focus': {
                                              border: 'none',
                                              outline: 'none'
                                          },
                                          'btnUp.mobile': {
                                              borderLeft: '1px solid #998670'
                                          },
                                          'btnDown.mobile': {
                                              borderRight: '1px solid #998670'
                                          },
                                          arrowDown: {
                                              borderTopColor: 'rgba(66, 54, 0, 0.63)'
                                          },
                                          plus: {
                                              background: '#dbdbdb'
                                          },
                                          minus: {
                                              background: '#dbdbdb'
                                          }
                                      }}/>
                        <div className="c-table__publish">
                            <button type="submit" className="btn btn-primary">Publish</button>
                        </div>
                    </form>

                    {/*Main Content Shows Up When Done Loading*/}
                    {!this.state.isLoading &&
                    <div>

                        {/*Available Tables Section*/}
                        <div className="col-xs-12 col-sm-5 col-md-4 col-md-offset-1" style={{padding: 0}}>
                            <div className="c-table__item-header col-xs-12 passive-text">
                                <img src={AvailableTableIcon} alt="Available Tables"
                                     className="hidden-xs c-table__table-icon" style={{
                                    marginTop: 7
                                }}/>
                                <p className="small-text desktop-uppercase pull-left" style={{marginBottom: 0}}>
                                    Available tables</p>
                                <p className="small-text pull-right hidden-sm hidden-md hidden-lg hidden-xl"
                                   style={{marginBottom: 0}}>{date}</p>
                            </div>
                            <div className="c-table__item-list col-xs-12">
                                {filtered && filtered.map((table, i) => (
                                    <div key={i}>
                                        {table.parent === 0 && !table._links.children && this.handleValidTime(table.acf.timeframe) &&
                                        <TableItem table={table} children="null" onDelete={this.handleDeleteTable}/>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/*Booked Tables Section*/}
                        <div className="col-xs-12 col-sm-5 col-sm-offset-1 col-md-4 col-md-offset-2"
                             style={{padding: 0}}>
                            <div className="c-table__item-header col-xs-12 passive-text">
                                <img src={BookedTableIcon} alt="Booked Tables"
                                     className="hidden-xs c-table__table-icon"/>
                                <p className="small-text desktop-uppercase" style={{marginBottom: 0}}>Booked tables</p>
                            </div>
                            <div className="c-table__item-list col-xs-12 passive-text">
                                {filtered && filtered.map((table, i) => (
                                    <div key={i}>
                                        {table.parent === 0 && table._links.children &&
                                        <TableItem table={table} children={tables}/>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    }

                    {/*Waiting List Information*/}
                    <div
                        className="col-xs-12 col-sm-6 col-sm-offset-6 col-md-4 col-md-offset-8 c-table__waiting-list-fixed"
                        style={{padding: 0, cursor: "pointer"}}>
                        <div className="c-table__waiting-list col-xs-12" onClick={this.handleViewWaiting}>
                            <p className="visible-xs active-text">Waiting list</p>
                            <img src={WaitingActiveIcon} alt="waiting list" className="inline"/>
                            <p className="medium-text inline hidden-sm hidden-md hidden-lg active-text"
                               style={{paddingLeft: 10}}>
                                {waiters.length}
                                {waiters.length !== 1 ? " people" : " person "}</p>
                            <p className="medium-text inline hidden-xs  active-text"
                               style={{paddingLeft: 10}}> {waiters.length}
                                {waiters.length !== 1 ? " people" : " person "} on waiting
                                list</p>

                            {/*Waiting List Information Popup*/}
                            {this.state.viewWaiting &&
                            <PopupBox close={true} onClose={this.handleViewWaiting}
                                      text={uniqueValue.length !== 0 ? uniqueValue.map((value, i) => (
                                          <div className="active-text c-waiting-tables">
                                              <p className="inline c-waiting-tables__people">Table
                                                  for {value}{value !== 1 ? " people" : " person "}</p>
                                              <p className="inline c-waiting-tables__number">
                                                  {userCount(value)} {userCount(value) !== 1 ? " users" : " user"}
                                              </p>
                                          </div>
                                      )) : "Your waiting list is empty"}
                            />
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect((state) => ({
    restaurantData: Object.values(state.restaurantDatas),
    tables: Object.values(state.restaurantTables),
    waitingUsers: Object.values(state.waitingUsers),
    user: Object.values(state.users),
}), {
    onRequestUserData: MyActions.requestUserData,
    onRequestRestaurantData: MyActions.fetchRestaurantData,
    onRequestRestaurantTables: MyActions.fetchRestaurantTables,
    onPostAvailableTable: MyActions.postAvailableTable,
    onSetTableTimeframe: MyActions.setTableTimeframe,
    onDeleteAvailableTable: MyActions.deleteAvailableTable,
    onRequestUsers: MyActions.requestAllUsers,
})(RestaurantHome);