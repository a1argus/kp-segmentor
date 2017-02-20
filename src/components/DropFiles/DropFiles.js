import React, { Component, PropTypes } from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { DropTarget } from 'react-dnd'

import FileList from './FileList/FileList'
import DropButton from './DropButton/DropButton'
import FileOpenButton from './FileOpenButton/FileOpenButton'
import ClearButton from './ClearButton/ClearButton'
import './DropFiles.css'

const fileTarget = {
	drop(props, monitor) {
		props.onDrop.bind(null, monitor.getItem().files[0])()
	}
}

function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	}
}

class DropFiles extends Component {
	static propTypes = {
		receiveItems: PropTypes.func.isRequired,
		message: PropTypes.string.isRequired,
		files: PropTypes.array.isRequired,
		coords: PropTypes.object.isRequired,
		onClear: PropTypes.func.isRequired,
		onDrop: PropTypes.func.isRequired,
		
	}

	render() {
		const { message, files, coords, onClear, connectDropTarget, isOver, canDrop, onDrop } = this.props

		return connectDropTarget(
			(
				<div
					className='drop-files'
					style={{
						top: coords.x + 'px',
						left: coords.y + 'px',
						position: 'absolute',
						backgroundColor: (isOver && canDrop) ?  '#efe' : 'white'
					}}
				>
					<div>{message}</div>
					<FileList files={files}/>
					<div>
						<DropButton/>
						<FileOpenButton onDrop={onDrop}/>
						<ClearButton onClear={onClear}/>
					</div>	
				</div>
			)	
		)	
	}
}

export default DropTarget(
	NativeTypes.FILE,
	fileTarget,
	collect
)(DropFiles)