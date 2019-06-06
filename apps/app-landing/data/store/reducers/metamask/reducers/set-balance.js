export default (state, { payload: { balance, balanceFormatted } }) => ({ ...state, mmBalance: balance, mmBalanceFormatted: balanceFormatted })
