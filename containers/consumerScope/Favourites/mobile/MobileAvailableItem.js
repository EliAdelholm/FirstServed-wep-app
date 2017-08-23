import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import FavIcon from '../../../../assets/icons/favourite-true.png';
import TimeIcon from '../../../../assets/images/clock.png';

import '../favourites.css';

class AvailableItem extends Component {

    render() {
        const {data, available} = this.props;
        const [any] = this.props.available;

        if (!any) {
            return null;
        }

        return (
            <div className="col-xs-12 visible-xs c-favourites__item">
                <div className="col-xs-3">
                    <img src={FavIcon} alt="Favourite" className="c-favourites__icon c-favourites__heart"
                         onClick={() => this.props.onRemoveFav(data.ID)}/>
                </div>

                <div className="col-xs-9 c-favourites__item-info">
                    <Link to={data.slug}><p className="active-text">{data.title.rendered}</p></Link>
                    {available && available.map((table, i) => (
                        <div  className="row" key={i} style={{marginBottom: 20, paddingLeft: 15}}>
                            <div className="col-xs-4" style={{padding: 0}}>
                                <div className="small-text" dangerouslySetInnerHTML={{__html: table.content.rendered}}/>
                                <img src={TimeIcon} alt="Arrival time" className="inline c-favourites__time"/>
                                <p className="small-text inline">{table.acf.timeframe}</p>
                            </div>
                            <div className="col-xs-8 text-right">
                                <button className="btn btn-transparent" onClick={() => this.props.onPopup(data, table)}>
                                    <p className="medium-text">Book table</p>
                                </button>
                            </div>
                        </div>
                    ))}

                </div>


            </div>
        )
    }
}

export default AvailableItem;

