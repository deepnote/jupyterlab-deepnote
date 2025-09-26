import { Contents, RestContentProvider } from '@jupyterlab/services';

export const deepnoteContentProviderName = 'deepnote-content-provider';

export class DeepnoteContentProvider extends RestContentProvider {
  async get(
    localPath: string,
    options?: Contents.IFetchOptions
  ): Promise<Contents.IModel> {
    const model = await super.get(localPath, options);
    const isDeepnoteFile =
      localPath.endsWith('.deepnote') && model.type === 'notebook';

    if (!isDeepnoteFile) {
      // Not a .deepnote file, return as-is
      return model;
    }

    model.content.cells = [];
    return model;
  }
}
