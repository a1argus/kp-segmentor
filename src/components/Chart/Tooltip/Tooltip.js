import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import './Tooltip.css'

const fields = ['русскоязычное название', 'оригинальное название', 'год', 'страны', 'жанры', 'моя оценка', 'чужая оценка']

export default class Tooltip extends Component {
    static propTypes = {
        coords: PropTypes.object.isRequired,
        active: PropTypes.bool.isRequired,
        item: PropTypes.object.isRequired,
    }

    render() {
        const {active, item, coords} = this.props

        let rows = _(item)
        .keys()
        .filter(key => fields.includes(key))
        .sortBy(key => fields.indexOf(key))
        .map(key => (
            <div
                key={key}
            >
                <span className='tooltip__value'>{item[key]}</span>
                <span  className='tooltip__description'>{' //' + key}</span>
            </div>)
        )
        .value()

        return (
            active
            ?
                <div
                    className='tooltip'
                    style={{top: coords.svgY + 20 + 'px', left: coords.svgX + 10 + 'px', position: 'absolute'}}
                >
                    {rows}
                </div>
            :
                null
        )
    }
}

