import { ref } from 'vue'

interface HttpConfig {
  baseURL?: string
  headers?: Record<string, string>
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string>
}

interface HttpResponse<T> {
  data: T | null
  status: number | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  error: Error | null
}

export function useHttp(config: HttpConfig = {}) {
  const { baseURL = '', headers: defaultHeaders = {} } = config

  function createUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, baseURL)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return url.toString()
  }

  async function request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<HttpResponse<T>> {
    const response = ref<HttpResponse<T>>({
      data: null,
      status: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
    })

    const { method = 'GET', headers = {}, params, body, ...restConfig } = config

    try {
      const url = createUrl(endpoint, params)

      const fetchResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...restConfig,
      })

      response.value.status = fetchResponse.status

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status}`)
      }

      const data = await fetchResponse.json()

      response.value.data = data
      response.value.isSuccess = true
    } catch (error) {
      response.value.isError = true
      response.value.error = error instanceof Error ? error : new Error('Unknown error')
    } finally {
      response.value.isLoading = false
    }

    return response.value
  }

  const get = <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' })

  const post = <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'POST', body: data })

  const put = <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PUT', body: data })

  const patch = <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PATCH', body: data })

  const del = <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' })

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  }
}
