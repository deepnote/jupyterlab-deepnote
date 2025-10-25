// Copyright (c) Deepnote
// Distributed under the terms of the Modified BSD License.

import type { INotebookModel, NotebookPanel } from '@jupyterlab/notebook';
import { framePromise } from '@jupyterlab/testing';
import type { PartialJSONObject } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';
import { NotebookPicker } from '../components/NotebookPicker';

describe('NotebookPicker', () => {
  let widget: NotebookPicker;
  let mockNotebookModel: Partial<INotebookModel>;
  let deepnoteMetadata: PartialJSONObject;
  let consoleErrorSpy: jest.SpyInstance | null = null;

  const createMockPanel = (metadata: PartialJSONObject): NotebookPanel => {
    deepnoteMetadata = metadata;

    mockNotebookModel = {
      fromJSON: jest.fn(),
      cells: {
        length: 0
      } as never,
      dirty: false,
      getMetadata: jest.fn((key: string) => {
        if (key === 'deepnote') {
          return deepnoteMetadata;
        }
        return undefined;
      })
    };

    return {
      context: {
        ready: Promise.resolve(),
        model: mockNotebookModel as INotebookModel
      },
      model: mockNotebookModel as INotebookModel
    } as unknown as NotebookPanel;
  };

  const attachWidget = async (panel: NotebookPanel): Promise<void> => {
    widget = new NotebookPicker(panel);
    Widget.attach(widget, document.body);
    // Wait for widget to attach and render
    await framePromise();
    // Wait for constructor's async initialization to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    await framePromise();
  };

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
      consoleErrorSpy = null;
    }
    if (widget && !widget.isDisposed) {
      widget.dispose();
    }
    // Clean up DOM
    const attached = document.querySelectorAll('.jp-ReactWidget');
    attached.forEach(node => {
      node.remove();
    });
  });

  describe('rendering', () => {
    it('should render a select element with notebooks', async () => {
      const metadata = {
        notebooks: {
          'Notebook 1': { id: 'nb1', name: 'Notebook 1', cells: [] },
          'Notebook 2': { id: 'nb2', name: 'Notebook 2', cells: [] }
        }
      };

      const panel = createMockPanel(metadata);
      await attachWidget(panel);

      const select = widget.node.querySelector('select');
      expect(select).not.toBeNull();
      expect(select?.options.length).toBe(2);
      expect(select?.options[0]?.value).toBe('Notebook 1');
      expect(select?.options[1]?.value).toBe('Notebook 2');
    });

    it('should render a placeholder when no notebooks are available', async () => {
      const metadata = {
        notebooks: {}
      };

      const panel = createMockPanel(metadata);
      await attachWidget(panel);

      const select = widget.node.querySelector('select');
      expect(select).not.toBeNull();
      expect(select?.options.length).toBe(1);
      expect(select?.options[0]?.value).toBe('-');
    });

    it('should handle invalid metadata gracefully', async () => {
      const metadata = {
        notebooks: null
      } as PartialJSONObject;

      const panel = createMockPanel(metadata);
      await attachWidget(panel);

      const select = widget.node.querySelector('select');
      expect(select).not.toBeNull();
      expect(select?.options.length).toBe(1);
      expect(select?.options[0]?.value).toBe('-');
    });
  });

  describe('notebook selection', () => {
    let panel: NotebookPanel;

    beforeEach(async () => {
      const metadata = {
        notebooks: {
          'Notebook 1': {
            id: 'nb1',
            name: 'Notebook 1',
            cells: [{ cell_type: 'code', source: 'print(1)' }]
          },
          'Notebook 2': {
            id: 'nb2',
            name: 'Notebook 2',
            cells: [{ cell_type: 'code', source: 'print(2)' }]
          }
        }
      };

      panel = createMockPanel(metadata);
      await attachWidget(panel);
    });

    it('should call fromJSON when selecting a different notebook', async () => {
      const select = widget.node.querySelector('select') as HTMLSelectElement;
      expect(select).not.toBeNull();

      select.value = 'Notebook 2';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await framePromise();

      expect(mockNotebookModel.fromJSON).toHaveBeenCalledTimes(1);
      expect(mockNotebookModel.fromJSON).toHaveBeenCalledWith(
        expect.objectContaining({
          cells: [{ cell_type: 'code', source: 'print(2)' }],
          metadata: {
            deepnote: {
              notebooks: expect.objectContaining({
                'Notebook 1': expect.any(Object),
                'Notebook 2': expect.any(Object)
              })
            }
          },
          nbformat: 4,
          nbformat_minor: 0
        })
      );
    });

    it('should set model.dirty to false after switching notebooks', async () => {
      const select = widget.node.querySelector('select') as HTMLSelectElement;
      select.value = 'Notebook 2';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await framePromise();

      expect(mockNotebookModel.dirty).toBe(false);
    });

    it('should not call fromJSON when selecting a non-existent notebook', async () => {
      const select = widget.node.querySelector('select') as HTMLSelectElement;
      select.value = 'NonExistent';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await framePromise();

      expect(mockNotebookModel.fromJSON).not.toHaveBeenCalled();
    });

    it('should not call fromJSON when panel.model is null', async () => {
      widget.dispose();

      // Create panel with null model
      const nullModelPanel = {
        context: {
          ready: Promise.resolve(),
          model: {
            getMetadata: jest.fn(() => deepnoteMetadata)
          }
        },
        model: null
      } as unknown as NotebookPanel;

      await attachWidget(nullModelPanel);

      const select = widget.node.querySelector('select') as HTMLSelectElement;
      select.value = 'Notebook 2';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await framePromise();

      expect(mockNotebookModel.fromJSON).not.toHaveBeenCalled();
    });
  });

  describe('initialization', () => {
    it('should select first notebook by default when notebooks exist', async () => {
      const metadata = {
        notebooks: {
          First: { id: 'nb1', name: 'First', cells: [] },
          Second: { id: 'nb2', name: 'Second', cells: [] }
        }
      };

      const panel = createMockPanel(metadata);
      await attachWidget(panel);

      const select = widget.node.querySelector('select') as HTMLSelectElement;
      expect(select.value).toBe('First');
    });

    it('should handle initialization errors gracefully', async () => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const failingPanel = {
        context: {
          ready: Promise.reject(new Error('Initialization failed')),
          model: {
            getMetadata: jest.fn(() => ({}))
          }
        },
        model: mockNotebookModel as INotebookModel
      } as unknown as NotebookPanel;

      await attachWidget(failingPanel);
      await framePromise();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize NotebookPicker:',
        expect.any(Error)
      );
    });
  });

  describe('metadata validation', () => {
    it('should handle invalid metadata when changing notebooks', async () => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const metadata = {
        notebooks: {
          'Notebook 1': { id: 'nb1', name: 'Notebook 1', cells: [] }
        }
      };

      const panel = createMockPanel(metadata);
      await attachWidget(panel);

      // Change the metadata to invalid format
      deepnoteMetadata = { invalid: 'metadata' } as PartialJSONObject;

      const select = widget.node.querySelector('select') as HTMLSelectElement;
      select.value = 'Notebook 1';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await framePromise();

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0]?.[0]).toMatch(/invalid.*metadata/i);
      expect(mockNotebookModel.fromJSON).not.toHaveBeenCalled();
    });
  });
});
