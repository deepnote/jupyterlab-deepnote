import type { ICodeCell } from '@jupyterlab/nbformat'
import type { IDeepnoteNotebookContent } from './types'

export const blankCodeCell: ICodeCell = {
  cell_type: 'code',
  source: '',
  metadata: {},
  outputs: [],
  execution_count: null,
}

export const blankDeepnoteNotebookContent: IDeepnoteNotebookContent = {
  cells: [
    {
      cell_type: 'code',
      source: '# Transformed from Deepnote YAML\n',
      metadata: {},
      outputs: [],
      execution_count: null,
    },
  ],
  metadata: {
    deepnote: {
      notebooks: {},
    },
  },
  nbformat: 4,
  nbformat_minor: 0,
}
