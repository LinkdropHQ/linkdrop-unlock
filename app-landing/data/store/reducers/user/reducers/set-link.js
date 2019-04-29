export default (state, { payload: { link } }) => {
  console.log({ link })
  return { ...state, link }
}
