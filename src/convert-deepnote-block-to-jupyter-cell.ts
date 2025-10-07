import { convertCellTypeToJupyter } from './deepnote-convert/convert-cell-type-to-jupyter';
import { DeepnoteFileBlock } from './deepnote-convert/deepnote-file-schema';
import { ICodeCell, IMarkdownCell } from '@jupyterlab/nbformat';

export function convertDeepnoteBlockToJupyterCell(
  block: DeepnoteFileBlock
): ICodeCell | IMarkdownCell {
  const jupyterCellType = convertCellTypeToJupyter(block.type);
  if (jupyterCellType === 'code') {
    return {
      cell_type: 'code',
      source: block.content || '',
      metadata: {},
      outputs: block.outputs || [],
      execution_count: block.executionCount || null
    };
  } else if (jupyterCellType === 'markdown') {
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
