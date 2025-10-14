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

  const dataText = await response.text()
  let data: unknown = dataText

  if (dataText.length > 0) {
    try {
      data = JSON.parse(dataText)
    } catch (_error) {}
  }

  if (!response.ok) {
    const errorData = data as { message?: string }
    throw new ServerConnection.ResponseError(response, errorData.message || dataText)
  }

  return data as T
}
