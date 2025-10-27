import { transformDeepnoteYamlToNotebookContent } from '../transform-deepnote-yaml-to-notebook-content';
import { deserializeDeepnoteFile } from '@deepnote/blocks';

jest.mock('@deepnote/blocks', () => ({
  deserializeDeepnoteFile: jest.fn()
}));

jest.mock('../convert-deepnote-block-to-jupyter-cell', () => ({
  convertDeepnoteBlockToJupyterCell: jest.fn(block => ({
    cell_type: block.type === 'code' ? 'code' : 'markdown',
    source: block.source || '',
    metadata: block.type === 'code' ? { cell_id: block.id } : {},
    ...(block.type === 'code' && {
      execution_count: block.executionCount || null,
      outputs: block.outputs || []
    })
  }))
}));

describe('transformDeepnoteYamlToNotebookContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transform a simple Deepnote YAML to notebook content', async () => {
    const mockDeepnoteFile = {
      project: {
        notebooks: [
          {
            id: 'notebook-1',
            name: 'Main Notebook',
            blocks: [
              {
                id: 'block-1',
                type: 'code',
                source: 'print("hello")',
                metadata: {}
              },
              {
                id: 'block-2',
                type: 'markdown',
                source: '# Title',
                metadata: {}
              }
            ]
          }
        ]
      }
    };

    (deserializeDeepnoteFile as jest.Mock).mockResolvedValue(mockDeepnoteFile);

    const result = await transformDeepnoteYamlToNotebookContent('yaml-string');

    expect(result.cells).toHaveLength(2);
    const cells = result.cells as any[];
    expect(cells[0].cell_type).toBe('code');
    expect(cells[1].cell_type).toBe('markdown');
    expect(result.metadata.deepnote.notebooks).toHaveProperty('Main Notebook');
    expect(result.nbformat).toBe(4);
    expect(result.nbformat_minor).toBe(0);
  });

  it('should include metadata for all notebooks', async () => {
    const mockDeepnoteFile = {
      project: {
        notebooks: [
          {
            id: 'notebook-1',
            name: 'First Notebook',
            blocks: [
              {
                id: 'block-1',
                type: 'code',
                source: 'x = 1',
                metadata: {}
              }
            ]
          },
          {
            id: 'notebook-2',
            name: 'Second Notebook',
            blocks: [
              {
                id: 'block-2',
                type: 'markdown',
                source: '# Second',
                metadata: {}
              }
            ]
          }
        ]
      }
    };

    (deserializeDeepnoteFile as jest.Mock).mockResolvedValue(mockDeepnoteFile);

    const result = await transformDeepnoteYamlToNotebookContent('yaml-string');

    expect(result.metadata.deepnote.notebooks).toHaveProperty('First Notebook');
    expect(result.metadata.deepnote.notebooks).toHaveProperty(
      'Second Notebook'
    );
    expect(result.metadata.deepnote.notebooks['First Notebook']!.id).toBe(
      'notebook-1'
    );
    expect(result.metadata.deepnote.notebooks['Second Notebook']!.id).toBe(
      'notebook-2'
    );
  });

  it('should use the first notebook for primary cell content', async () => {
    const mockDeepnoteFile = {
      project: {
        notebooks: [
          {
            id: 'notebook-1',
            name: 'First',
            blocks: [
              {
                id: 'block-1',
                type: 'code',
                source: 'first_notebook_code',
                metadata: {}
              }
            ]
          },
          {
            id: 'notebook-2',
            name: 'Second',
            blocks: [
              {
                id: 'block-2',
                type: 'code',
                source: 'second_notebook_code',
                metadata: {}
              }
            ]
          }
        ]
      }
    };

    (deserializeDeepnoteFile as jest.Mock).mockResolvedValue(mockDeepnoteFile);

    const result = await transformDeepnoteYamlToNotebookContent('yaml-string');

    expect(result.cells).toHaveLength(1);
    const cells = result.cells as any[];
    expect(cells[0].source).toBe('first_notebook_code');

    const { convertDeepnoteBlockToJupyterCell } = jest.requireMock(
      '../convert-deepnote-block-to-jupyter-cell'
    );
    expect(convertDeepnoteBlockToJupyterCell).toHaveBeenCalledTimes(3);
    const calls = convertDeepnoteBlockToJupyterCell.mock.calls;
    expect(calls[0][0]).toMatchObject({
      id: 'block-1',
      source: 'first_notebook_code'
    });
    expect(calls[1][0]).toMatchObject({
      id: 'block-2',
      source: 'second_notebook_code'
    });
    expect(calls[2][0]).toMatchObject({
      id: 'block-1',
      source: 'first_notebook_code'
    });
  });

  it('should handle empty notebooks gracefully', async () => {
    const mockDeepnoteFile = {
      project: {
        notebooks: [
          {
            id: 'notebook-1',
            name: 'Empty Notebook',
            blocks: []
          }
        ]
      }
    };

    (deserializeDeepnoteFile as jest.Mock).mockResolvedValue(mockDeepnoteFile);

    const result = await transformDeepnoteYamlToNotebookContent('yaml-string');

    expect(result.cells).toHaveLength(0);
    expect(result.metadata.deepnote.notebooks).toHaveProperty('Empty Notebook');
  });

  it('should handle file with no notebooks', async () => {
    const mockDeepnoteFile = {
      project: {
        notebooks: []
      }
    };

    (deserializeDeepnoteFile as jest.Mock).mockResolvedValue(mockDeepnoteFile);

    const result = await transformDeepnoteYamlToNotebookContent('yaml-string');

    expect(result.cells).toHaveLength(1);
    const cells = result.cells as any[];
    expect(cells[0].cell_type).toBe('code');
    expect(cells[0].source).toContain('No notebooks found');
  });

  it('should include kernel metadata', async () => {
    const mockDeepnoteFile = {
      project: {
        notebooks: [
          {
            id: 'notebook-1',
            name: 'Test',
            blocks: []
          }
        ]
      }
    };

    (deserializeDeepnoteFile as jest.Mock).mockResolvedValue(mockDeepnoteFile);

    const result = await transformDeepnoteYamlToNotebookContent('yaml-string');

    expect(result.metadata).toHaveProperty('kernelspec');
    expect(result.metadata).toHaveProperty('language_info');
    expect(result.metadata.kernelspec).toHaveProperty('name', 'python3');
    expect(result.metadata.language_info).toHaveProperty('name', 'python');
  });

  it('should throw error when deserialization fails', async () => {
    (deserializeDeepnoteFile as jest.Mock).mockRejectedValue(
      new Error('Invalid YAML')
    );

    await expect(
      transformDeepnoteYamlToNotebookContent('invalid-yaml')
    ).rejects.toThrow('Failed to transform Deepnote YAML to notebook content.');
  });

  it('should preserve notebook structure in metadata', async () => {
    const mockDeepnoteFile = {
      project: {
        notebooks: [
          {
            id: 'notebook-1',
            name: 'Test Notebook',
            blocks: [
              {
                id: 'block-1',
                type: 'code',
                source: 'x = 1',
                metadata: {},
                executionCount: 5,
                outputs: [{ output_type: 'stream', text: 'output' }]
              }
            ]
          }
        ]
      }
    };

    (deserializeDeepnoteFile as jest.Mock).mockResolvedValue(mockDeepnoteFile);

    const result = await transformDeepnoteYamlToNotebookContent('yaml-string');

    const notebookMetadata =
      result.metadata.deepnote.notebooks['Test Notebook']!;
    expect(notebookMetadata.id).toBe('notebook-1');
    expect(notebookMetadata.name).toBe('Test Notebook');
    expect(notebookMetadata.cells).toHaveLength(1);
    expect(notebookMetadata.cells[0]!.cell_type).toBe('code');
  });

  it('should handle multiple blocks of different types', async () => {
    const mockDeepnoteFile = {
      project: {
        notebooks: [
          {
            id: 'notebook-1',
            name: 'Mixed Content',
            blocks: [
              {
                id: 'block-1',
                type: 'code',
                source: 'import pandas',
                metadata: {}
              },
              {
                id: 'block-2',
                type: 'markdown',
                source: '# Analysis',
                metadata: {}
              },
              {
                id: 'block-3',
                type: 'code',
                source: 'df.head()',
                metadata: {}
              },
              {
                id: 'block-4',
                type: 'markdown',
                source: 'Results below',
                metadata: {}
              }
            ]
          }
        ]
      }
    };

    (deserializeDeepnoteFile as jest.Mock).mockResolvedValue(mockDeepnoteFile);

    const result = await transformDeepnoteYamlToNotebookContent('yaml-string');

    expect(result.cells).toHaveLength(4);
    const cells = result.cells as any[];
    expect(cells[0].cell_type).toBe('code');
    expect(cells[1].cell_type).toBe('markdown');
    expect(cells[2].cell_type).toBe('code');
    expect(cells[3].cell_type).toBe('markdown');
  });
});
