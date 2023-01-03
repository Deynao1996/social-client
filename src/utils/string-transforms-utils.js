export function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getFullName(lastName, name) {
  return `${capitalizeString(lastName)} ${capitalizeString(name)}`
}
