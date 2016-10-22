/* @flow */
import Animate from 'react-addons-css-transition-group'
import { handleActions } from 'redux-actions'
import { connect } from 'react-redux'
import R from 'ramda'
export const CREATE_TOAST = 'CREATE_TOAST'
export const HIDE_TOAST = 'HIDE_TOAST'

let id = 1

type optionsT = {
  id: string,
  title?: string,
  message?: string,
}

type action = {
  type: string,
  payload: Object,
}

export const createToast = (payload: optionsT): action => ({
  type: CREATE_TOAST,
  payload,
})

export const hideToast = (payload: optionsT): action => ({
  type: HIDE_TOAST,
  payload,
})

export const toast = (options: Object) => (title: string, message: ?string) => (dispatch: Function) => {
  const key = String(id++)
  dispatch(createToast({
    id: key,
    title,
    message,
    ...options
  }))
  setTimeout(() => dispatch(hideToast({ id: key, })), 3000)
}

export const successToast = toast({type: 'success'})
export const errorToast = toast({type: 'error'})

export type WispState = {[id: string]: optionsT}
const DEFAULT_STATE:WispState = {}
export const wispReducer: (state: optionsT, action: Object) => optionsT = handleActions({
  [CREATE_TOAST]: (state, { payload }) => R.assoc(payload.id, payload, state),
  [HIDE_TOAST]: (state, { payload }) => R.dissoc(payload.id, state),
}, DEFAULT_STATE)

const statusToClass = {
  'success': 'is-success',
  'error': 'is-danger',
}

export const Toasts = connect(({toasts}) => ({toasts}))(({toasts}) => {
  return (
    <Animate className="toasts" transitionName="toast" transitionEnterTimeout={200} transitionLeaveTimeout={400}>
    {R.map((({title, message, id, type}) => (
      <div key={id} className={`notification ${statusToClass[type]}`}>
        {title && <h1 className="subtitle">{title}</h1>}
        {message && <h2 className="subtitle">{message}</h2>}
      </div>
    )), R.values(toasts))}
  </Animate>
) })
