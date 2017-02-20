import { combineReducers } from 'redux'
import update from 'react-addons-update'
import _ from 'lodash'


import {
    REQUEST_DATA,
    RECEIVE_DATA,
    HIDE_TOOLTIP,
    SHOW_TOOLTIP,
    RECEIVE_MY_MARK_FILES,
    RECEIVE_OTHER_MARK_FILES,
    CHANGE_LAYER_ACTIVE,
    CHANGE_LAYER_ORIENTATION,
    ANIMATION_FINISH,
    SAVE_COORDS,
    SWAP_LAYER_BARS,
    ON_CLEAR_OTHER_MARK_FILES,
    ON_CLEAR_MY_MARK_FILES
} from '../actions'

const items = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return action.items.slice()
    case RECEIVE_OTHER_MARK_FILES:
      let stateItems = state.slice()
      action.items.forEach(actionItem => {
        let idx = stateItems.findIndex(stateItem => {
            return (
              (stateItem['русскоязычное название'] === actionItem.nameRus) &&
              (stateItem['год'] === actionItem.year)
            )
        })
        if(idx >= 0) {
          stateItems[idx]['чужая оценка'] = actionItem.rating
          stateItems[idx]['сериал'] = actionItem.seriesFlag
        }
      })
      return stateItems
    case RECEIVE_MY_MARK_FILES:
      return action.items
    case ON_CLEAR_MY_MARK_FILES:
      return []
    case ON_CLEAR_OTHER_MARK_FILES:
      return state.slice().map(item => _.omit(item, (['чужая оценка', 'сериал'])))
    default:
      return state
  }
}


const fetching = (state = {loading: false}, action) => {
  switch (action.type) {
    case REQUEST_DATA:
      return {loading: true}
    case RECEIVE_DATA:
      return {loading: false}
    default:
      return state
  }
}

const tooltip = (state = {active: false, coords: {svgX: 0, svgY: 0}, item: {}}, action) => {
  switch (action.type) {
    case SHOW_TOOLTIP:
      return {active: true, coords: action.coords, item: action.item}
    case HIDE_TOOLTIP:
      return {active: false, coords: {svgX: 0, svgY: 0}, item: {}}
    default:
      return state
  }
}

const compare = (state = false, action) => {
  switch (action.type) {
    case RECEIVE_OTHER_MARK_FILES:
      return true
    case RECEIVE_MY_MARK_FILES:
      return false
    case ON_CLEAR_OTHER_MARK_FILES:
      return false
    default:
      return state
  }
}

const layers = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_LAYER_ACTIVE:
      return update(state, {
        [action.name]: {active: {$set: action.active}}
      })
    case CHANGE_LAYER_ORIENTATION:
      return update(state, {
        [action.name]: {vertical: {$set: action.vertical}}
      })
    default:
      return state
  }
}

const animation = (state = {animating: false, coordsObj: {}, saving: false}, action) => {
  switch (action.type) {
    case SAVE_COORDS:
      return {...state, coordsObj: Object.assign({}, action.coordsObj), saving: false}
    case ON_CLEAR_OTHER_MARK_FILES:
    case ON_CLEAR_MY_MARK_FILES:
    case RECEIVE_OTHER_MARK_FILES:
    case RECEIVE_MY_MARK_FILES:
      return {...state, saving: true}
    case SWAP_LAYER_BARS:
    case RECEIVE_DATA:
    case CHANGE_LAYER_ORIENTATION:
    case CHANGE_LAYER_ACTIVE:
      return {...state, animating: true, saving: true}
    case ANIMATION_FINISH:
      return  {...state, animating: false, saving: false}
    default:
      return state
  }
}

const layerBars = (state = {}, action) => {
  switch (action.type) {
    case SWAP_LAYER_BARS:
      return update(state, {
        [action.layerBarId1]: {layerId: {$set: state[action.layerBarId2].layerId}},
        [action.layerBarId2]: {layerId: {$set: state[action.layerBarId1].layerId}}
      })    
    default:
      return state
  }
}

const upload = (state = {myMarkFiles: [], otherMarkFiles: []}, action) => {
  switch (action.type) {
    case ON_CLEAR_OTHER_MARK_FILES:
      return {...state, otherMarkFiles: []}
    case ON_CLEAR_MY_MARK_FILES:
      return {...state, myMarkFiles: [], otherMarkFiles: []}
    case RECEIVE_DATA:
         return{...state, myMarkFiles: [action.fileName]}
    case RECEIVE_OTHER_MARK_FILES:
      return {...state, otherMarkFiles: [...state.otherMarkFiles, ...action.files]}
    case RECEIVE_MY_MARK_FILES:
      return {...state, myMarkFiles: [...action.files], otherMarkFiles: []}
    default:
      return state
  }
}



const rootReducer = combineReducers({
  items,
  fetching,
  tooltip,
  compare,
  layers,
  animation,
  layerBars,
  upload
})

export default rootReducer
