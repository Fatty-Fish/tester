import { connect } from 'react-redux';
import ShareForm from "../components/ShareForm";
import Immutable from 'seamless-immutable';

import {changeShare, ifEnable} from "../actions";
import axios from "axios";

const mapStateToProps = (state, ownProps) => {
    return ({
        ...state,
    })};
const mapDispatchToProps = (dispatch, ownProps) => ({
    changeAuth: (share)=> {
        // 改变自己share
        dispatch(changeShare(share));
    },
    hidePeople: ()=> {
        dispatch(ifEnable(false, "", ""))
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShareForm)
