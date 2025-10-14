import type { ICodeCell, IMarkdownCell, INotebookContent, INotebookMetadata } from '@jupyterlab/nbformat'

import { z } from 'zod'

export const deepnoteMetadataSchema = z.object({
  notebooks: z.record(
    z.string(),
    z.object({
      id: z.string(),
      name: z.string(),
      cells: z.array(z.any()),
    })
  ),
})

export interface IDeepnoteNotebookMetadata extends INotebookMetadata {
  deepnote: {
    notebooks: Record<
      string,
      {
        id: string
        name: string
        cells: Array<ICodeCell | IMarkdownCell>
      }
    >
  }
}

export interface IDeepnoteNotebookContent extends Omit<INotebookContent, 'metadata'> {
  metadata: IDeepnoteNotebookMetadata
}
