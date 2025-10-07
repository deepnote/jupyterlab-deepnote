import { assertUnreachable } from './assert-unreachable';
import { CellType, JupyterCellType } from './types';

// Source:
// deepnote-internal
//
// Path:
// libs/shared/src/utils/utils.ts
//
// Commit SHA:
// 97e072bee9089c3122bb3ea82ff478e890280014

// eslint-disable-next-line complexity
export function convertCellTypeToJupyter(cellType: CellType): JupyterCellType {
  switch (cellType) {
    case 'big-number':
      return 'code';
    case 'code':
      return 'code';
    case 'sql':
      return 'code';
    case 'notebook-function':
      return 'code';

    case 'markdown':
      return 'markdown';

    case 'text-cell-h1':
    case 'text-cell-h3':
    case 'text-cell-h2':
    case 'text-cell-p':
    case 'text-cell-bullet':
    case 'text-cell-todo':
    case 'text-cell-callout':
    case 'image':
    case 'button':
    case 'separator':
      return 'markdown';
    case 'input-text':
    case 'input-checkbox':
    case 'input-textarea':
    case 'input-file':
    case 'input-select':
    case 'input-date-range':
    case 'input-date':
    case 'input-slider':
      return 'code';

    case 'visualization':
      return 'code';

    default:
      assertUnreachable(cellType);
      throw new Error(`Invalid cell type ${cellType}`);
  }
}
