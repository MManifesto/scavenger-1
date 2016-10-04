/* @flow */
import { expect } from 'chai'
import R from 'ramda'

import at from '../action-types'
import reducer from './answer'
import { changeAnswer, setAnswer } from '../actions'
import { Answer, Clue, Story } from '../resources'
import type {AnswerType} from '../resources'

describe('Answer Reducer', function() {
  const startAnswer: Object = Answer.new({
    uid: 'STORY:CLUE:ANSWER',
    storyUid: 'STORY',
    clueUid: 'STORY:CLUE',
    pattern: 'my-pattern',
    nextClue: 'STORY:MY-NEXT-CLUE',
  })
  const startAnswers = {
    [startAnswer.uid]: startAnswer,
  }

  const newAnswer: any = Answer.new({
    uid: 'STORY:NEWCLUE:NEWANSWER',
    storyUid: 'NEWSTORY',
    clueUid: 'STORY:NEWCLUE',
    pattern: 'new pattern',
    nextClue: 'STORY:NEW-NEXT-CLUE',
  })

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(at.load(Answer.type), function() {
    it('should overwrite answers', function() {
      const payload = {
        [newAnswer.uid]: newAnswer,
      }
      const action = {
        type: at.load(Answer.type),
        payload
      }
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql(payload)
    });
  });

  describe(at.change(Answer.type), function() {
    it('should change fields on answer', function() {
      const action = changeAnswer([startAnswer.uid, 'pattern'], '42')
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({
        [startAnswer.uid]: {
          ...startAnswer,
          pattern: '42',
        }
      })
      expect(newState[startAnswer.uid]).not.to.equal(startAnswer)
    });
  });

  describe(at.set(Answer.type), function() {
    it('should overwrite the answer', function() {
      const newAnswer = R.assoc('pattern', 'new-pattern', startAnswer)
      const action = setAnswer(newAnswer)
      const newState = reducer(startAnswers, action)
      expect(newState[startAnswer.uid]).to.eql(newAnswer)
    });
  });

  describe(at.del(Answer.type), function() {
    it('should delete the answer', function() {
      const action = {type: at.del(Answer.type), payload: {uid: startAnswer.uid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    });
  });

  describe(at.del(Clue.type), function() {
    it("should delete the answer if its clue is deleted", function() {
      const action = {type: at.del(Clue.type), payload: {uid: startAnswer.clueUid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    });
  });

  describe(at.del(Story.type), function() {
    it("should delete the answer if its story is deleted", function() {
      const action = {type: at.del(Story.type), payload: {uid: startAnswer.storyUid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    });
  });
});
