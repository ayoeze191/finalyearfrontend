import axios, { type AxiosRequestConfig } from 'axios'
import { computed, ref, watch } from 'vue'
import { useAuth } from './auth'
const BASE_URL = 'http://localhost:3000/'
export const useApi = (
  endpoint: string,
  multipart: boolean,
  access_token?: string,
  params?: any
) => {
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: access_token ? `Bearer ${access_token}` : undefined,
      'Content-Type': multipart ? 'multipart/form-data' : 'application/json',
    },
    params: params,
  })
  const data = ref()
  const loading = ref(false)
  const status = ref()
  const error = ref()
  const del = () => {
    loading.value = true
    error.value = undefined
    console.log(endpoint)
    return api
      .delete(endpoint)
      .then((res) => {
        data.value = res.data
        status.value = res.status
      })
      .catch((e) => {
        error.value = e

        throw e
      })
      .finally(() => (loading.value = false))
  }
  const post = (payload?: any) => {
    loading.value = true
    error.value = undefined
    const contentType = multipart ? 'multipart/form-data' : 'application/json'
    return (
      api
        .post(endpoint, payload, { headers: { 'Content-Type': contentType } })
        // Update data
        .then((res) => {
          data.value = res.data
          status.value = res.status
        })
        .catch((e) => {
          console.log(e.response.data.message)
          // If anything goes wrong, update the error variable
          error.value = e.response.data.message
          throw e
        })
        .finally(() => (loading.value = false))
    )
  }
  const get = (query?: Record<string, any>, config?: AxiosRequestConfig) => {
    loading.value = true
    error.value = undefined

    let queryString = ''

    if (query) {
      queryString =
        '?' +
        Object.entries(query)
          .map(
            ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join('&')
    }

    return api
      .get(
        // BASE_URL +
        endpoint + queryString,
        config
      )
      .then((res) => {
        data.value = res.data
        status.value = res.status
      })
      .catch((e) => {
        error.value = e
        throw e
      })
      .finally(() => (loading.value = false))
  }
  const put = (payload?: any) => {
    loading.value = true
    error.value = undefined
    return (
      api
        .put(endpoint, payload)
        // Update data
        .then((res) => {
          data.value = res.data
          status.value = res.status
        })

        .catch((e) => {
          // If anything goes wrong, update the error variable
          error.value = e
          throw e
        })
        .finally(() => (loading.value = false))
    )
  }
  return {
    loading,
    data,
    status,
    error,
    get,
    post,
    put,
    // patch,
    del,
    // errorMessage,
    // errorDetails,
    // errorFields,
    // computedClasses,
  }
}

export const useApiWithAuth = (endpoint: string, multipart: boolean, params?: any) => {
  const { token } = useAuth()
  // console.log(token?.value, 'Token')
  return useApi(endpoint, multipart, token?.value ? token.value : undefined, params)
}
