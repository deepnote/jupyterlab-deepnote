import { ReactWidget } from '@jupyterlab/apputils'
import type { NotebookPanel } from '@jupyterlab/notebook'
import { HTMLSelect } from '@jupyterlab/ui-components'
import React from 'react'
import { deepnoteMetadataSchema } from '../types'

export class NotebookPicker extends ReactWidget {
  private selected: string | null = null

  constructor(private panel: NotebookPanel) {
    super()

    void panel.context.ready.then(() => {
      const deepnoteMetadata = this.panel.context.model.getMetadata('deepnote')
      const metadataNames = deepnoteMetadata?.notebook_names
      const names = Array.isArray(metadataNames) && metadataNames.every(n => typeof n === 'string') ? metadataNames : []

      this.selected = names.length === 0 ? null : (names[0] ?? null)
      this.update()
    })
  }

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = this.panel.model
    if (!model) {
      return
    }

    const selected = event.target.value
    const deepnoteMetadata = this.panel.context.model.getMetadata('deepnote')
    const deepnoteMetadataValidated = deepnoteMetadataSchema.safeParse(deepnoteMetadata)

    if (!deepnoteMetadataValidated.success) {
      return
    }

    const notebooks = deepnoteMetadataValidated.data.notebooks

    if (selected in notebooks) {
      model.fromJSON({
        cells: notebooks[selected]?.cells ?? [],
        metadata: {
          deepnote: {
            notebooks,
          },
        },
        nbformat: 4,
        nbformat_minor: 0,
      })
      model.dirty = false
    }

    this.selected = selected
    this.update()
  }

  render(): JSX.Element {
    const deepnoteMetadata = this.panel.context.model.getMetadata('deepnote')

    const deepnoteMetadataValidated = deepnoteMetadataSchema.safeParse(deepnoteMetadata)

    const names = deepnoteMetadataValidated.success
      ? Object.values(deepnoteMetadataValidated.data.notebooks).map(n => n.name)
      : []

    return (
      <HTMLSelect
        value={this.selected ?? '-'}
        onChange={this.handleChange}
        onKeyDown={() => {}}
        aria-label='Select active notebook'
        title='Select active notebook'
        style={{
          maxWidth: '120px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {names.length === 0 ? (
          <option value='-'>-</option>
        ) : (
          names.map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))
        )}
      </HTMLSelect>
    )
  }
}
