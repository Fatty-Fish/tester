import { connect } from 'react-redux';
import App from "../components/App";
import {importDirFn, newCaseList} from "../actions";
// import { renameDirFn } from "../js";
// toProps:
const mapStateToProps = (state, ownProps) => {
    return ({
    ...state
});};
const mapDispatchToProps = (dispatch, ownProps) => ({
    importDirFn: (caseList)=> {
        dispatch(importDirFn(caseList));
    },
    newCaseList: (caseList)=> {
        dispatch(newCaseList(caseList))
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
