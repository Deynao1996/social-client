import axios from 'axios'

const client = axios.create({
  // baseURL: 'http://localhost:5000/api'
  // headers: { 'Content-Type': 'application/json' }
})

export const request = ({ ...options }) => {
  const onSuccess = (response) => response
  const onError = (error) => {
    const {
      response: { data }
    } = error
    if (data.errorMessage) throw new Error(data.errorMessage)
    throw new Error('Something went wrong! Please try later!')
  }
  return client(options).then(onSuccess).catch(onError)
}
