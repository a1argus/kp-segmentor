import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import './ItemInfo.css'

const fields = ['русскоязычное название', 'оригинальное название', 'год', 'страны', 'жанры', 'моя оценка', 'чужая оценка']

export default class ItemInfo extends Component {
	static propTypes = {
		active: PropTypes.bool.isRequired,
		item: PropTypes.object.isRequired,
		coords: PropTypes.object.isRequired,
	}



	render() {
		const {active, item, coords} = this.props

		let row = _(item)
		.keys()
		.filter(key => fields.includes(key))
		.sortBy(key => fields.indexOf(key))
		.map(key => (
			<div
				key={key}
			>
				<span className='item-info__value'>{item[key]}</span>
				<span  className='item-info__description'>{' //' + key}</span>
			</div>)
		)
		.value()

		return (
			<div
				className='item-info'
				style={{top: coords.y + 'px', left: coords.x + 'px', position: 'absolute'}}
			>
				{active ? row : null}
			</div>
		)
	}
}