import React, { Component, PropTypes } from 'react'
import './FileOpenButton.css'

class FileOpenButton extends Component {
	static propTypes = {
		onDrop: PropTypes.func.isRequired,
	}

	onChange(e) {
		this.props.onDrop.bind(null, e.target.files[0])()
	}
	
	render() {
		return (
			<div className='drop-files__file-open-button'>
				<label>
					<div>Open</div>
					<input
						type='file'
						onChange={this.onChange.bind(this)}
						onClick={(event)=> { event.target.value = null }}
					/>
				</label>
			</div>
		)
	}
}

export default FileOpenButton