/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'
import type { ResourceType } from '../resources'
import at from '../action-types'

const baseResourceReducer = (resourceType: ResourceType) => handleActions({
  [at.load(resourceType)]: (
    (state, {payload}) => payload.data
  ),

  [at.change(resourceType)]: (
    (state, {payload: {path, value}}) => R.assocPath(path, value, state)
  ),

  [at.set(resourceType)]: (
    (state, {payload}) => R.assoc(payload.uid, payload, state)
  ),

  [at.del(resourceType)]: (
    (state, {payload:{uid}}) => R.dissoc(uid, state)
  ),
})

export default (resourceType: ResourceType, reducer: Function) => (state: any, action: Object) => {
  const baseResult = baseResourceReducer(resourceType)(state, action)
  return reducer(baseResult, action)
}
