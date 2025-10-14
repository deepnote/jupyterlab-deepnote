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
      return 'code'
    default:
      return 'markdown'
  }
}
