export const initialState = { issues: [], filter: 'all', nextId: 1 };

export function issueReducer(state, action) {
  switch (action.type) {
    case 'ADD_ISSUE': {
      const title = action.payload.title.trim();
      if (!title) return state;
      return {
        ...state,
        issues: [...state.issues, { id: state.nextId, title, done: false }],
        nextId: state.nextId + 1,
      };
    }
    case 'TOGGLE_ISSUE':
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.payload.id ? { ...i, done: !i.done } : i
        ),
      };
    case 'DELETE_ISSUE':
      return { ...state, issues: state.issues.filter((i) => i.id !== action.payload.id) };
    case 'SET_FILTER':
      return { ...state, filter: action.payload.filter };
    case 'CLEAR_DONE':
      return { ...state, issues: state.issues.filter((i) => !i.done) };
    default:
      return state;
  }
}