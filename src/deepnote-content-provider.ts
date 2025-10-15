import { Contents, RestContentProvider } from '@jupyterlab/services';
import { transformDeepnoteYamlToNotebookContent } from './transform-deepnote-yaml-to-notebook-content';
import { requestAPI } from './handler';
import { z } from 'zod';

export const deepnoteContentProviderName = 'deepnote-content-provider';

const deepnoteFileResponseSchema = z.object({
  deepnoteFileModel: z.object({
    name: z.string(),
    path: z.string(),
    created: z.string(),
    last_modified: z.string(),
    content: z.string(),
    mimetype: z.string().optional()
  })
});

export class DeepnoteContentProvider extends RestContentProvider {
  async get(
    localPath: string,
    options?: Contents.IFetchOptions
  ): Promise<Contents.IModel> {
    const isDeepnoteFile = localPath.toLowerCase().endsWith('.deepnote');

    if (!isDeepnoteFile) {
      // Not a .deepnote file, return as-is
      const nonDeepnoteModel = await super.get(localPath, options);
      return nonDeepnoteModel;
    }

    // Call custom API route to fetch the Deepnote file content
    const data = await requestAPI(`file?path=${encodeURIComponent(localPath)}`);
    const parsed = deepnoteFileResponseSchema.safeParse(data);
    if (!parsed.success) {
      console.error('Invalid API response shape', parsed.error);
      throw new Error('Invalid API response shape');
    }
    const modelData = parsed.data.deepnoteFileModel;

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
