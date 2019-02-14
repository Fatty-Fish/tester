import Immutable from 'seamless-immutable';

let shareState = Immutable({
    showPeople: false,
    auth: "",
    pathArr: ""
});
export const IPAddress = (state="", action) => {
    switch (action.type) {

        default: return state
    }
};
export const per = (state="", action)=> {
    switch (action.type) {

        default:
            return state
    }
};
export const shares = (state = shareState, action) => {
    switch (action.type) {
        case "IF_ENABLE":
            return Immutable({
                showPeople: action.show,
                auth: action.auth,
                pathArr: action.path
            });
        default: return state
    }
};