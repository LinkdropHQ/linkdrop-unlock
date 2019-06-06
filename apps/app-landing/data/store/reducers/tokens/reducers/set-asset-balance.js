export default (state, { payload: { balance, balanceFormatted } }) => ({ ...state, assetBalance: balance, assetBalanceFormatted: balanceFormatted })
