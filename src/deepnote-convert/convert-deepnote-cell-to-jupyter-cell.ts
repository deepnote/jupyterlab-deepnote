import {
  convertCellTypeToJupyter,
  createJupyterSource,
  isExecutableCell,
  isSqlCell
} from '@deepnote/shared';
import _cloneDeep from 'lodash/cloneDeep';

import type { JupyterCell } from '@deepnote/jupyter';
import type { IOutput } from '@jupyterlab/nbformat';
import { SharedTableState } from './shared-table-state-schemas';
import type { ValueOf } from 'ts-essentials';
import { type DataframeFilter } from './shared-table-state-schemas';
import { VegaLiteSpec } from './vega-lite.types';

// NOTE: All cells extend this base type. The type should not be used directly.
interface CellBase {
  // NOTE: This grouping property is used to place multiple blocks (with the same group value) as columns
  //   in the same row. Ordering within the row is still determined by the sorting_key and there can
  //   be multiple non-consecutive groups of blocks with the same group value (although we try to avoid that).
  block_group: string;
}

interface ExecutableCellBase extends CellBase {
  execution_count: number | null;
  outputs: IOutput[];
  outputs_reference: string | null;
}

interface ExecutableCodeCellBase extends ExecutableCellBase {
  content_dependencies: BlockContentDependencies | null;
}

export interface CellMetadata {
  /**
   * @deprecated Do not use, use cell.cellId instead.
   */
  cell_id?: unknown;
  /** Whether the code block is hidden in the app */
  deepnote_app_is_code_hidden?: boolean;
  /** Whether the output of the code block is hidden in the app */
  deepnote_app_is_output_hidden?: boolean;
  /** Whether the block is visible in the app */
  deepnote_app_block_visible?: boolean;
  /** The width of the block in the app as a percentage value */
  deepnote_app_block_width?: number;
  /** The group id of the block in the app. Items with the same group id are
   * rendered in the same row. */
  deepnote_app_block_group_id?: string | null;
  /** The subgroup id of the block in the app. Items with the same subgroup id
   * are rendered in the same column within a row. */
  deepnote_app_block_subgroup_id?: string;
  /** The order of the block in the app (which can differ from the order in the
   * notebook) */
  deepnote_app_block_order?: number;
  /**
   * This metadata is used to display "Run the app" banner in the published app.
   * Without it we don't know if the outputs are not there because the user cleared them
   * or they were not there in the first place.
   */
  deepnote_app_outputs_were_cleared?: boolean;
}

export interface MarkdownCellMetadata extends CellMetadata {
  deepnote_cell_height?: number;
}

export interface SeparatorCellMetadata extends CellMetadata {}

export type CellEmbedMode = 'code_output' | 'code' | 'output' | false;

/* Dependencies (AST) fetched from Lambda for given block content */
export interface BlockContentDependencies {
  error?: {
    // This is currently used for SyntaxError (which we want to show to the user instead of block dependencies)
    message: string;
    type: string;
  };
  definedVariables: string[];
  usedVariables: string[];
  importedModules?: string[];
}

export interface NotebookExportState {
  table_loading?: boolean;
  table_state?: SharedTableState;
  table_invalid?: boolean;
}

export type NotebookExportStates = {
  [exportName in string]: NotebookExportState;
};

/**
 * Height of output, when it's null it means output is native (not rendered in iframe)
 */
export type CellOutputsHeights = (number | null)[];

export interface ExecutableCellMetadata extends CellMetadata {
  allow_embed?: boolean | CellEmbedMode;
  is_code_hidden?: boolean;
  is_output_hidden?: boolean;
  /** @deprecated The outputs are actually being cleared. This remains here only to be able to migrate historical versions of blocks. */
  output_cleared?: boolean;
  execution_start?: number; // UTC timestamp in millis
  execution_millis?: number;
  source_hash?: string;
  execution_context_id?: string;
  deepnote_to_be_reexecuted?: boolean; // Whether the cell was marked for reexecution (being in executionQueue is not enough, it's possible that the cell was marked for reexecution but some other cell earlier in the execution queue errorred out and cancelled the queue)
  deepnote_cell_height?: number;
  deepnote_output_heights?: CellOutputsHeights;
  deepnote_table_state?: SharedTableState;
  deepnote_table_loading?: boolean;
  deepnote_table_invalid?: boolean;
  /**
   * If enabled, the output will have no max-height and will grow to fit the content.
   */
  deepnote_output_height_limit_disabled?: boolean;
  last_executed_function_notebook_id?: string;
  last_function_run_started_at?: number;
  function_notebook_export_states?: NotebookExportStates;
}

