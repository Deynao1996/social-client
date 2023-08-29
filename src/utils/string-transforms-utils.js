export function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getFullName(lastName, name) {
  return `${capitalizeString(lastName)} ${capitalizeString(name)}`
}

export function replaceFirebaseEndpoint(url, cfg = '') {
  if (!url) return
  return (
    url.replace(
      /https:\/\/firebasestorage.googleapis.com\/v0\/b\/social-b02bb.appspot.com/g,
      process.env.REACT_APP_IMAGEKIT_ENDPOINT
    ) + cfg
  )
}
