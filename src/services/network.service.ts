import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

class NetworkService {
  private api: AxiosInstance

  constructor (baseURL: string) {
    this.api = axios.create({
      baseURL: baseURL,
      timeout: 30000
    })
  }

  private async requestHandler (callback: () => Promise<any>) {
    const { data, status } = await callback()

    switch (status) {
      case 200:
        return data
      default:
        return null
    }
  }

  public async get (
    url: string,
    options?: AxiosRequestConfig
  ): Promise<any> {
    const request = () => this.api.get(url, options)
    const result = await this.requestHandler(request)
    return result
  }
}

export default NetworkService
