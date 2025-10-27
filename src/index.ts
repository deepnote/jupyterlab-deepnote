import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IToolbarWidgetRegistry } from '@jupyterlab/apputils';
import {
  INotebookWidgetFactory,
  NotebookPanel,
  NotebookWidgetFactory
} from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';
import { ContentsManager } from '@jupyterlab/services';
import {
  DeepnoteContentProvider,
  deepnoteContentProviderName
} from './deepnote-content-provider';
import { NotebookPicker } from './components/NotebookPicker';

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
    // Register a custom contents provider for the default notebook widget factory.
    // Note: Content provider registry is required (available in JupyterLab 4.4+)
    const drive = (app.serviceManager.contents as ContentsManager).defaultDrive;
    const registry = drive?.contentProviderRegistry;
    if (!registry) {
      console.error(
        'Cannot initialize content provider: no content provider registry. JupyterLab 4.4.0 or higher is required.'
      );
      return;
    }
    const deepnoteContentProvider = new DeepnoteContentProvider({
      // These options are only required if extending the `RestContentProvider`.
      apiEndpoint: '/api/contents',
      serverSettings: app.serviceManager.serverSettings
    });
    registry.register(deepnoteContentProviderName, deepnoteContentProvider);
    notebookWidgetFactory.contentProviderId = deepnoteContentProviderName;

    // Register .deepnote file type and set the notebook widget factory as the default.
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

    // Add a toolbar item to switch between notebooks in a .deepnote file.
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

export default plugin;
