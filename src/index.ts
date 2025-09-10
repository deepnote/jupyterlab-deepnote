import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { NotebookPanel, NotebookWidgetFactory } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { IEditorServices } from '@jupyterlab/codeeditor';

const factoryName = 'Deepnote Notebook';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'deepnote-jupyter-extension:plugin',
  description: 'Open .deepnote files as notebooks.',
  autoStart: true,
  requires: [IRenderMimeRegistry, IEditorServices],
  activate: (
    app: JupyterFrontEnd,
    rendermime: IRenderMimeRegistry,
    editorServices: IEditorServices
  ) => {
    // 1) File type
    app.docRegistry.addFileType(
      {
        name: 'deepnote',
        displayName: 'Deepnote Notebook',
        extensions: ['.deepnote'],
        mimeTypes: ['text/yaml', 'application/x-yaml'],
        fileFormat: 'text',
        contentType: 'notebook'
      },
      [factoryName]
    );

    // 2) Widget factory that reuses the stock notebook UI
    const contentFactory = new NotebookPanel.ContentFactory({
      editorFactory: editorServices.factoryService.newInlineEditor
    });

    const widgetFactory = new NotebookWidgetFactory({
      name: factoryName,
      modelName: 'notebook', // built-in notebook model
      fileTypes: ['deepnote'],
      defaultFor: ['deepnote'],
      rendermime,
      contentFactory,
      mimeTypeService: editorServices.mimeTypeService
    });

    app.docRegistry.addWidgetFactory(widgetFactory);
  }
};

export default plugin;
