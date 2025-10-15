import { Contents, RestContentProvider } from '@jupyterlab/services';
import { transformDeepnoteYamlToNotebookContent } from './transform-deepnote-yaml-to-notebook-content';
import { requestAPI } from './handler';

export const deepnoteContentProviderName = 'deepnote-content-provider';
export class DeepnoteContentProvider extends RestContentProvider {
  async get(
    localPath: string,
    options?: Contents.IFetchOptions
  ): Promise<Contents.IModel> {
    const isDeepnoteFile = localPath.endsWith('.deepnote');

    if (!isDeepnoteFile) {
      // Not a .deepnote file, return as-is
      const nonDeepnoteModel = await super.get(localPath, options);
      return nonDeepnoteModel;
    }

    // Call custom API route to fetch the Deepnote file content
    let data: any;

    try {
      data = await requestAPI<any>(
        `file?path=${encodeURIComponent(localPath)}`
      );
    } catch (error) {
      console.error(`Failed to fetch Deepnote file: ${localPath}`, error);
      throw new Error(`Failed to fetch .deepnote file: ${error}`);
    }

    if (!data.deepnoteFileModel) {
      throw new Error(
        `Invalid API response: missing deepnoteFileModel for ${localPath}`
      );
    }

    const modelData = data.deepnoteFileModel;

    // Transform the Deepnote YAML to Jupyter notebook content
    const notebookContent = await transformDeepnoteYamlToNotebookContent(
      modelData.content
    );

    const model: Contents.IModel = {
      name: modelData.name,
      path: modelData.path,
      type: 'notebook',
      writable: false,
      created: modelData.created,
      last_modified: modelData.last_modified,
      mimetype: 'application/x-ipynb+json',
      format: 'json',
      content: notebookContent
    };

    return model;
  }
}