export interface CodeCellMetadata extends ExecutableCellMetadata {
  function_export_name?: string;
}

export type SqlCellVariableType = 'dataframe' | 'query_preview';

export interface SqlCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name?: string;
  deepnote_return_variable_type?: SqlCellVariableType;
  sql_integration_id?: string;
  is_compiled_sql_query_visible?: boolean;
  function_export_name?: string;
}

export interface ButtonCellMetadata extends ExecutableCellMetadata {
  deepnote_button_title?: string;
  deepnote_button_color_scheme?:
    | 'blue'
    | 'red'
    | 'neutral'
    | 'green'
    | 'yellow';
  deepnote_button_behavior?: 'run' | 'set_variable';
  // deepnote_variable_name is applicable only when deepnote_button_behavior is 'set_variable'
  deepnote_variable_name?: string;
}

// NOTE: We must allow all types of input values for all inputs since input block definitions can change over time
//   and what used to be a multi-option select box can become a text input for instance, or numbers can become dates.
export type NotebookFunctionInputValue =
  InputCell['metadata']['deepnote_variable_value'];
export interface NotebookFunctionInput {
  custom_value?: NotebookFunctionInputValue | null;
  variable_name?: string | null;
}
export type NotebookFunctionInputs = {
  [inputName in string]: NotebookFunctionInput;
};

export interface NotebookExportMapping {
  enabled: boolean;
  variable_name: string | null;
}
export type NotebookExportMappings = {
  [exportName in string]: NotebookExportMapping;
};

export interface NotebookFunctionCellMetadata extends ExecutableCellMetadata {
  function_notebook_id: string | null;
  function_notebook_inputs?: NotebookFunctionInputs;
  function_notebook_export_mappings?: NotebookExportMappings;
}

export interface InputCheckboxCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name: string;
  deepnote_variable_value: boolean;
  deepnote_variable_default_value?: boolean;
  deepnote_input_checkbox_label?: string;
  deepnote_input_label?: string;
}

export interface InputTextCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name: string;
  deepnote_variable_value: string;
  deepnote_variable_default_value?: string;
  deepnote_input_label?: string;
}

export interface InputTextareaCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name: string;
  deepnote_variable_value: string;
  deepnote_variable_default_value?: string;
  deepnote_input_label?: string;
}

export interface InputFileCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name: string;
  deepnote_variable_value: string;
  deepnote_input_label?: string;
  deepnote_allowed_file_extensions?: string;
}

export const InputCellSelectTypes = {
  FROM_OPTIONS: 'from-options',
  FROM_VARIABLE: 'from-variable'
} as const;

export type InputCellSelectType = ValueOf<typeof InputCellSelectTypes>;

export interface InputSelectCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name: string;
  deepnote_variable_value: string | string[];
  deepnote_variable_default_value?: string | string[];
  deepnote_variable_options: string[];
  deepnote_variable_custom_options: string[];
  deepnote_variable_selected_variable: string;
  deepnote_variable_select_type: InputCellSelectType;
  deepnote_allow_multiple_values?: boolean;
  deepnote_allow_empty_values?: boolean;
  deepnote_input_label?: string;
}

export interface InputSliderCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name: string;
  deepnote_variable_value: string;
  deepnote_variable_default_value?: string;
  deepnote_slider_min_value: number;
  deepnote_slider_max_value: number;
  deepnote_slider_step: number;
  deepnote_input_label?: string;
}

export interface InputDateCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name: string;
  deepnote_variable_value: string;
  deepnote_variable_default_value?: string;
  deepnote_allow_empty_values?: boolean;
  /**
   * Version 2 returns a Date object
   * Version 1 or no version returns a DateTime object
   * This exists to keep backward compatibility for notebooks created with version 1 Date picker.
   */
  deepnote_input_date_version?: number;
  deepnote_input_label?: string;
}

export interface InputBlockValueOverrides {
  [inputName: string]: InputCell['metadata']['deepnote_variable_value'];
}

export type ImageBlockAlignmentType = 'left' | 'center' | 'right';
export type ImageBlockWidthType = 'actual' | '50%' | '75%' | '100%';

export interface ImageCellMetadata extends CellMetadata {
  deepnote_img_src?: string;
  deepnote_img_width?: ImageBlockWidthType;
  deepnote_img_alignment?: ImageBlockAlignmentType;
}

export interface ValueSelector {
  selectionType: 'values';
  field: string;
  values: RangeUnits;
}

/**
 * String representing the ISO format of the time
 */
export type RangeUnits = number[] | string[];
export type RangeUnit = RangeUnits[number];

