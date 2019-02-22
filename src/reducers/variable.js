const variable = (state=[], action) => {
    switch (action.type) {
        case "VAR_CHANGE":
            return [...action.variable];

        default:
            return state
    }
};

export default variable
