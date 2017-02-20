import superagent from 'superagent'

import { parseXls } from '../components/DropMyMarkFiles/DropMyMarkFiles'

export const
    REQUEST_DATA = 'REQUEST_DATA',
    RECEIVE_DATA = 'RECEIVE_DATA',
    SHOW_TOOLTIP = 'SHOW_TOOLTIP',
    HIDE_TOOLTIP = 'HIDE_TOOLTIP',
    RECEIVE_OTHER_MARK_FILES = 'RECEIVE_OTHER_MARK_FILES',
    RECEIVE_MY_MARK_FILES = 'RECEIVE_MY_MARK_FILES',
    CHANGE_LAYER_ORIENTATION = 'CHANGE_LAYER_ORIENTATION',
    CHANGE_LAYER_ACTIVE = 'CHANGE_LAYER_ACTIVE',
    ANIMATION_FINISH = 'ANIMATION_FINISH',
    SAVE_COORDS = 'SAVE_COORDS',
    SWAP_LAYER_BARS = 'SWAP_LAYER_BARS',
    ON_CLEAR_OTHER_MARK_FILES = 'ON_CLEAR_OTHER_MARK_FILES',
    ON_CLEAR_MY_MARK_FILES = 'ON_CLEAR_MY_MARK_FILES'

export const onClearOtherMarkFiles = () => ({
  type: ON_CLEAR_OTHER_MARK_FILES
})

export const onClearMyMarkFiles = () => ({
  type: ON_CLEAR_MY_MARK_FILES
})

export const swapLayerBars = (layerBarId1, layerBarId2) => ({
  type: SWAP_LAYER_BARS,
  layerBarId1,
  layerBarId2
})

export const changeLayerOrientation = (name, vertical) => ({
  type: CHANGE_LAYER_ORIENTATION,
  name,
  vertical
})

export const changeLayerActive = (name, active) => ({
  type: CHANGE_LAYER_ACTIVE,
  name,
  active
})


export const showTooltip = (coords, item) => ({
  type: SHOW_TOOLTIP,
  coords,
  item
})

export const hideTooltip = () => ({
  type: HIDE_TOOLTIP
})

export const requestData = () => ({
  type: REQUEST_DATA
})

export const receiveMarks = (items, files) => ({
  type: RECEIVE_OTHER_MARK_FILES,
  items,
  files
})

export const receiveExcel = (items, files) => ({
  type: RECEIVE_MY_MARK_FILES,
  items,
  files
})

export const receiveData = (items) => ({
  type: RECEIVE_DATA,
  items:
      items
      .map((item, i) => {return {...item, id: i}})
      .filter(item => item['моя оценка'] !== '-' && item['моя оценка'] !== '' && 'моя оценка' in item )
  ,
  receivedAt: Date.now(),
  fileName: 'a1argus.xls'
})

export const animationFinish = () => ({
  type: ANIMATION_FINISH
})

export const saveCoords = (coordsObj) => ({
  type: SAVE_COORDS,
  coordsObj
})


export const fetchData = () => dispatch => {
  dispatch(requestData())

  return superagent
      .get(`http://a1argus.ru/kpsegmentor/static/data/a1argus.xls`)
      .end((err, res) =>  dispatch(receiveData(parseXls(res.text))))
}
