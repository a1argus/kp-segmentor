import React, { PropTypes, Component } from 'react'
import { padding, getChildSize,  getChildCoords, getChildLayerIndex } from '../LayerBlock/LayerBlock'
import { hashCode } from '../../../modules/utils'
import './LayerBackBlock.css'

export default class LayerBackBlock extends Component {
    static propTypes = {
        coords: PropTypes.object.isRequired,
        size: PropTypes.object.isRequired,
        layerIndex: PropTypes.number.isRequired,
        layers: PropTypes.array.isRequired,
    }

    render() {
        const {coords, layerIndex, size, layers} = this.props

        if(layerIndex < 0 || layerIndex >= layers.length) {
            return (
                <rect
                    className='chart__back-block'
                    x={coords.x}
                    y={coords.y}
                    width={size.w}
                    height={size.h}
                />
            )
        }
        else {
            let layer = layers[layerIndex]
            return (
                <g className='chart__layer-back-block' transform={`translate(${coords.x}, ${coords.y})`}>
                    {layer.variants.map((variant, variantI) => {
                        let childSize = getChildSize(layer, size, padding)
                        let childCoords = getChildCoords(layer, coords, size, padding, variantI)
                        let childLayerIndex = getChildLayerIndex(layers, layerIndex)
                        return (
                            <g key={variantI + hashCode(JSON.stringify(layers))}>
                                <LayerBackBlock
                                    size={childSize}
                                    coords={childCoords}
                                    layerIndex={childLayerIndex}
                                    layers={layers}
                                />
                            </g>
                        )
                    })}
                </g>
            )
        }
    }
}

