import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import _ from 'lodash'
import 'bootstrap/dist/css/bootstrap.css'


import reducer from './reducers'
import App from './containers/App'
import layersInit from './modules/layersInit'
import layerBarsInit from './modules/layerBarsInit'
const middleware = [ thunk ]


if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
    reducer,
    {
        items: [],
        fetching: {loading: false},
        tooltip: {active: false, coords: {x: 0, y: 0, svgX: 0, svgY: 0}, item: {}},
        compare: false,
        layers: _.keyBy(layersInit, 'name'),
        animation: {coordsObj: [], animating: false, saving: false},
        layerBars: _.keyBy(layerBarsInit, 'id'),
        upload: { myMarkFiles: [], otherMarkFiles: []}
    },    
    applyMiddleware(...middleware)
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
