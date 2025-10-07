import { pickBy } from '../utils'

import type { SharedTableState } from '../data-table/shared-table-state-schemas'
import type { ExecutableCellMetadata } from '../types'

export type BlockExecutionStateData = Pick<
  ExecutableCellMetadata,
  | 'output_cleared'
  | 'execution_start'
  | 'execution_millis'
  | 'source_hash'
  | 'deepnote_to_be_reexecuted'
  | 'last_executed_function_notebook_id'
  | 'last_function_run_started_at'
  | 'function_notebook_export_states'
> & {
  'execution_count': number | null
  'outputs_reference': string | null
  'execution_context_id'?: string
  'deepnote_table_state'?: SharedTableState
  'deepnote_table_loading'?: boolean
  'deepnote_table_invalid'?: boolean
}

export function createMetadataAndStateFromBlock<T extends string, M extends Record<string, any>>(block: {
  block_type: T
  metadata: M
  execution_count: number | null
  outputs_reference: string | null
}) {
  const { metadata, state: stateFromMetadata } = splitBlockMetadataAndState(block.metadata)

  const state: BlockExecutionStateData = {
    ...stateFromMetadata,
    execution_count: block.execution_count,
    outputs_reference: block.outputs_reference,
  }

  return {
    blockType: block.block_type,
    metadata,
    state,
  }
}

export function splitBlockMetadataAndState<M extends Record<string, any>>(fullMetadata: M) {
  const {
    output_cleared,
    execution_start,
    execution_millis,
    source_hash,
    execution_context_id,
    deepnote_to_be_reexecuted,
    deepnote_table_state: tableStateMetadataKey,
    deepnote_table_loading: tableLoadingMetadataKey,
    deepnote_table_invalid: tableInvalidMetadataKey,
    last_executed_function_notebook_id: lastExecutedFunctionNotebookId,
    last_function_run_started_at: lastExecutedFunctionTimestamp,
    function_notebook_export_states: functionNotebookExportStates,
    cell_id: droppedCellId,
    ...metadata
  } = fullMetadata

  const state: Omit<BlockExecutionStateData, 'execution_count' | 'outputs_reference'> = pickBy(
    {
      output_cleared,
      execution_start,
      execution_millis,
      source_hash,
      execution_context_id,
      deepnote_to_be_reexecuted,
      deepnote_table_state: tableStateMetadataKey,
      deepnote_table_loading: tableLoadingMetadataKey,
      deepnote_table_invalid: tableInvalidMetadataKey,
      last_executed_function_notebook_id: lastExecutedFunctionNotebookId,
      last_function_run_started_at: lastExecutedFunctionTimestamp,
      function_notebook_export_states: functionNotebookExportStates,
    },
    value => typeof value !== 'undefined'
  )

  return {
    metadata,
    state,
  }
}
