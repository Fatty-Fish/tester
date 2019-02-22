import { connect } from 'react-redux'
import Case from "../components/Case"
import {newVariable} from "../actions"

// toProps:
const mapStateToProps = (state, ownProps) => {
    return ({
        ...state,
        ...ownProps
    });};
const mapDispatchToProps = dispatch => ({
    newVariable: (variable)=> {
        dispatch(newVariable(variable));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Case)
