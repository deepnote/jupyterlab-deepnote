import _countBy from 'lodash/countBy';

import { createMetadataAndStateFromBlock } from '../blocks/block-metadata-utils';
import { INPUT_CELL_TYPES, isBigNumberCell, TEXT_CELL_TYPES } from '../types';
import { bigNumberCellUtils } from './big-number-cell-utils';
import { buttonCellUtils } from './button-cell-utils';
import { codeCellUtils } from './code-cell-utils';
import { imageCellUtils } from './image-cell-utils';
import { inputCheckboxCellUtils } from './input-checkbox-cell-utils';
import { inputDateCellUtils } from './input-date-cell-utils';
import { inputDateRangeCellUtils } from './input-date-range-cell-utils';
import { inputFileCellUtils } from './input-file-cell-utils';
import {
  inputSelectCellUtils,
  validateSelectInputVariable
} from './input-select-cell-utils';
import { inputSliderCellUtils } from './input-slider-cell-utils';
import { inputTextCellUtils } from './input-text-cell-utils';
import { inputTextareaCellUtils } from './input-textarea-cell-utils';
import { markdownCellUtils } from './markdown-cell-utils';
import { notebookFunctionCellUtils } from './notebook-function-cell-utils';
import { separatorCellUtils } from './separator-cell-utils';
import { sqlCellUtils } from './sql-cell-utils';
import {
  textCellBulletUtils,
  textCellCalloutUtils,
  textCellH1Utils,
  textCellH2Utils,
  textCellH3Utils,
  textCellParagraphUtils,
  textCellTodoUtils
} from './text-cell-utils';
import { visualizationCellUtils } from './visualization-cell-utils';

import type { JupyterCell } from '@deepnote/jupyter';
import type { IOutput } from '@jupyterlab/nbformat';
import type {
  ButtonCell,
  Cell,
  CellByType,
  CellType,
  CodeCell,
  DataTableCell,
  DetachedCell,
  DetachedExecutableCell,
  DetachedExecutableCellWithContentDeps,
  EmbeddableCell,
  ExecutableCell,
  ExecutableCellWithContentDeps,
  ImageCell,
  InputCell,
  InputCellType,
  InputCheckboxCell,
  InputDateCell,
  InputDateRangeCell,
  InputFileCell,
  InputSelectCell,
  InputSliderCell,
  InputTextareaCell,
  InputTextCell,
  MarkdownCell,
  NotebookFunctionCell,
  SeparatorCell,
  SqlCell,
  TextCell,
  TextCellType,
  VisualizationCell
} from '../types';

export { validateSelectInputVariable };

// see https://github.com/deepnote/compute-helpers/blob/af569f06396a36bbc7e221445dfb23093ab8db39/code/sql_utils.py#L15
export type SqlCacheMode = 'cache_disabled' | 'always_write' | 'read_or_write';

export type SubmittedBy = 'user' | 'scheduling' | 'api' | 'ai';

// More specific type for workload context to track why workloads are running
export type WorkloadType = 'notebook' | 'app' | 'api' | 'scheduled-run';

export type VariableContext = string[];

export interface ExecutionContext {
  user?: { id: string; email: string | null };
  submittedBy?: SubmittedBy;
  // TODO: It would probably be nicer to use `SqlAlchemyInput` type here.
  // To achieve that, we would need to move `SqlAlchemyInput` to `libs/shared` package.
  federatedIntegrationConnectionString?: string | null;
  parentNotebookFunctionRunId?: string | null;
  notebookFunctionApiToken?: string | null;
  /**
   * If set, button blocks with this variable name that are being executed
   * will resolve their source code to set the variable to True, False otherwise.
   */
  variableContext?: VariableContext;
  workspaceId: string;
  projectId: string;
  notebookId: string;
  sqlCacheMode: SqlCacheMode;
  tenantDomain?: string;
}

export interface DeepnoteCellUtils<TCell extends Cell> {
  parseJupyterSource: (
    cellId: string,
    jupyterCell: JupyterCell
  ) => Extract<DetachedCell, { cell_type: TCell['cell_type'] }>;
  createJupyterSource: (
    data: {
      type: TCell['cell_type'];
      source: TCell['source'];
      metadata: TCell['metadata'];
    },
    executionContext?: ExecutionContext
  ) => string;
  // NOTE: This wrapper is not included in source hash calculations.
  wrapJupyterSource?: (
    code: string,
    data: {
      type: TCell['cell_type'];
      source: TCell['source'];
      metadata: TCell['metadata'];
    },
    executionContext?: ExecutionContext
  ) => string;
  createInterruptJupyterSource?: (
    data: {
      type: TCell['cell_type'];
      source: TCell['source'];
      metadata: TCell['metadata'];
    },
    executionContext?: ExecutionContext
  ) => string | null;
  cleanJupyterOutputs?: (outputs: IOutput[]) => IOutput[];
  createNewCell(params: {
    id: string;
    existingCellVariableNames: Set<string>;
    source?: string;
    metadata?: TCell['metadata'];
  }): TCell & { cellId: string };
}

