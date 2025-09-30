import { deserializeDeepnoteFile } from './deepnote-convert/deserialize-deepnote-file';
import { IDeepnoteNotebookContent } from './types';
import { blankCodeCell, blankDeepnoteNotebookContent } from './fallback-data';
import { DeepnoteFileBlock } from './deepnote-convert/deepnote-file-schema';
import { ICodeCell, IMarkdownCell } from '@jupyterlab/nbformat';

function convertDeepnoteBlockToJupyterCell(
  block: DeepnoteFileBlock
): ICodeCell | IMarkdownCell {
  if (block.type === 'code') {
    return {
      cell_type: 'code',
      source: block.content || '',
      metadata: {},
      outputs: block.outputs || [],
      execution_count: block.executionCount || null
    };
  } else if (block.type === 'markdown') {
    return {
      cell_type: 'markdown',
      source: block.content || '',
      metadata: {}
    };
  } else {
    // For unsupported block types, return a markdown cell indicating it's unsupported
    return {
      cell_type: 'markdown',
      source: `# Unsupported block type: ${block.type}\n`,
      metadata: {}
    };
  }
}

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

    const cells = selectedNotebook.blocks.map(
      convertDeepnoteBlockToJupyterCell
    );

    return {
      ...blankDeepnoteNotebookContent,
      cells
    };
  } catch (error) {
    console.error('Failed to deserialize Deepnote file:', error);
    throw new Error('Failed to transform Deepnote YAML to notebook content.');
  }
}
