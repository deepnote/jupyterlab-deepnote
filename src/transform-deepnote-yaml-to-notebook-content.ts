import { deserializeDeepnoteFile } from './deepnote-convert/deserialize-deepnote-file';
import { IDeepnoteNotebookContent } from './types';
import { blankCodeCell, blankDeepnoteNotebookContent } from './fallback-data';
import { convertDeepnoteCellToJupyterCell } from './deepnote-convert/convert-deepnote-cell-to-jupyter-cell';

export async function transformDeepnoteYamlToNotebookContent(
  yamlString: string
): Promise<IDeepnoteNotebookContent> {
  try {
    const deepnoteFile = await deserializeDeepnoteFile(yamlString);

    const selectedNotebook = deepnoteFile.project.notebooks[0];

    if (!selectedNotebook) {
      return {
        ...blankDeepnoteNotebookContent,
        cells: [
          {
            ...blankCodeCell,
            source: '# No notebooks found in Deepnote file.\n'
          }
        ]
      };
    }

    const cells = selectedNotebook.blocks.map(convertDeepnoteCellToJupyterCell);

    return {
      ...blankDeepnoteNotebookContent,
      cells
    };
  } catch (error) {
    console.error('Failed to deserialize Deepnote file:', error);
    throw new Error('Failed to transform Deepnote YAML to notebook content.');
  }
}
