// Source:
// deepnote-internal
//
// Path:
// libs/shared/src/types.ts

// Commit SHA:
// 3a0bab71e1ee86530c74eb5ada2e1873848c5fea

export const TEXT_CELL_TYPES = [
  'text-cell-h1',
  'text-cell-h2',
  'text-cell-h3',
  'text-cell-p',
  'text-cell-bullet',
  'text-cell-todo',
  'text-cell-callout'
] as const;
export type TextCellType = (typeof TEXT_CELL_TYPES)[number];

export const INPUT_CELL_TYPES = [
  'input-text',
  'input-textarea',
  'input-select',
  'input-date',
  'input-date-range',
  'input-slider',
  'input-file',
  'input-checkbox'
] as const;
export type InputCellType = (typeof INPUT_CELL_TYPES)[number];
export const CELL_TYPES = [
  'code',
  'sql',
  'markdown',
  'notebook-function',
  ...INPUT_CELL_TYPES,
  ...TEXT_CELL_TYPES,
  'visualization',
  'image',
  'button',
  'separator',
  'big-number'
] as const;
export type CellType = (typeof CELL_TYPES)[number];

// Source:
// deepnote-internal
//
// Path:
// libs/jupyter/src/jupyter.ts

// Commit SHA:
// 0ac69479e192dbbb04ae10cd7b027872d09fbb14

/**
 * A type which describes the type of cell.
 */
export type JupyterCellType = 'code' | 'markdown' | 'raw';
