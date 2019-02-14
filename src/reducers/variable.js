const variable = (state=[], action) => {
    switch (action.type) {
        // case 'INT_CASE_LIST':
        //     return Object.assign({}, state, {...action.caseList});
        // case 'ADD_TODO':
        //     return [
        //         ...state,
        //         {
        //             id: action.id,
        //             text: action.text,
        //             completed: false
        //         }
        //     ]
        // case 'TOGGLE_TODO':
        //     return state.map(todo =>
        //         (todo.id === action.id)
        //             ? {...todo, completed: !todo.completed}
        //             : todo
        //     )
        default:
            return state
    }
};

export default variable
