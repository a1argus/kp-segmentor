import React, { PropTypes, Component } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import _ from 'lodash'


import ItemTypes from '../../../modules/ItemTypes'
import './LayerBar.css'


const dragSource = {
	beginDrag(props) {
		return {
			id: props.layerBarId,
		}
	},
	canDrag(props) {
		return true
	}
}

const dragCollect = (connect, monitor) => ({
	connectDragSource: connect.dragSource(),

})

const dropTarget = {
	drop(props, monitor) {
		props.layerBarProps.onLayerBarDrop.bind(null, monitor.getItem().id, props.layerBarId)()
	}
}

const dropCollect = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
})

function getLabelBar(layer, barSize, vertical, base = 0, padding = 5, gutter = 2) {
	let variantSize = barSize / layer.variants.length
	return layer.variants.map((variant, variantI) => {
		return (
			<g
				className='chart__layer-bar-label'
				key={variantI}
				transform={`translate(${vertical ? (base + variantSize * (variantI)) : 0}, ${!vertical ? (base + (barSize - variantSize * (variantI + 1))) : 0})`}
			>
				<rect
					key={variantI}
					x={vertical ? gutter : 0}
					y={!vertical ? gutter : 0}
					width={vertical ? variantSize - 2 * gutter : padding}
					height={!vertical ? variantSize - 2 * gutter : padding}
				/>
				<text
					transform={
						`translate(` +
							`${vertical ? (variantSize/2) : 2 * padding}, ` +
							`${!vertical ? (variantSize/2) : 2 * padding})` +
						`rotate(${vertical ? 90 : 0})`
					}
					dy='.3em'
				>
					{variant}
				</text>
			</g>
		)
	})
}

function getSubLabelBar(layer, barSize, vertical, parentVariantsNum) {
	let parentVariantSize = barSize / parentVariantsNum
	return _.range(parentVariantsNum).map((parentVariant, parentVariantI) => {
		return getLabelBar(layer, parentVariantSize, vertical, barSize - parentVariantSize*(parentVariantI + 1))
	})
}

function getEmptyBar() {
	return (
		<text>
		</text>
	)
}

function getParentVariantsNum(layerBar, layerBars, layers) {
	let parentVariantsNum = -1
	if(layerBar.parent >= 0 && layerBars[layerBar.parent].layerId !== '') {
		let parentLayerId = layerBars[layerBar.parent].layerId
		parentVariantsNum = layers[parentLayerId].variants.length
	}
	return parentVariantsNum
}

class LayerBar extends Component {
	static propTypes = {
		layers: PropTypes.object.isRequired,
		layerBarId: PropTypes.number.isRequired,
		layerBars: PropTypes.object.isRequired,
		layerBarProps: PropTypes.object.isRequired,
		canDrop: PropTypes.bool.isRequired,
		isOver: PropTypes.bool.isRequired
	}

	render() {
		const { layers, layerBarId, layerBars, coords, size, connectDropTarget, connectDragSource, canDrop, isOver } = this.props
		let layerBar = layerBars[layerBarId]
		let layer = layers[layerBar.layerId]
		let vertical = layerBar.vertical
		let width = vertical ? size.h : size.w
		let height = vertical ? size.w : size.h
		let empty = !layer
		let parentVariantsNum = getParentVariantsNum(layerBar, layerBars, layers)
		return (
			connectDropTarget(
				connectDragSource(
					<div
						className={ empty ? 'chart__layer-bar--empty' : 'chart__layer-bar'}
						style={{top: coords.y + 'px', left: coords.x + 'px', position: 'absolute'}}
					>
						<svg width={width} height={height}>
							<rect
								width={width}
								height={height}
							/>
							{
								empty
								? getEmptyBar()
								: parentVariantsNum >= 0
									? getSubLabelBar(layer, size.h, vertical, parentVariantsNum)
									: getLabelBar(layer, size.h, vertical)
							}
							{
								isOver &&
								canDrop &&
								<rect
									className='chart__layer-bar-green'
									width={width}
									height={height}
								/>
							}
							{
								isOver &&
								!canDrop &&
								<rect
									className='chart__layer-bar-red'
									width={width}
									height={height}
								/>
							}
						</svg>
					</div>
				)
			)
		)
	}
}

export default (
	DragSource(ItemTypes.LAYER,	dragSource,	dragCollect)(
		DropTarget(ItemTypes.LAYER,	dropTarget,	dropCollect)(
			LayerBar)))