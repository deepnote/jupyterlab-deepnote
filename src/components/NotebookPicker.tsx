import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { HTMLSelect } from '@jupyterlab/ui-components';
import { deepnoteMetadataSchema } from '../types';
import { Widget } from '@lumino/widgets';
import { Message, MessageLoop } from '@lumino/messaging';

export class NotebookPicker extends ReactWidget {
  private selected: string | null = null;

  constructor(private panel: NotebookPanel) {
    super();

    panel.context.ready
      .then(() => {
        const deepnoteMetadata =
          this.panel.context.model.getMetadata('deepnote');
        const metadataNames = deepnoteMetadata?.notebook_names;
        const names =
          Array.isArray(metadataNames) &&
          metadataNames.every(n => typeof n === 'string')
            ? metadataNames
            : [];

        this.selected = names.length === 0 ? null : (names[0] ?? null);
        this.update();
      })
      .catch(error => {
        console.error('Failed to initialize NotebookPicker:', error);
      });
  }

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = this.panel.model;
    if (!model) {
      return;
    }

    const selected = event.target.value;
    const deepnoteMetadata = this.panel.context.model.getMetadata('deepnote');
    const deepnoteMetadataValidated =
      deepnoteMetadataSchema.safeParse(deepnoteMetadata);

    if (!deepnoteMetadataValidated.success) {
      console.error(
        'Invalid deepnote metadata:',
        deepnoteMetadataValidated.error
      );
      return;
    }

    const notebooks = deepnoteMetadataValidated.data.notebooks;

    if (selected in notebooks) {
      model.fromJSON({
        cells: notebooks[selected]?.cells ?? [],
        metadata: {
          deepnote: {
            notebooks
          }
        },
        nbformat: 4,
        nbformat_minor: 0
      });
      model.dirty = false;
    }

    this.selected = selected;
    this.update();
  };

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    requestAnimationFrame(() => {
      if (this.parent) {
        MessageLoop.sendMessage(this.parent, Widget.ResizeMessage.UnknownSize);
      }
    });
  }

  render(): JSX.Element {
    const deepnoteMetadata = this.panel.context.model.getMetadata('deepnote');

    const deepnoteMetadataValidated =
      deepnoteMetadataSchema.safeParse(deepnoteMetadata);

    const names = deepnoteMetadataValidated.success
      ? Object.values(deepnoteMetadataValidated.data.notebooks).map(n => n.name)
      : [];

    return (
      <HTMLSelect
        value={this.selected ?? '-'}
        onChange={this.handleChange}
        onKeyDown={() => {}}
        aria-label="Select active notebook"
        title="Select active notebook"
        style={{
          width: '120px',
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
