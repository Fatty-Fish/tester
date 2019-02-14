import { connect } from 'react-redux'
import Tool from "../components/Tool";
import {ifEnable} from "../actions";
const mapStateToProps = (state, ownProps) => {
    return ({
        ...state
    })};
const mapDispatchToProps = dispatch => ({
    ifEnable: (boo, auth, path)=> {
        dispatch(ifEnable(boo, auth, path))
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tool)
