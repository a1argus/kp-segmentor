import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
//import update from 'react-addons-update'

import './App.css'



import {
    fetchData,
    showTooltip,
    hideTooltip,
    receiveMarks,
    receiveExcel,
    changeLayerOrientation,
    changeLayerActive,
    animationFinish,
    saveCoords,
    swapLayerBars,
    onClearMyMarkFiles,
    onClearOtherMarkFiles
} from '../actions'
import Chart from '../components/Chart/Chart'
import DropOtherMarkFiles from '../components/DropOtherMarkFiles/DropOtherMarkFiles'
import DropMyMarkFiles from '../components/DropMyMarkFiles/DropMyMarkFiles'

let coordsObj = {}
let reading = true;

class App extends Component {
    static propTypes = {
        fetching: PropTypes.object.isRequired,
        items: PropTypes.array.isRequired,
        tooltip: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        layers: PropTypes.object.isRequired,
        layerBars: PropTypes.object.isRequired,
        upload: PropTypes.object.isRequired,
    }

    componentWillReceiveProps() {
        coordsObj = {}
        reading = true
    }
    
    componentDidMount() {
        this.props.dispatch(fetchData())
    }

    componentDidUpdate() {
        const { dispatch, animation} = this.props
        if(animation.animating) { setTimeout(() => dispatch(animationFinish()), 0) }
    }

    onMouseOver(coords, item) {
        this.props.dispatch(showTooltip(coords, item))
    }

    onMouseOut() {
        this.props.dispatch(hideTooltip())
    }

    saveCoords(last, coords, id) {
        if(last) {
            reading = false
            this.props.dispatch(saveCoords(coordsObj))
        }
        else {
            if(reading) {
                if (!(id in coordsObj)) { coordsObj[id] = [] }
                coordsObj[id].push(coords)
            }
        }
    }

    onReceiveOtherMarks(items, files) {
        this.props.dispatch(receiveMarks(items, files))
    }

    onReceiveMyMarks(items, files) {
        this.props.dispatch(receiveExcel(items, files))
    }


    onClearOtherMarkFiles() {
        this.props.dispatch(onClearOtherMarkFiles())
    }

    onClearMyMarkFiles() {
        this.props.dispatch(onClearMyMarkFiles())
    }


    changeLayerActive(layerName, ev) {
        this.props.dispatch(changeLayerActive(layerName, ev.target.checked))
    }

    changeLayerOrientation(layerName, ev) {
        this.props.dispatch(changeLayerOrientation(layerName, ev.target.checked))
    }

    onLayerBarDrop(layerBarId1, layerBarId2) {
        this.props.dispatch(swapLayerBars(layerBarId1, layerBarId2))
    }




    render() {
        const { items, fetching, tooltip, compare, layers, animation, layerBars, upload } = this.props
        //console.log("app render"+JSON.stringify(_.omit(animation, ['coordsObj'])))
        return (
            <div className='app'>
                <div className='site-container'>
                    {
                        fetching.loading
                        ?
                            <h2>Loading...</h2>
                        :
                            <Chart
                                items={compare ? items.filter(item => 'чужая оценка' in item) : items}
                                svgSize={{w: 500, h: 500, axisW: 0, axisH: 0}}
                                dotProps={{
                                    onMouseOver: this.onMouseOver.bind(this),
                                    onMouseOut: this.onMouseOut.bind(this),
                                    saveCoords: this.saveCoords.bind(this),
                                    compare,
                                    radius: 5,
                                    coordsObj: animation.coordsObj,
                                    animating: animation.animating,
                                    layerBars
                                }}
                                tooltip={tooltip}
                                layers={layers}
                                layerBars={layerBars}
                                saving={animation.saving}
                                layerBarProps={{onLayerBarDrop: this.onLayerBarDrop.bind(this)}}
                            />
                    }
                    <DropMyMarkFiles
                        receiveItems={this.onReceiveMyMarks.bind(this)}
                        files={upload.myMarkFiles}
                        message='Загрузите ваши оценки (xls)'
                        coords={{x: 720, y: 0}}
                        onClear={this.onClearMyMarkFiles.bind(this)}
                    />
                    <DropOtherMarkFiles
                        receiveItems={this.onReceiveOtherMarks.bind(this)}
                        files={upload.otherMarkFiles}
                        message='Загрузите чужие оценки (html)'
                        coords={{x: 720, y: 260}}
                        onClear={this.onClearOtherMarkFiles.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
  const { items, fetching, tooltip, compare, layers, animation, layerBars, upload } = state
  return {
      items,
      fetching,
      tooltip,
      compare,
      layers,
      animation,
      layerBars,
      upload
  }
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(App))
