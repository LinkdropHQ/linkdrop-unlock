export default (state, { payload: { balance, balanceFormatted } }) => ({ ...state, mmAssetBalance: balance, mmAssetBalanceFormatted: balanceFormatted })
