import { IDeepnoteNotebookContent, IDeepnoteNotebookMetadata } from './types';
import { blankCodeCell, blankDeepnoteNotebookContent } from './fallback-data';
import { deserializeDeepnoteFile } from '@deepnote/blocks';
import { convertDeepnoteBlockToJupyterCell } from './convert-deepnote-block-to-jupyter-cell';

export async function transformDeepnoteYamlToNotebookContent(
  yamlString: string
): Promise<IDeepnoteNotebookContent> {
  try {
    const deepnoteFile = await deserializeDeepnoteFile(yamlString);

    const notebooks = deepnoteFile.project.notebooks.reduce(
      (acc, notebook) => {
        acc[notebook.name] = {
          id: notebook.id,
          name: notebook.name,
          cells: notebook.blocks.map(convertDeepnoteBlockToJupyterCell)
        };
        return acc;
      },
      {} as IDeepnoteNotebookMetadata['deepnote']['notebooks']
    );

    const selectedNotebook = deepnoteFile.project.notebooks[0];

    if (!selectedNotebook) {
      return {
        ...blankDeepnoteNotebookContent,
        cells: [
          {
            ...blankCodeCell,
            source: '# No notebooks found in the Deepnote file.\n'
          }
        ]
      };
    }

    const cells = selectedNotebook.blocks.map(
      convertDeepnoteBlockToJupyterCell
    );

    return {
      cells,
      metadata: {
        deepnote: {
          notebooks
        }
      },
      nbformat: 4,
      nbformat_minor: 0
    };
  } catch (error) {
    console.error('Failed to deserialize Deepnote file:', error);
    throw new Error('Failed to transform Deepnote YAML to notebook content.');
  }
}
