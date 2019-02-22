// 纯JavaScript对象, 行动指令
export const renameDirFn = (name, newName, from)=> {
    return {
        type: "RENAME_DIR",
        config: {
            name,newName,from
        }
    }
};
export const importDirFn = (caseList) => {
    return {
        type: "IMPORT_DIR",
        caseList
    }
};
export const changeShare = (share) =>{
    return {
        type: "CHANGE_SHARE",
        share
    }
};
export const ifEnable = (boo, auth, path)=> {
    return {
        type: "IF_ENABLE",
        show: boo,
        auth, path
    }
};
export const newCaseList = (caseList)=>{
    return {
        type: "NEW_LIST",
        caseList
    }
};
export const newVariable = (variable)=> {
    return {
        type: "VAR_CHANGE",
        variable
    }
}
// export const addTodo = text => {
//     return {
//         type: "ADD_TODO",
//         id: nextTodoId++,
//         text
//     };
// };
//
// export const setVisibilityFilter = filter => ({
//     type: "SET_VISIBILITY_FILTER",
//     filter
// });
//
// export const toggleTodo = id => ({
//     type: "TOGGLE_TODO",
//     id
// });
//
// export const VisibilityFilters = {
//     SHOW_ALL: "SHOW_ALL",
//     SHOW_COMPLETED: "SHOW_COMPLETED",
//     SHOW_ACTIVE: "SHOW_ACTIVE"
// };
