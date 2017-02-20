import React, { PropTypes, Component } from 'react'
import { hashCode } from "../../../modules/utils"
import { colorSolo, colorCompare } from "../../../modules/colors"
import './Dot.css'

export default class Dot extends Component {
    static propTypes = {
        coords: PropTypes.object.isRequired,
        item: PropTypes.object.isRequired,
        dotProps: PropTypes.object.isRequired
    }

    componentWillReceiveProps(nextProps) {
        nextProps.dotProps.saveCoords(false, nextProps.coords, nextProps.item.id)
    }

    componentWillMount() {
        this.props.dotProps.saveCoords(false, this.props.coords, this.props.item.id)
    }

    render() {
        const {coords, item, dotProps} = this.props
        let fill  =  dotProps.compare ? colorCompare(item) : colorSolo(item)

        let lastCoordsArray = [coords]
        if (dotProps.coordsObj && item.id in dotProps.coordsObj) {
            lastCoordsArray = dotProps.coordsObj[item.id]
        }

        return (
            <g
                className='dot'
                transform={`translate(${coords.x}, ${coords.y})`}
            >
                {
                    lastCoordsArray.map((lastCoords, i) => (
                        <circle
                            key={i + hashCode(JSON.stringify(dotProps.layerBars))}
                            r={dotProps.radius}
                            onMouseOver={dotProps.onMouseOver.bind(null, coords, item)}
                            onMouseOut={dotProps.onMouseOut}
                            style={{
                            fill,
                            transform:
                                `translateX(${dotProps.animating ? lastCoords.svgX - coords.svgX : 0}px)` + 
                                `translateY(${dotProps.animating ? lastCoords.svgY - coords.svgY : 0}px)`
                            ,
                            transition: '1s'
                        }}
                        />
                    ))
                }
            </g>
        )
    }
}
