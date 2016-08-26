/* @flow */
import toastr from 'toastr'
import { camelizeKeys, decamelizeKeys } from 'humps'
import R from 'ramda'

const story = (uid: string) => `/api/stories/${uid}`
const clue = (uid: string) => `/api/clues/${uid}`
const answer = (uid: string) => `/api/answers/${uid}`

const Routes = {
    story, clue, answer,
}

export default Routes

export const INDEX_ROUTE = ''

const handleError = err => {
  toastr.error(err, 'Error');
  throw err
}

const processResponse = (respPromise) => {
  return respPromise.then(resp => {
    return resp.json().catch(() => {
      throw resp.statusText
    })
  }).then(json => {
    if (json.error) {
      throw json.error
    }
    return json.data
  }).catch(handleError)
}

const apiRequest = (route, method: MethodType='GET', payload=undefined) => {
  const options: Object = {
    method,
  }
  if (payload !== undefined) {
    options.body = JSON.stringify(decamelizeKeys(payload))
  }
  return processResponse(fetch(route, options))
}

export const INDEX = (resource: Object) => apiRequest(resource.route(INDEX_ROUTE)).then(R.map(camelizeKeys))
export const GET = (resource: Object, uid: string) => apiRequest(resource.route(uid)).then(camelizeKeys)
export const PUT = (resource: Object, uid: string, payload: Object) => apiRequest(resource.route(uid), 'PUT', payload).then(camelizeKeys)
export const DELETE = (resource: Object, uid: string) => apiRequest(resource.route(uid), 'DELETE').then(() => ({uid}))

export type apiT = { GET: typeof GET, PUT: typeof PUT, DELETE: typeof DELETE, INDEX: typeof INDEX }
