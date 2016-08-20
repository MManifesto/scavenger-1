/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Routes from '../routes'
import { Answers } from '../answer'
import { getClue, getAnswersByClue } from '../reducers'
import { changeClue, saveClue, deleteClue, changeTestMessage } from '../actions'
import { uidsFromParams, splitUid, getToolData } from '../reducers'
import type { AnswerType } from '../resources'

const findMatchingAnswer = (text: string, answers: Array<AnswerType>) => {
  const checkMatch = R.compose(R.not, R.isEmpty)
  const matcherFromAnswer = R.compose(R.match, R.prop('pattern'))
  const doesMatchText = (txt) => (answer) => {
    const matcher = matcherFromAnswer(answer)
    return R.compose(checkMatch, matcher)(txt)
  }
  return R.find(doesMatchText(text), answers)
}

const stateToProps = (state, {params}) => {
  const {clueUid} = uidsFromParams(params)
  return {
    clue: getClue(state, clueUid),
    testMessage: getToolData(state).testMessage,
    answers: getAnswersByClue(state, clueUid)
  }
}

const Clue = ({answers, clue, changeClue, saveClue, deleteClue, changeTestMessage, testMessage}) => {
  const matchingAnswer = findMatchingAnswer(testMessage, answers)
  const highlightAnswerUid = matchingAnswer ? matchingAnswer.uid : null
  return (
    <div className="message is-warning">
      <div className="message-header level is-marginless">
        {clue.uid}
        <button
          className="button is-danger is-pulled-right"
          onClick={() => deleteClue(clue.uid)}>
          Delete
        </button>
        <button
          className="button is-success is-pulled-right"
          onClick={() => saveClue(clue.uid)}>
          Save
        </button>
      </div>
      <div className="message-body">
        <label
          className="label"
          htmlFor="text">
          Text
        </label>
        <div className="control">
          <input
            id="text"
            className="input"
            value={clue.text || ''}
            onChange={(e) => changeClue([clue.uid, 'text'], e.target.value)} />
        </div>

        <label
          className="label"
          htmlFor="hint">
          Hint:
        </label>
        <div className="control">
          <input
            id="hint"
            className="input"
            value={clue.hint || ''}
            onChange={(e) => changeClue([clue.uid, 'hint'], e.target.value)} />
        </div>

        <label
          className="label"
          htmlFor="sender">
          Sender:
        </label>
        <div className="control">
          <input
            id="sender"
            className="input"
            value={clue.sender || ''}
            onChange={(e) => changeClue([clue.uid, 'sender'], e.target.value)} />
        </div>

        <hr/>
        <label
          className="label"
          htmlFor="test-message">
          Test a Message:
        </label>
        <div className="control">
          <input
            id="test-message"
            className="input"
            value={testMessage}
            placeholder="Enter a message (The matching answer will be highlighted)"
            onChange={(e) => changeTestMessage(e.target.value)} />
        </div>
        <label className="label">
          Answers
        </label>
        <Answers highlightUid={highlightAnswerUid} clueUid={clue.uid} />
      </div>
    </div>
  )
}

Clue.propTypes = {
  clue: React.PropTypes.object.isRequired,
  changeClue: React.PropTypes.func.isRequired,
  saveClue: React.PropTypes.func.isRequired,
  deleteClue: React.PropTypes.func.isRequired,
  changeTestMessage: React.PropTypes.func.isRequired,
  testMessage: React.PropTypes.string.isRequired,
  answers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps, {
  saveClue,
  changeClue,
  deleteClue: (uid) => (dispatch) => {
    const {storyUid} = splitUid(uid)
    dispatch(push(Routes.story(storyUid)))
    dispatch(deleteClue(uid))
  },
  changeTestMessage,
})(Clue)
