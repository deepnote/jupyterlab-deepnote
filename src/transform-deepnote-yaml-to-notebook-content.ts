import { IDeepnoteNotebookContent } from './types';
import { blankCodeCell, blankDeepnoteNotebookContent } from './fallback-data';
import { deserializeDeepnoteFile } from '@deepnote/blocks';

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

    return blankDeepnoteNotebookContent;
  } catch (error) {
    console.error('Failed to deserialize Deepnote file:', error);
    throw new Error('Failed to transform Deepnote YAML to notebook content.');
  }
}
