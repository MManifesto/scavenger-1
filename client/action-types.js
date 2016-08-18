export const load = (resourceType) => `LOAD_${resourceType.toUpperCase()}`
export const change = (resourceType) => `CHANGE_${resourceType.toUpperCase()}`
export const set = (resourceType) => `SET_${resourceType.toUpperCase()}`
export const del = (resourceType) => `DELETE_${resourceType.toUpperCase()}`

export const CHANGE_EXPLORER = 'CHANGE_EXPLORER'
export const SEND_MESSAGE = 'SEND_MESSAGE'
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
export const REORDER_ANSWER = 'REORDER_ANSWER '

export const START_DRAG = 'START_DRAG'
export const STOP_DRAG = 'STOP_DRAG'
