import Immutable from 'seamless-immutable';

const share = (state=[], action) => {
    switch (action.type) {
        case "CHANGE_SHARE":
            return Immutable(action.share);
        default: return Immutable(state)
    }
};
export default share;