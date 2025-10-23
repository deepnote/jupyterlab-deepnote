// Copyright (c) Deepnote
// Distributed under the terms of the Modified BSD License.

import { convertDeepnoteBlockToJupyterCell } from '../convert-deepnote-block-to-jupyter-cell';
import { DeepnoteBlock } from '@deepnote/blocks';

jest.mock('@deepnote/blocks', () => ({
  createPythonCode: jest.fn((block: any) => block.source || 'print("test")'),
  createMarkdown: jest.fn((block: any) => block.source || '# Test')
}));

jest.mock('../convert-deepnote-block-type-to-jupyter', () => ({
  convertDeepnoteBlockTypeToJupyter: jest.fn((type: string) => {
    if (
      [
        'code',
        'sql',
        'notebook-function',
        'big-number',
        'visualization',
        'input-text',
        'input-checkbox',
        'input-textarea',
        'input-file',
        'input-select',
        'input-date-range',
        'input-date',
        'input-slider'
      ].includes(type)
    ) {
      return 'code';
    }
    return 'markdown';
  })
}));

describe('convertDeepnoteBlockToJupyterCell', () => {
  describe('code cells', () => {
    it('should convert a basic code block to a Jupyter code cell', () => {
      const block: DeepnoteBlock = {
        id: 'block-1',
        type: 'code',
        source: 'print("hello")',
        metadata: { foo: 'bar' }
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('code');
      expect(result.metadata).toEqual({ foo: 'bar', cell_id: 'block-1' });
      expect(result.source).toBe('print("hello")');
      expect(result.execution_count).toBeNull();
      expect(result.outputs).toEqual([]);

      const { createPythonCode } = jest.requireMock('@deepnote/blocks');
      expect(createPythonCode).toHaveBeenCalledTimes(1);
      expect(createPythonCode).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'block-1' })
      );
    });

    it('should include execution count if present', () => {
      const block: DeepnoteBlock = {
        id: 'block-2',
        type: 'code',
        source: 'x = 1',
        metadata: {},
        executionCount: 5
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('code');
      expect(result.execution_count).toBe(5);
    });

    it('should include outputs if present', () => {
      const blockOutputs = [
        {
          output_type: 'stream',
          name: 'stdout',
          text: 'hello\n'
        }
      ];

      const block: DeepnoteBlock = {
        id: 'block-3',
        type: 'code',
        source: 'print("hello")',
        metadata: {},
        outputs: blockOutputs
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('code');
      expect(result.outputs).toEqual(blockOutputs);
    });

    it('should remove truncated property from outputs', () => {
      const blockOutputs = [
        {
          output_type: 'stream',
          name: 'stdout',
          text: 'hello\n',
          truncated: true
        }
      ];

      const block: DeepnoteBlock = {
        id: 'block-4',
        type: 'code',
        source: 'print("hello")',
        metadata: {},
        outputs: blockOutputs
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('code');
      expect(result.outputs).toHaveLength(1);
      const resultOutputs = result.outputs as any[];
      expect(resultOutputs[0]).not.toHaveProperty('truncated');
      expect(resultOutputs[0]).toEqual({
        output_type: 'stream',
        name: 'stdout',
        text: 'hello\n'
      });
    });

    it('should handle multiple outputs with truncated properties', () => {
      const blockOutputs = [
        {
          output_type: 'stream',
          name: 'stdout',
          text: 'line1\n',
          truncated: true
        },
        {
          output_type: 'stream',
          name: 'stdout',
          text: 'line2\n',
          truncated: false
        }
      ];

      const block: DeepnoteBlock = {
        id: 'block-5',
        type: 'code',
        source: 'print("test")',
        metadata: {},
        outputs: blockOutputs
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('code');
      expect(result.outputs).toHaveLength(2);
      const resultOutputs = result.outputs as any[];
      expect(resultOutputs[0]).not.toHaveProperty('truncated');
      expect(resultOutputs[1]).not.toHaveProperty('truncated');
    });

    it('should not mutate the original block', () => {
      const blockOutputs = [
        {
          output_type: 'stream',
          name: 'stdout',
          text: 'hello\n',
          truncated: true
        }
      ];

      const block: DeepnoteBlock = {
        id: 'block-6',
        type: 'code',
        source: 'print("hello")',
        metadata: { test: 'value' },
        outputs: blockOutputs
      } as any;

      convertDeepnoteBlockToJupyterCell(block);

      expect(block.outputs![0]).toHaveProperty('truncated');
      expect(block.metadata).toEqual({ test: 'value' });
    });
  });

  describe('markdown cells', () => {
    it('should convert a basic markdown block to a Jupyter markdown cell', () => {
      const block: DeepnoteBlock = {
        id: 'block-7',
        type: 'markdown',
        source: '# Hello',
        metadata: { foo: 'bar' }
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('markdown');
      expect(result.metadata).toEqual({});
      expect(result.source).toBe('# Hello');

      const { createMarkdown } = jest.requireMock('@deepnote/blocks');
      expect(createMarkdown).toHaveBeenCalledTimes(1);
      expect(createMarkdown).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'block-7' })
      );
    });

    it('should convert text-cell-h1 to markdown cell', () => {
      const block: DeepnoteBlock = {
        id: 'block-8',
        type: 'text-cell-h1',
        source: 'Heading 1',
        metadata: {}
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('markdown');
    });

    it('should convert image block to markdown cell', () => {
      const block: DeepnoteBlock = {
        id: 'block-9',
        type: 'image',
        source: '![alt](url)',
        metadata: {}
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('markdown');
    });

    it('should not include metadata from Deepnote block in markdown cells', () => {
      const block: DeepnoteBlock = {
        id: 'block-10',
        type: 'markdown',
        source: 'Text',
        metadata: { deepnoteMetadata: 'should not appear' }
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('markdown');
      expect(result.metadata).toEqual({});
    });
  });

  describe('special block types', () => {
    it('should convert sql block to code cell', () => {
      const block: DeepnoteBlock = {
        id: 'block-11',
        type: 'sql',
        source: 'SELECT * FROM table',
        metadata: {}
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('code');
    });

    it('should convert visualization block to code cell', () => {
      const block: DeepnoteBlock = {
        id: 'block-12',
        type: 'visualization',
        source: 'chart_data',
        metadata: {}
      } as any;

      const result = convertDeepnoteBlockToJupyterCell(block);

      expect(result.cell_type).toBe('code');
    });

    it('should convert input blocks to code cells', () => {
      const inputTypes = [
        'input-text',
        'input-checkbox',
        'input-textarea',
        'input-file',
        'input-select',
        'input-date-range',
        'input-date',
        'input-slider'
      ];

      inputTypes.forEach(type => {
        const block: DeepnoteBlock = {
          id: `block-${type}`,
          type,
          source: 'input_value',
          metadata: {}
        } as any;

        const result = convertDeepnoteBlockToJupyterCell(block);

        expect(result.cell_type).toBe('code');
      });
    });
  });
});
