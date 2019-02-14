const caseList = (state={}, action) => {
    switch (action.type) {
        case "IMPORT_DIR":
            return {
                ...state,
              ...action.caseList   // 相同默认覆盖
            };
        case "NEW_LIST":
            return {
                ...action.caseList
            };
        default: return state
    }
};
export default caseList;