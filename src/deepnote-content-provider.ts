import { Contents, RestContentProvider } from '@jupyterlab/services';
import { z } from 'zod';
import { transformDeepnoteYamlToNotebookContent } from './transform-deepnote-yaml-to-notebook-content';

export const deepnoteContentProviderName = 'deepnote-content-provider';

const deepnoteFileFromServerSchema = z.object({
  cells: z.array(z.any()), // or refine further with nbformat
  metadata: z.object({
    deepnote: z.object({
      rawYamlString: z.string()
    })
  }),
  nbformat: z.number(),
  nbformat_minor: z.number()
});

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

    const validatedModelContent = deepnoteFileFromServerSchema.safeParse(
      model.content
    );

    if (!validatedModelContent.success) {
      console.error(
        'Invalid .deepnote file content:',
        validatedModelContent.error
      );
      // Return an empty notebook instead of throwing an error
      model.content.cells = [];
      return model;
    }

    // Transform the Deepnote YAML to Jupyter notebook content
    const transformedModelContent =
      await transformDeepnoteYamlToNotebookContent(
        validatedModelContent.data.metadata.deepnote.rawYamlString
      );

    const transformedModel = {
      ...model,
      content: transformedModelContent
    };

    return transformedModel;
  }
}
