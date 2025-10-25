import { URLExt } from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';

/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function requestAPI(
  endPoint = '',
  init: RequestInit = {}
): Promise<unknown> {
  // Make request to Jupyter API
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(
    settings.baseUrl,
    'jupyterlab-deepnote', // API Namespace
    endPoint
  );

  let response: Response;
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings);
  } catch (error) {
    throw new ServerConnection.NetworkError(
      error instanceof Error ? error : new Error(String(error))
    );
  }

  let data: string | unknown = await response.text();

  if (typeof data === 'string' && data.length > 0) {
    try {
      data = JSON.parse(data);
    } catch {
      console.log('Not a JSON response body.', response);
    }
  }

  if (!response.ok) {
    const errorMessage =
      data && typeof data === 'object' && 'message' in data
        ? (data as { message: string }).message
        : String(data);
    throw new ServerConnection.ResponseError(response, errorMessage);
  }

  return data;
}