export const cellUtils: {
  [cellType in CellType]: DeepnoteCellUtils<CellByType[cellType]>;
} = {
  'big-number': bigNumberCellUtils,
  sql: sqlCellUtils,
  code: codeCellUtils,
  markdown: markdownCellUtils,
  'notebook-function': notebookFunctionCellUtils,
  'input-text': inputTextCellUtils,
  'input-textarea': inputTextareaCellUtils,
  'input-file': inputFileCellUtils,
  'input-select': inputSelectCellUtils,
  'input-date': inputDateCellUtils,
  'input-date-range': inputDateRangeCellUtils,
  'input-slider': inputSliderCellUtils,
  'input-checkbox': inputCheckboxCellUtils,
  'text-cell-h1': textCellH1Utils,
  'text-cell-h2': textCellH2Utils,
  'text-cell-h3': textCellH3Utils,
  'text-cell-p': textCellParagraphUtils,
  'text-cell-bullet': textCellBulletUtils,
  'text-cell-todo': textCellTodoUtils,
  'text-cell-callout': textCellCalloutUtils,
  visualization: visualizationCellUtils,
  image: imageCellUtils,
  button: buttonCellUtils,
  separator: separatorCellUtils
} as const;

export function createJupyterSource<T extends CellType>(
  data: {
    type: CellByType[T]['cell_type'];
    source: CellByType[T]['source'];
    metadata: CellByType[T]['metadata'];
  },
  executionContext?: ExecutionContext
): string {
  const cellUtil = cellUtils[data.type];
  return cellUtil.createJupyterSource(data, executionContext);
}

export function wrapJupyterSource<T extends CellType>(
  code: string,
  data: {
    type: CellByType[T]['cell_type'];
    source: CellByType[T]['source'];
    metadata: CellByType[T]['metadata'];
  },
  executionContext?: ExecutionContext
): string {
  const cellUtil = cellUtils[data.type];
  return cellUtil.wrapJupyterSource
    ? cellUtil.wrapJupyterSource(code, data, executionContext)
    : code;
}

export function createInterruptJupyterSource<T extends CellType>(
  data: {
    type: CellByType[T]['cell_type'];
    source: CellByType[T]['source'];
    metadata: CellByType[T]['metadata'];
  },
  executionContext?: ExecutionContext
): string | null {
  const cellUtil = cellUtils[data.type];
  return (
    cellUtil.createInterruptJupyterSource?.(data, executionContext) ?? null
  );
}

export function cleanJupyterOutputs<T extends CellType>(
  outputs: IOutput[],
  cellType: T
): IOutput[] {
  const cellUtil = cellUtils[cellType];
  return cellUtil.cleanJupyterOutputs
    ? cellUtil.cleanJupyterOutputs(outputs)
    : outputs;
}

export function parseJupyterSource<T extends CellType>(
  cellType: CellByType[T]['cell_type'],
  cellId: string,
  jupyterCell: JupyterCell
): Extract<DetachedCell, { cell_type: CellByType[T]['cell_type'] }> {
  const cellUtil = cellUtils[cellType];
  return cellUtil.parseJupyterSource(cellId, jupyterCell);
}

export function createNewCell<T extends CellType>(
  cellType: T,
  params: {
    id: string;
    existingCellVariableNames: Set<string>;
    source?: CellByType[T]['source'];
    metadata?: CellByType[T]['metadata'];
  }
): CellByType[T] & { cellId: string } {
  const cellUtil = cellUtils[cellType];
  return cellUtil.createNewCell(params);
}

export function getUserEditableContent<TCell extends DetachedCell>(
  cell: TCell
) {
  return {
    type: cell.cell_type,
    source: cell.source,
    metadata: isExecutableCell(cell)
      ? createMetadataAndStateFromBlock({
          block_type: cell.cell_type,
          metadata: cell.metadata,
          execution_count: cell.execution_count,
          outputs_reference: cell.outputs_reference
        }).metadata
      : cell.metadata,
    block_group: cell.block_group
  };
}

// these 2 variable assignments function as compile-time tests that the keys of the object above has 1-to-1 mapping with CellType
// exporting `test1` and `test2` only to prevent unused variables TS error
export const test1: CellType = null as unknown as keyof typeof cellUtils;
export const test2: keyof typeof cellUtils = null as unknown as CellType;

export function getCellCountsByType(cells: { [id: string]: Cell }): {
  [cellType in CellType]?: number;
} {
  return _countBy(Object.values(cells), cell => cell.cell_type);
}

export function canCellHaveDataTableOutput(
  cell: Cell | undefined | null
): cell is DataTableCell {
  return isCodeCell(cell) || isSqlCell(cell);
}

export function canCellHaveHiddenDefinition(cell: Cell | undefined | null) {
  return isCodeCell(cell) || isSqlCell(cell) || isNotebookFunctionCell(cell);
}

export function canCellHaveFunctionExport(cell: Cell | undefined | null) {
  return isCodeCell(cell) || isSqlCell(cell);
}

export function isCellType(maybeCellType: string): maybeCellType is CellType {
  return maybeCellType in cellUtils;
}

