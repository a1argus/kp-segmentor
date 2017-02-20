import React, { Component, PropTypes } from 'react'
import $ from 'jquery'
import DropFiles from '../DropFiles/DropFiles'

export function parseXls(xls) {
	let items = $('tr', xls).toArray()
	let headers = $('td', items[0]).toArray().map(header => $(header).text())

	items = items
	.slice(1)
	.map((item, i) => {
		let itemObj = {}
		$('td', item).toArray().forEach((value, i) => {
			itemObj[headers[i]] = $(value).text()
		})
		itemObj['id'] = i
		return itemObj
	})
	.filter(item => item['моя оценка'] !== '-' )
	
	return items
}

function onDropMyMarks(file) {
	const { receiveItems } = this.props;
	let reader = new FileReader()
	reader.onload = e => {
		receiveItems.bind(null, parseXls(e.target.result), [file.name])()
	}
	reader.readAsText(file, 'cp1251')
}	

class DropMyMarkFiles extends Component {
	static propTypes = {
		receiveItems: PropTypes.func.isRequired,
		message: PropTypes.string.isRequired,
		files: PropTypes.array.isRequired,
		coords: PropTypes.object.isRequired,
		onClear: PropTypes.func.isRequired,
	}


	render() {
		return <DropFiles {...this.props} onDrop={onDropMyMarks.bind(this)} />
	}
}

export default DropMyMarkFiles