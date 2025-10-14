import { createMarkdown, createPythonCode, type DeepnoteBlock } from '@deepnote/blocks'
import type { ICodeCell, IMarkdownCell } from '@jupyterlab/nbformat'
import _cloneDeep from 'lodash/cloneDeep'
import { convertDeepnoteBlockTypeToJupyter } from './convert-deepnote-block-type-to-jupyter'

export function convertDeepnoteBlockToJupyterCell(block: DeepnoteBlock) {
  const blockCopy = _cloneDeep(block)
  const jupyterCellMetadata = { ...blockCopy.metadata, cell_id: blockCopy.id }
  const jupyterCellType = convertDeepnoteBlockTypeToJupyter(blockCopy.type)

  if (jupyterCellType === 'code') {
    const blockOutputs = blockCopy.outputs ?? []

    if (Array.isArray(blockOutputs)) {
      blockOutputs.forEach(output => {
        delete output.truncated
      })
    }

    const source = createPythonCode(blockCopy)

    const jupyterCell: ICodeCell = {
      cell_type: 'code',
      metadata: jupyterCellMetadata,
      execution_count: blockCopy.executionCount ?? null,
      outputs: blockOutputs,
      source,
    }
    return jupyterCell
  } else {
    // Markdown cell
    const source = createMarkdown(blockCopy)
    const jupyterCell: IMarkdownCell = {
      cell_type: 'markdown',
      metadata: {},
      source,
    }
    return jupyterCell
  }
}
