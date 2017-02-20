import React, { PropTypes, Component } from 'react'
import Block from '../Block/Block'
import { hashCode } from '../../../modules/utils'
import './LayerBlock.css'

export const padding = 1;

export function getChildSize(layer, size, padding) {
    let childW, childH
    if(layer.vertical) {
        childW = (size.w / layer.variants.length)
        childH = (size.h)
    } else {
        childW = (size.w)
        childH = (size.h / layer.variants.length)
    }
    return {
        w: ((childW < 2 * padding) ? childW / 2 : childW - 2 * padding),
        h: ((childH < 2 * padding) ? childH / 2 : childH - 2 * padding)
    }
}

export function getChildCoords(layer, coords, size, padding, variantI) {
    let x, y
    if(layer.vertical) {
        let childW = (size.w / layer.variants.length)
        let childH = (size.h)
        x = variantI * childW + ((childW < 2 * padding) ? childW/4 : padding)
        y = ((childH < 2 * padding) ? childH/4 : padding)
    } else {
        let childW = (size.w)
        let childH = (size.h / layer.variants.length)
        x = ((childW < 2 * padding) ? childW/4 : padding)
        y = size.h - ((variantI + 1) * childH - ((childH < 2 * padding) ? childH/4 : padding))
    }

    return {
        x: x,
        y: y,
        svgX: coords.svgX + x,
        svgY: coords.svgY + y
    }
}


export function getChildLayerIndex(layers, layerIndex) {
    return layerIndex + 1 < layers.length ? layerIndex + 1 : -1
}

export default class LayerBlock extends Component {
    static propTypes = {
        coords: PropTypes.object.isRequired,
        size: PropTypes.object.isRequired,
        items: PropTypes.array.isRequired,
        dotProps: PropTypes.object.isRequired,
        layerIndex: PropTypes.number.isRequired,
        layers: PropTypes.array.isRequired,
    }

    render() {
        const {coords, items, layerIndex, size, dotProps, layers} = this.props

        if(layerIndex < 0 || layerIndex >= layers.length) {
            return (
                <g className='chart__block'>
                    <Block
                        items={items}
                        size={size}
                        coords={coords}
                        dotProps={dotProps}
                    />
                </g>
            )
        }
        else {
            let layer = layers[layerIndex]
            return (
                <g className='chart__layer-block' transform={`translate(${coords.x}, ${coords.y})`}>

                    {layer.variants.map((variant, variantI) => {
                        let childSize = getChildSize(layer, size, padding)
                        let childCoords = getChildCoords(layer, coords, size, padding, variantI)
                        let childItems = items.filter(item => layer.splitter(item, variant, layer.variants))
                        let childLayerIndex = getChildLayerIndex(layers, layerIndex)
                        return (
                            <g key={variantI + hashCode(JSON.stringify(dotProps.layerBars))}>

                                <LayerBlock
                                    items={childItems}
                                    size={childSize}
                                    coords={childCoords}
                                    layerIndex={childLayerIndex}
                                    layers={layers}
                                    dotProps={dotProps}
                                />
                            </g>
                        )
                    })}
                </g>
            )
        }
    }
}

