import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IToolbarWidgetRegistry, ToolbarButton } from '@jupyterlab/apputils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-deepnote:plugin',
  description: 'Open .deepnote files as notebooks.',
  autoStart: true,
  requires: [IToolbarWidgetRegistry],
  activate: (app: JupyterFrontEnd, toolbarRegistry: IToolbarWidgetRegistry) => {
    // 1) File type
    app.docRegistry.addFileType(
      {
        name: 'deepnote',
        displayName: 'Deepnote Notebook',
        extensions: ['.deepnote'],
        mimeTypes: ['text/yaml', 'application/x-yaml'],
        fileFormat: 'text',
        contentType: 'file'
      },
      ['Notebook']
    );

    app.docRegistry.setDefaultWidgetFactory('deepnote', 'Notebook');

    toolbarRegistry.addFactory<NotebookPanel>(
      'Notebook',
      'deepnote:switch-notebook',
      panel => {
        if (!panel.context.path.endsWith('.deepnote')) {
          return new Widget(); // don’t render for .ipynb or others
        }

        return new ToolbarButton({
          className: 'debug-deepnote-button',
          label: 'Deepnote',
          tooltip: 'Do a Deepnote action',
          onClick: () => {
            console.log('clicked for', panel.context.path);
          }
        });
      }
    );
  }
};

export default plugin;
