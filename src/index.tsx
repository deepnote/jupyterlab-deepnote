import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import React from 'react';
import { IToolbarWidgetRegistry, ReactWidget } from '@jupyterlab/apputils';
import {
  INotebookWidgetFactory,
  NotebookPanel,
  NotebookWidgetFactory
} from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';
import { HTMLSelect } from '@jupyterlab/ui-components';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-deepnote:plugin',
  description: 'Open .deepnote files as notebooks.',
  autoStart: true,
  requires: [INotebookWidgetFactory, IToolbarWidgetRegistry],
  activate: (
    app: JupyterFrontEnd,
    notebookWidgetFactory: NotebookWidgetFactory,
    toolbarRegistry: IToolbarWidgetRegistry
  ) => {
    app.docRegistry.addFileType(
      {
        name: 'deepnote',
        displayName: 'Deepnote Notebook',
        extensions: ['.deepnote'],
        mimeTypes: ['text/yaml', 'application/x-yaml'],
        fileFormat: 'text',
        contentType: 'file'
      },
      [notebookWidgetFactory.name]
    );

    app.docRegistry.setDefaultWidgetFactory(
      'deepnote',
      notebookWidgetFactory.name
    );

    toolbarRegistry.addFactory<NotebookPanel>(
      notebookWidgetFactory.name,
      'deepnote:switch-notebook',
      panel => {
        if (!panel.context.path.endsWith('.deepnote')) {
          return new Widget(); // don’t render for .ipynb or others
        }

        return new NotebookPicker(panel);
      }
    );
  }
};

class NotebookPicker extends ReactWidget {
  constructor(private panel: NotebookPanel) {
    super();
    // when the context becomes ready, trigger re-render
    void panel.context.ready.then(() => {
      this.update();
    });
  }

  render(): JSX.Element {
    const metadataNames =
      this.panel.context.model.getMetadata('notebook_names');
    const names =
      Array.isArray(metadataNames) &&
      metadataNames.every(n => typeof n === 'string')
        ? metadataNames
        : [];

    return (
      <HTMLSelect
        value={names[0] ?? '-'}
        onChange={() => {}}
        onKeyDown={() => {}}
        aria-label="Select active notebook"
        title="Select active notebook"
      >
        <option value="-">-</option>
        {names.map(n => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </HTMLSelect>
    );
  }
}

export default plugin;
