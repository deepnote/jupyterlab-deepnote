import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { HTMLSelect } from '@jupyterlab/ui-components';

export class NotebookPicker extends ReactWidget {
  private selected: string | null = null;

  constructor(private panel: NotebookPanel) {
    super();

    void panel.context.ready.then(() => {
      const deepnoteMetadata = this.panel.context.model.getMetadata('deepnote');
      const metadataNames = deepnoteMetadata?.notebook_names;
      const names =
        Array.isArray(metadataNames) &&
        metadataNames.every(n => typeof n === 'string')
          ? metadataNames
          : [];

      this.selected = names.length === 0 ? null : (names[0] ?? null);
      this.update();
    });
  }

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = this.panel.model;
    if (!model) {
      return;
    }

    const selected = event.target.value;
    const deepnoteMetadata = this.panel.context.model.getMetadata('deepnote');
    const notebooks = deepnoteMetadata?.notebooks;

    if (notebooks && selected in notebooks) {
      // clone the notebook JSON
      const newModelData = { ...notebooks[selected] };

      // preserve deepnote metadata *without* re-inserting all notebooks
      newModelData.metadata = {
        ...(newModelData.metadata ?? {}),
        deepnote: {
          notebook_names: deepnoteMetadata?.notebook_names ?? [],
          notebooks: deepnoteMetadata?.notebooks ?? {}
        }
      };

      model.fromJSON(newModelData);
      model.dirty = false;
    }

    this.selected = selected;
    this.update();
  };

  render(): JSX.Element {
    const deepnoteMetadata = this.panel.context.model.getMetadata('deepnote');
    const metadataNames = deepnoteMetadata?.notebook_names;
    const names =
      Array.isArray(metadataNames) &&
      metadataNames.every(n => typeof n === 'string')
        ? metadataNames
        : [];

    return (
      <HTMLSelect
        value={this.selected ?? '-'}
        onChange={this.handleChange}
        onKeyDown={() => {}}
        aria-label="Select active notebook"
        title="Select active notebook"
        style={{
          maxWidth: '120px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
      >
        {names.length === 0 ? (
          <option value="-">-</option>
        ) : (
          names.map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))
        )}
      </HTMLSelect>
    );
  }
}