export interface RangeSelector {
  selectionType: 'range';
  field: string;
  start: RangeUnit;
  end: RangeUnit;
}

export type ChartDataValueSelector = ValueSelector;

export interface ChartDataIntervalSelector {
  selectionType: 'data';
  axes: (RangeSelector | ValueSelector)[];
}

export type ChartDataSelector =
  | ChartDataValueSelector
  | ChartDataIntervalSelector;

export type FilterClause = ChartDataSelector & {
  filterType: 'include' | 'exclude';
  source: 'color_legend' | 'size_legend' | 'data';
};

export interface FilterMetadata {
  /** @deprecated Use advancedFilters instead */
  filter?: FilterClause[];
  advancedFilters?: DataframeFilter[];
}

export interface VisualizationCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name?: string;
  deepnote_visualization_spec?: VegaLiteSpec;
  deepnote_config_collapsed?: boolean;
  deepnote_chart_height?: number;
  deepnote_chart_filter?: FilterMetadata;
}

export interface CodeCell extends ExecutableCodeCellBase {
  cell_type: 'code';
  metadata: CodeCellMetadata;
  source: string;
}

export interface SqlCell extends ExecutableCodeCellBase {
  cell_type: 'sql';
  metadata: SqlCellMetadata;
  source: string;
}

export interface NotebookFunctionCell extends ExecutableCodeCellBase {
  cell_type: 'notebook-function';
  metadata: NotebookFunctionCellMetadata;
  source: '';
}

export interface InputTextCell extends ExecutableCellBase {
  cell_type: 'input-text';
  metadata: InputTextCellMetadata;
  source: string;
}

export interface InputCheckboxCell extends ExecutableCellBase {
  cell_type: 'input-checkbox';
  metadata: InputCheckboxCellMetadata;
  source: string;
}

export interface InputTextareaCell extends ExecutableCellBase {
  cell_type: 'input-textarea';
  metadata: InputTextareaCellMetadata;
  source: string;
}

export interface InputFileCell extends ExecutableCellBase {
  cell_type: 'input-file';
  metadata: InputFileCellMetadata;
  source: string;
}

export interface ButtonCell extends ExecutableCellBase {
  cell_type: 'button';
  source: '';
  metadata: ButtonCellMetadata;
}

export interface SeparatorCell extends CellBase {
  cell_type: 'separator';
  source: '';
  metadata: SeparatorCellMetadata;
}

export interface FormatMarks {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  /* the color accepts any valid CSS color value ('#000000', 'red', 'rgb(2,2,2)') */
  color?: string;
}

export interface FormattedRangeMarks extends FormatMarks {}

export type FormattedRange = FormattedRangeText | FormattedRangeLink;

export interface FormattedRangeLink {
  type: 'link';
  url: string;
  fromCodePoint: number;
  toCodePoint: number;
  // ranges are local to the link
  ranges: FormattedRangeText[];
}

export interface FormattedRangeText {
  type?: 'marks';
  fromCodePoint: number;
  toCodePoint: number;
  marks: FormattedRangeMarks;
}

export interface TextCellMetadata extends CellMetadata {
  is_collapsed?: boolean;
  formattedRanges?: FormattedRange[];
}

export interface TodoTextCellMetadata extends TextCellMetadata {
  checked?: boolean;
}

export type CalloutTextCellColor =
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'purple';

export interface CalloutTextCellMetadata extends TextCellMetadata {
  color?: CalloutTextCellColor;
}

export interface ParagraphTextCell extends CellBase {
  cell_type: 'text-cell-p';
  metadata: TextCellMetadata;
  source: string;
}

export type HeadingTextCellType =
  | 'text-cell-h1'
  | 'text-cell-h2'
  | 'text-cell-h3'
  | 'text-cell-h4'
  | 'text-cell-h5'
  | 'text-cell-h6';

export interface Heading1TextCell extends CellBase {
  cell_type: 'text-cell-h1';
  metadata: TextCellMetadata;
  source: string;
}

export interface Heading2TextCell extends CellBase {
  cell_type: 'text-cell-h2';
  metadata: TextCellMetadata;
  source: string;
}

export interface Heading3TextCell extends CellBase {
  cell_type: 'text-cell-h3';
  metadata: TextCellMetadata;
  source: string;
}

export type HeadingTextCell =
  | Heading1TextCell
  | Heading2TextCell
  | Heading3TextCell;

export interface BulletTextCell extends CellBase {
  cell_type: 'text-cell-bullet';
  metadata: TextCellMetadata;
  source: string;
}

