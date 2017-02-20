import * as colorbrewer from 'colorbrewer'
import * as d3 from 'd3'

let colorScale = d3.scaleLinear()
.domain([
	-9,
	-2,
	-1,
	0,
	1,
	2,
	9
])
.range([
	'#00f',
	'#A5A5FF',
	'#ddf',
	'#ddd',
	'#fdd',
	'#FFA5A5',
	'#f00'
])
.interpolate(d3.interpolateRgb)

let colorScaleRedSolo = d3.scaleQuantize()
.domain([1, 10])
.range(colorbrewer.Reds[9])

export function colorCompare(item) {
	let delta = (
		Math.floor(parseFloat(item['чужая оценка'])) -
		Math.floor(parseFloat(item['моя оценка']))
	)

	return colorScale(delta)
}

export function colorSolo(item) {
	return colorScaleRedSolo(Math.floor(parseFloat(item['моя оценка'])))
}