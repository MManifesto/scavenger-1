/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Routes from '../routes'
import { getStoriesList } from '../reducers'

const stateToProps = (state) => ({
  storiesList: getStoriesList(state),
})

const Stories = ({storiesList}) => {
  const stories = storiesList.map(story => (
    <tr key={story.uid}>
      <td>
        <Link to={Routes.story(story.uid)}>
        {story.uid}
        </Link>
      </td>
    </tr>
  ))

  return (
    <div>
      <h1 className="title">Stories</h1>
      <table className="table is-bordered">
        <tbody>
          {stories}
          <tr>
            <td>
              <Link
                to={Routes.createStory()}
                className="button is-success"> + Add Story
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

Stories.propTypes = {
  story: React.PropTypes.object,
  storiesList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(Stories)
