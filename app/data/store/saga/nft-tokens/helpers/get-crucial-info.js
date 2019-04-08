export default ({ tokens }) => tokens.map(({ token_id: id, image_preview_url: url, description, name }) => ({ token_id: id, image_preview_url: url, description, name }))
