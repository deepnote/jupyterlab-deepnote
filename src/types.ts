import { INotebookContent, INotebookMetadata } from '@jupyterlab/nbformat';
import type { DeepnoteFile } from '@deepnote/blocks';

export interface IDeepnoteNotebookMetadata extends INotebookMetadata {
  deepnote: {
    rawYamlString: string | null;
    deepnoteFile: DeepnoteFile | null;
  };
}

export interface IDeepnoteNotebookContent
  extends Omit<INotebookContent, 'metadata'> {
  metadata: IDeepnoteNotebookMetadata;
}
