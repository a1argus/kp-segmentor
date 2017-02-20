import React, { PropTypes, Component } from 'react'
import _ from 'lodash'

import LayerBlock from './LayerBlock/LayerBlock'
import LayerBackBlock from './LayerBackBlock/LayerBackBlock'
import LayerBar from './LayerBar/LayerBar'
import Tooltip from './Tooltip/Tooltip'
import './Chart.css'

export default class Chart extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        svgSize: PropTypes.object.isRequired,
        dotProps: PropTypes.object.isRequired,
        tooltip: PropTypes.object.isRequired,
        layers: PropTypes.object.isRequired,
        layerBars: PropTypes.object.isRequired,
        saving: PropTypes.bool.isRequired,
        layerBarProps: PropTypes.object.isRequired,
    }

    componentDidMount() {
        if(this.props.saving) { this.setTimeoutSaveCoords() }
    }

    componentDidUpdate() {
        if(this.props.saving) { this.setTimeoutSaveCoords() }
    }

    setTimeoutSaveCoords() {
        setTimeout(() => this.props.dotProps.saveCoords(true), 1500)
    }

    render() {
        const {layers, items, svgSize, dotProps, layerBars, layerBarProps, tooltip} = this.props
        let layersArray = _.sortBy(
            Object.values(layers)
            .map((layer) => {
                let layerBar = _(layerBars).find(layerBar => layerBar.layerId === layer.name)
                return {
                    ...layer,
                    order: layerBar.order,
                    vertical: layerBar.vertical,
                    active: layerBar.active
                }
            }),
            'order'
        )
        let coords = {x: 0, y: 0, svgX: 0, svgY: 0}
        let size = {w: 500, h: 500}


        return (
            <div className='chart'>
                <svg width={svgSize.w + svgSize.axisW} height={svgSize.h + svgSize.axisH}>
                    <g className='chart__screen'>
                        <rect
                            className='chart__back-block'
                            style={{fill: '#eee'}}
                            x={coords.x}
                            y={coords.y}
                            width={size.w}
                            height={size.h}
                        />
                        <LayerBackBlock
                            size={size}
                            coords={coords}
                            layerIndex={0}
                            layers={layersArray.filter(layer => layer.active)}
                        />
                        <LayerBlock
                           items={items}
                           size={size}
                           coords={coords}
                           layerIndex={0}
                           layers={layersArray.filter(layer => layer.active)}
                           dotProps={dotProps}
                        />
                    </g>
                </svg>

                <div className='chart__axis-y' style={{top: 0 + 'px', left: 500 + 'px', position: 'absolute'}}>
                    {
                        [0, 1].map((layerBarId, i) => {
                            return (
                                <LayerBar
                                    key={i}
                                    layers={layers}
                                    size={{w: 100, h: 500}}
                                    coords={{x: i*100, y: 0}}
                                    layerBarId={layerBarId}
                                    layerBars={layerBars}
                                    layerBarProps={layerBarProps}
                                />
                            )
                        })
                    }
                </div>
                <div className='chart__axis-x' style={{top: 500 + 'px', left: 0 + 'px', position: 'absolute'}}>
                    {
                        [2, 3].map((layerBarId, i) => {
                            return (
                                <LayerBar
                                    key={i}
                                    layers={layers}
                                    size={{w: 100, h: 500}}
                                    coords={{x: 0, y: i*100}}
                                    layerBarId={layerBarId}
                                    layerBars={layerBars}
                                    layerBarProps={layerBarProps}
                                />
                            )
                        })
                    }
                </div>
                <div className='chart__layer-bars' style={{top: 0 + 'px', left: 800 + 'px', position: 'absolute'}}>
                    {
                        [4, 5, 6, 7].map((layerBarId, i) => {
                            return (
                                <LayerBar
                                    key={i}
                                    layers={layers}
                                    size={{w: 100, h: 500}}
                                    coords={{x: i*100, y: 0}}
                                    layerBarId={layerBarId}
                                    layerBars={layerBars}
                                    layerBarProps={layerBarProps}
                                />
                            )
                        })
                    }
                </div>
                <Tooltip
                    {...tooltip}
                />
            </div>
        )   
    }
}