import React, { createContext } from 'react'
import PropTypes from 'prop-types'
export const UserContext = createContext()
// This context provider is passed to any component requiring the context
export const UserProvider = ({ children }) => {
  let store = {
    daterange: {
      arrivalDate          : null,
      departureDate        : null,
      appointmentDate      : null,
      arrivalDateValidity  : null,
      departureDateValidity: null,
      hideLateReason       : false,
      lateReasonData       : null,
    },
  }
  const callbackLists = {}
  const eventHub = {
    /**
    * create custom event triggers
    * @param {string} eventName - name of the event
    * @param {*} data - type of data
    */
    trigger(eventName, data) {
      const callbackList = callbackLists[eventName]
      if (!callbackList) {
        return
      }
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < callbackList.length; i++) {
        callbackList[i](data)
      }
    },
    /**
    * Recieve data in customly triggered events via eventHub.trigger
    * @param {string} eventName - name of the event
    * @param {function} callback - the callback function
    */
    on(eventName, callback) {
      if (!callbackLists[eventName]) {
        callbackLists[eventName] = []
      }
      callbackLists[eventName].push(callback)
    },
  }
  /**
 * converts path into an Object value structure
 * @param {*} obj - store value
 * @param {*} pathArr - path example can be "['daterange','arrivalDate']"
 * @param {*} value - value of the path
 */
  const createObjectFromPath = (obj, pathArr, value) => {
    const tempObj = obj
    if (pathArr.length === 1) {
      tempObj[pathArr[0]] = value
      return store
    }
    if (tempObj[pathArr[0]]) {
      return createObjectFromPath(tempObj[pathArr[0]], pathArr.slice(1), value)
    }
    tempObj[pathArr[0]] = {}
    return createObjectFromPath(tempObj[pathArr[0]], pathArr.slice(1), value)
  }
  /**
 * Updates store value
 * @param {*} path - path example can be "daterange.arrivalDate"
 * @param {*} value - value of the path
 */
  const updateStore = (path, value) => {
    if (!path || typeof path !== 'string' || (path && path.length < 0)) {
      return
    }
    const tempStore = {
      ...store,
      ...createObjectFromPath(store, path.split('.'), value),
    }
    store = tempStore
    // setStoreChange(tempStore)
  }
  return (
    <UserContext.Provider
      value={{
        store,
        eventHub,
        updateStore,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
