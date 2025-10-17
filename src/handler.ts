import { URLExt } from '@jupyterlab/coreutils'

import { ServerConnection } from '@jupyterlab/services'

/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function requestAPI<T>(endPoint = '', init: RequestInit = {}): Promise<T> {
  // Make request to Jupyter API
  const settings = ServerConnection.makeSettings()
  const requestUrl = URLExt.join(
    settings.baseUrl,
    'jupyterlab-deepnote', // API Namespace
    endPoint
  )

  let response: Response
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings)
  } catch (error) {
    throw new ServerConnection.NetworkError(error as Error)
  }

  const data: string = await response.text()

  if (data.length > 0) {
    try {
      const parsed = JSON.parse(data)
      if (!response.ok) {
        throw new ServerConnection.ResponseError(
          response,
          typeof parsed === 'object' && parsed !== null && 'message' in parsed ? parsed.message : parsed
        )
      }
      return parsed as T
      // eslint-disable-next-line no-empty
    } catch (_error) {}
  }

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data)
  }

  return data as T
}
