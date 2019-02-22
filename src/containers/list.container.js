import { connect } from 'react-redux'
import List from "../components/List"
import {newVariable} from "../actions"
const mapStateToProps = (state, ownProps) => {
    return ({
        ...state,
        ...ownProps
    })};
const mapDispatchToProps = dispatch => ({
    newVariable: (variable)=>{
        dispatch(newVariable(variable));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List)
