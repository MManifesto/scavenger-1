import {connect} from 'react-redux'
import {Link} from 'react-router'
import Routes, {CREATE} from 'routes'
import * as Res from 'resources'
import {Answers} from 'answer'
import {getClue, getCluesListByStory } from 'reducers'
import {changeClue, saveClue} from 'actions'
import {push} from 'react-router-redux'
import {uidsFromParams} from 'reducers'

const stateToProps = (state, {params}) => {
    const {clueUid} = uidsFromParams(params)
    return {
        clue: getClue(state, clueUid),
    }
}
const Clue = ({clue, changeClue, saveClue}) => {
    return (
        <div className="panel panel-warning">
            <div className="panel-heading">
                {clue.uid}
                <a className="pull-right" onClick={() => saveClue(clue.uid)} >Save</a>
            </div>
            <div className="panel-body">
                <div className="form-group">
                    <label htmlFor="text"> Text </label>
                    <input
                        id="text"
                        className="form-control"
                        value={clue.text || ''}
                        onChange={(e)=>changeClue([clue.uid, 'text'], e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="hint"> Hint: </label>
                    <input
                        id="hint"
                        className="form-control"
                        value={clue.hint || ''}
                        onChange={(e)=>changeClue([clue.uid, 'hint'], e.target.value)}
                    />
                </div>
                <h3> Answers </h3>
            </div>
            <Answers clueUid={clue.uid} />
    </div>
    )
}
Clue.propTypes = {
    clue: React.PropTypes.object.isRequired,
    changeClue: React.PropTypes.func.isRequired,
    saveClue: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, { saveClue, changeClue })(Clue)