export interface TodoTextCell extends CellBase {
  cell_type: 'text-cell-todo';
  metadata: TodoTextCellMetadata;
  source: string;
}

export interface CalloutTextCell extends CellBase {
  cell_type: 'text-cell-callout';
  metadata: CalloutTextCellMetadata;
  source: string;
}

export type TextCell =
  | ParagraphTextCell
  | HeadingTextCell
  | BulletTextCell
  | TodoTextCell
  | CalloutTextCell;

export interface InputSelectCell extends ExecutableCellBase {
  cell_type: 'input-select';
  metadata: InputSelectCellMetadata;
  source: string;
}

export interface InputSliderCell extends ExecutableCellBase {
  cell_type: 'input-slider';
  metadata: InputSliderCellMetadata;
  source: string;
}

export interface InputDateCell extends ExecutableCellBase {
  cell_type: 'input-date';
  metadata: InputDateCellMetadata;
  source: string;
}

export interface MarkdownCell extends CellBase {
  cell_type: 'markdown';
  metadata: MarkdownCellMetadata;
  source: string;
}

export interface VisualizationCell extends ExecutableCellBase {
  cell_type: 'visualization';
  source: '';
  metadata: VisualizationCellMetadata;
}

export interface ImageCell extends CellBase {
  cell_type: 'image';
  metadata: ImageCellMetadata;
  source: '';
}

export interface BigNumberCell extends ExecutableCellBase {
  cell_type: 'big-number';
  metadata: BigNumberCellMetadata;
  source: string;
}

export interface BigNumberCellMetadata extends ExecutableCellMetadata {
  deepnote_big_number_title: string;
  deepnote_big_number_value: string;
  deepnote_big_number_format: string;
  deepnote_big_number_comparison_enabled?: boolean;
  deepnote_big_number_comparison_title?: string;
  deepnote_big_number_comparison_value?: string;
  deepnote_big_number_comparison_type?: string;
  deepnote_big_number_comparison_format?: string;
}

export type Cell =
  | MarkdownCell
  | CodeCell
  | SqlCell
  | NotebookFunctionCell
  | InputCell
  | TextCell
  | VisualizationCell
  | ImageCell
  | ButtonCell
  | SeparatorCell
  | BigNumberCell;
export type InputCell =
  | InputCheckboxCell
  | InputTextCell
  | InputSelectCell
  | InputDateCell
  | InputDateRangeCell
  | InputSliderCell
  | InputTextareaCell
  | InputFileCell;

export interface InputDateRangeCellMetadata extends ExecutableCellMetadata {
  deepnote_variable_name: string;
  deepnote_variable_value: [string, string] | string;
  deepnote_variable_default_value?: [string, string] | string;
  deepnote_input_label?: string;
}

export interface InputDateRangeCell extends ExecutableCellBase {
  cell_type: 'input-date-range';
  metadata: InputDateRangeCellMetadata;
  source: string;
}

// Source:
// deepnote-internal
//
// Path:
// libs/notebook-conversions/src/convert-deepnote-cell-to-jupyter-cell.ts
//
// Commit SHA:
// d943d4a9e9fb1a80f608072875f07a25fad3ce9e

export function convertDeepnoteCellToJupyterCell(
  cellId: string,
  unclonedCell: Cell,
  executionContext?: ExecutionContext
): JupyterCell {
  const cell = _cloneDeep(unclonedCell);

  const jupyterCellMetadata: JupyterCell['metadata'] = {
    ...cell.metadata,
    cell_id: cellId
  };

  jupyterCellMetadata.deepnote_cell_type = cell.cell_type;

  if (isSqlCell(cell)) {
    // let's store the raw SQL query in the metadata, since cell.source will be replaced by runnable python code
    jupyterCellMetadata.deepnote_sql_source = cell.source;
  }

  if (isExecutableCell(cell)) {
    // Jupyter spec requires an explicit null here
    cell.execution_count =
      cell.execution_count === undefined ? null : cell.execution_count;
    cell.outputs = cell.outputs === undefined ? [] : cell.outputs;

    if (cell.outputs) {
      cell.outputs.forEach(output => {
        delete output.truncated;
      });
    } else {
      console.warn(
        '[convertDeepnoteToJupyter] Cell outputs not present in a code cell'
      );
    }
  }

  const source = createJupyterSource(
    {
      type: cell.cell_type,
      source: cell.source,
      metadata: cell.metadata
    },
    executionContext
  );

  const jupyterCell: JupyterCell = {
    ...cell,
    cell_type: convertCellTypeToJupyter(cell.cell_type),
    metadata: jupyterCellMetadata,
    source
  };
  return jupyterCell;
}
