import { connect } from 'react-redux'
import Case from "../components/Case"

// toProps:
const mapStateToProps = (state, ownProps) => {
    return ({
        ...state,
        ...ownProps
    });};
const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Case)
