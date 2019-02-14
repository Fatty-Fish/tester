import { connect } from 'react-redux'
import List from "../components/List"

const mapStateToProps = (state, ownProps) => {
    return ({
        ...state,
        ...ownProps
    })};
const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List)
