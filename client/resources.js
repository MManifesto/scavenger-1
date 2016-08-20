/* @flow */
import R from 'ramda'
import toastr from 'toastr'
import { camelizeKeys, decamelizeKeys } from 'humps'

import Routes, { INDEX } from './api'

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

export const index = (resource: Object) => apiRequest(resource.route(INDEX)).then(R.map(camelizeKeys))
export const get = (resource: Object, uid: string) => apiRequest(resource.route(uid)).then(camelizeKeys)
export const put = (resource: Object, uid: string, payload: Object) => apiRequest(resource.route(uid), 'PUT', payload).then(camelizeKeys)
export const post = (resource: Object, uid: string, payload: Object) => apiRequest(resource.route(uid), 'POST', payload).then(camelizeKeys)
export const del = (resource: Object, uid: string) => apiRequest(resource.route(uid), 'DELETE')

export type StoryType = {
  uid: string,
  defaultHint: string,
  clues: Array<string>,
}

const storyFactory = (args: Object): StoryType => ({
  uid: null,
  defaultHint: '',
  clues: [],
  ...args,
})

export type ClueType = {
  uid: string,
  storyUid: string,
  hint: string,
  mediaUrl: string,
  answerUids: Array<string>,
}

const clueFactory = (args: Object): ClueType => ({
  uid: null,
  storyUid: null,
  text: '',
  hint: '',
  mediaUrl: '',
  answerUids: [],
  ...args,
})

export type AnswerType = {
  uid: string,
  storyUid: string,
  clueUid: string,
  pattern: string,
  nextClue: string,
}

const answerFactory = (args: Object): AnswerType => ({
  uid: null,
  storyUid: null,
  clueUid: null,
  pattern: '',
  nextClue: '',
  ...args,
})

export const Story = {
  route: Routes.story,
  new: storyFactory,
  type: 'STORY',
}

export const Clue = {
  route: Routes.clue,
  new: clueFactory,
  type: 'CLUE',
}

export const Answer = {
  route: Routes.answer,
  new: answerFactory,
  type: 'ANSWER',
}

export type ResourceType = 'STORY' | 'CLUE' | 'ANSWER'
