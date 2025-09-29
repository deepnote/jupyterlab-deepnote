import { INotebookContent, INotebookMetadata } from '@jupyterlab/nbformat';
import { DeepnoteFile } from './deepnote-convert/deepnote-file-schema';

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
