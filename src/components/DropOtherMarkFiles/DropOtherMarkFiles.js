import React, { Component, PropTypes } from 'react'
import $ from 'jquery'
import DropFiles from '../DropFiles/DropFiles'

function onDropOtherMarks(file) {
	const { receiveItems } = this.props;
	let reader = new FileReader()
	reader.onload = e => {
		let txt = e.target.result
		let items = $('.item', txt).toArray().map(d => {
			let name = $('.info .nameRus a', d).text()
			let rating = $('.vote', d).text()
			let match = (/(.*)\s\(([^)]*)\)$/).exec(name)
			let year = 0, seriesFlag = false, nameRus = name
			if (match) {
				nameRus = match[1]
				year = match[2]
				if (match[2].split(", ").length > 1) {
					year = match[2].split(", ")[1]
					seriesFlag = true
				}
			}
			return {
				nameRus,
				rating,
				seriesFlag,
				year
			}
		})
		receiveItems.bind(null, items.filter(item => item.rating !== '' ), [file.name])()
	}
	reader.readAsText(file, 'cp1251')
}

class DropOtherMarkFiles extends Component {
	static propTypes = {
		receiveItems: PropTypes.func.isRequired,
		message: PropTypes.string.isRequired,
		files: PropTypes.array.isRequired,
		coords: PropTypes.object.isRequired,
		onClear: PropTypes.func.isRequired,
	}


	render() {
		return <DropFiles {...this.props} onDrop={onDropOtherMarks.bind(this)} />
	}
}

export default DropOtherMarkFiles