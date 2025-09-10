import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the jupyterlab-deepnote extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-deepnote:plugin',
  description: 'A Deepnote extension for JupyterLab',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-deepnote is activated!');

    requestAPI<any>('get-example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_deepnote server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