export function isTextCellType(cellType: CellType): cellType is TextCellType {
  return (TEXT_CELL_TYPES as ReadonlyArray<string>).includes(cellType);
}

export function isExecutableCellType(
  cellType: CellType
): cellType is ExecutableCell['cell_type'] {
  return isExecutableCell({ cell_type: cellType } as unknown as Cell);
}

export function isExecutableCellWithContentDepsType(
  cellType: CellType
): cellType is ExecutableCellWithContentDeps['cell_type'] {
  return isExecutableCellWithContentDeps({
    cell_type: cellType
  } as unknown as Cell);
}

export function isExecutableCell<T extends Cell | DetachedCell>(
  cell: T | undefined | null
  // @ts-expect-error Conditional types in type predicates fail but it works from the outside.
): cell is T extends DetachedCell ? DetachedExecutableCell : ExecutableCell {
  return (
    isCodeCell(cell) ||
    isSqlCell(cell) ||
    isNotebookFunctionCell(cell) ||
    isInputCell(cell) ||
    isVisualizationCell(cell) ||
    isBigNumberCell(cell) ||
    isButtonCell(cell)
  );
}

export function isExecutableCellWithContentDeps<T extends Cell | DetachedCell>(
  cell: T | undefined | null
  // @ts-expect-error Conditional types in type predicates fail but it works from the outside.
): cell is T extends DetachedCell
  ? DetachedExecutableCellWithContentDeps
  : ExecutableCellWithContentDeps {
  return isCodeCell(cell) || isSqlCell(cell);
}

export function isFunctionExportableCellType(cellType: CellType) {
  return cellType === 'code' || cellType === 'sql';
}

export function isEmbeddableCell(
  cell: Cell | undefined | null
): cell is EmbeddableCell {
  return (
    isCodeCell(cell) ||
    isSqlCell(cell) ||
    isVisualizationCell(cell) ||
    isNotebookFunctionCell(cell)
  );
}

export function isCodeCell(cell: Cell | undefined | null): cell is CodeCell {
  return cell?.cell_type === 'code';
}

export function isSqlCell(cell: Cell | undefined | null): cell is SqlCell {
  return cell?.cell_type === 'sql';
}

export function isMarkdownCell(
  cell: Cell | undefined | null
): cell is MarkdownCell {
  return cell?.cell_type === 'markdown';
}

export function isNotebookFunctionCell(
  cell: Cell | undefined | null
): cell is NotebookFunctionCell {
  return cell?.cell_type === 'notebook-function';
}

export function isInputCellType(cellType: string): cellType is InputCellType {
  return (INPUT_CELL_TYPES as ReadonlyArray<string>).includes(cellType);
}

export function isInputCell(cell: Cell | undefined | null): cell is InputCell {
  return (
    isInputCheckboxCell(cell) ||
    isInputTextCell(cell) ||
    isInputTextareaCell(cell) ||
    isInputSelectCell(cell) ||
    isInputDateCell(cell) ||
    isInputSliderCell(cell) ||
    isInputFileCell(cell) ||
    isInputDateRangeCell(cell)
  );
}

export function isButtonCell(
  cell: Cell | undefined | null
): cell is ButtonCell {
  return cell?.cell_type === 'button';
}

export function isSeparatorCell(
  cell: Cell | undefined | null
): cell is SeparatorCell {
  return cell?.cell_type === 'separator';
}

export function isTextCell(cell: Cell | undefined | null): cell is TextCell {
  return !!cell?.cell_type && isTextCellType(cell.cell_type);
}

export function isInputTextCell(
  cell: Cell | undefined | null
): cell is InputTextCell {
  return cell?.cell_type === 'input-text';
}

export function isInputCheckboxCell(
  cell: Cell | undefined | null
): cell is InputCheckboxCell {
  return cell?.cell_type === 'input-checkbox';
}

export function isInputTextareaCell(
  cell: Cell | undefined | null
): cell is InputTextareaCell {
  return cell?.cell_type === 'input-textarea';
}

export function isInputFileCell(
  cell: Cell | undefined | null
): cell is InputFileCell {
  return cell?.cell_type === 'input-file';
}

export function isInputSelectCell(
  cell: Cell | undefined | null
): cell is InputSelectCell {
  return cell?.cell_type === 'input-select';
}

export function isInputSliderCell(
  cell: Cell | undefined | null
): cell is InputSliderCell {
  return cell?.cell_type === 'input-slider';
}

export function isInputDateCell(
  cell: Cell | undefined | null
): cell is InputDateCell {
  return cell?.cell_type === 'input-date';
}

export function isInputDateRangeCell(
  cell: Cell | undefined | null
): cell is InputDateRangeCell {
  return cell?.cell_type === 'input-date-range';
}

export function isVisualizationCell(
  cell: Cell | undefined | null
): cell is VisualizationCell {
  return cell?.cell_type === 'visualization';
}

export function isImageCell(cell: Cell | undefined | null): cell is ImageCell {
  return cell?.cell_type === 'image';
}
