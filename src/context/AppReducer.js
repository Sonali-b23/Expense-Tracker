const AppReducer = (state, action) => {
  switch(action.type) {
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      }
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      }
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode
      }
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      }
    case 'SET_CATEGORY_BUDGET': {
      const { category, limit } = action.payload;
      const categoryBudgets = { ...state.categoryBudgets };
      const value = Number(limit);
      if (limit !== '' && Number.isFinite(value) && value > 0) {
        categoryBudgets[category] = value;
      } else {
        delete categoryBudgets[category];
      }
      return {
        ...state,
        categoryBudgets
      }
    }
    default:
      return state;
  }
}

export default AppReducer;