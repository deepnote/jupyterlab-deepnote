export function convertDeepnoteBlockTypeToJupyter(blockType: string) {
  switch (blockType) {
    case 'big-number':
    case 'code':
    case 'sql':
    case 'notebook-function':
    case 'input-text':
    case 'input-checkbox':
    case 'input-textarea':
    case 'input-file':
    case 'input-select':
    case 'input-date-range':
    case 'input-date':
    case 'input-slider':
    case 'visualization':
      return 'code';

    case 'markdown':
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
    default:
      return 'markdown';
  }
}
