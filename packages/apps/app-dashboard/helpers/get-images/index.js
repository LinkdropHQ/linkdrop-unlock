export default ({ src }) => {
  let image
  let imageRetina
  try {
    image = require(`assets/images/${src}.png`)
    imageRetina = require(`assets/images/${src}@2x.png`)
  } catch (e) {
    console.info('cannot find appropriate image according to src and/or cannot find retina version')
  }
  return {
    image,
    imageRetina
  }
}
