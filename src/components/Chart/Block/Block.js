import React, { PropTypes, Component } from 'react'
import Dot from '../Dot/Dot'
import { hashCode } from '../../../modules/utils'
import _ from 'lodash'
import './Block.css'


export default class Block extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        size: PropTypes.object.isRequired,
        coords: PropTypes.object.isRequired,
        dotProps: PropTypes.object.isRequired,
    }

    render() {
        const {items, size, dotProps, coords} = this.props
        let dots = null
        if(items.length !== 0) {
            let dotSize = 2 * dotProps.radius
            let dotDeltaW = dotSize
            let dotDeltaH = dotSize
            let nw = Math.max(Math.floor(size.w / dotSize), 1)
            let nh = Math.max(Math.floor(size.h / dotSize), 1)
            let horizontal = (nh === 1) && (size.h < size.w)


            if(horizontal) { //horizontal gradient of dots
                dotDeltaW = 0
                if ((size.w - dotSize) > 0 && (Math.ceil(items.length / nh) - 1) > 0) { //horizontal gradient of dots
                    dotDeltaW = (size.w - dotSize) / (Math.ceil(items.length / nh) - 1)
                }
                if (dotDeltaW > dotSize) { //chain of dots just touching each other
                    dotDeltaW = dotSize
                }
            }
            else {
                dotDeltaH = 0
                if ((size.h - dotSize) > 0 && (Math.ceil(items.length / nw) - 1) > 0) { //vertical gradient of dots
                    dotDeltaH = (size.h - dotSize) / (Math.ceil(items.length / nw) - 1)
                }
                if (dotDeltaH > dotSize) { //chain of dots just touching each other
                    dotDeltaH = dotSize
                }
            }

            let getMark
            if(dotProps.compare) {
                getMark = (item) =>
                    (Math.floor(parseFloat(item['чужая оценка'])) - Math.floor(parseFloat(item['моя оценка'])))
            }
            else {
                getMark = (item) =>
                    Math.floor(parseFloat(item['моя оценка']))
            }

            dots = _(items)
            .sortBy(item => getMark(item) + item.id/1000000)
            .map((item, i) => {
                let x = dotSize/2 + (horizontal ? dotDeltaW * i : dotDeltaW * (i % nw))
                let y = size.h - (dotSize/2 + (horizontal ? 0 : dotDeltaH * Math.floor(i / nw)))
                return (
                   /* <ReactTransitionGroup

                        component='g'
                    >*/
                        <Dot
                            key={i + hashCode(JSON.stringify(dotProps.layerBars))}
                            coords={{
                                x: x,
                                y: y,
                                svgX: coords.svgX + x,
                                svgY: coords.svgY + y
                            }}
                            item={item}
                            dotProps={dotProps}
                        />
                    /* </ReactTransitionGroup>*/
                )    
            })
            .value()
        }
        return (
            <g transform={`translate(${coords.x}, ${coords.y})`}>
                {dots}
            </g>
        )
    }
}