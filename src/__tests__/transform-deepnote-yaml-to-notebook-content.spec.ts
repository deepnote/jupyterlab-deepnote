import type { ICell } from '@jupyterlab/nbformat';
import { transformDeepnoteYamlToNotebookContent } from '../transform-deepnote-yaml-to-notebook-content';

describe('transformDeepnoteYamlToNotebookContent', () => {
  it('should transform a simple Deepnote YAML to notebook content', async () => {
    const yamlString = `
metadata:
  createdAt: 2025-04-30T14:02:50.919Z
  modifiedAt: 2025-09-05T11:05:19.666Z
project:
  id: test-project-id
  name: Test Project
  notebooks:
    - blocks:
        - content: print("hello")
          id: block-1
          metadata: {}
          sortingKey: "1"
          type: code
        - content: "# Title"
          id: block-2
          metadata: {}
          sortingKey: "2"
          type: markdown
      executionMode: block
      id: notebook-1
      isModule: false
      name: Main Notebook
  settings: {}
version: 1.0.0
`;

    const result = await transformDeepnoteYamlToNotebookContent(yamlString);

    expect(result.cells).toHaveLength(2);
    const cells = result.cells as ICell[];
    expect(cells[0]).toHaveProperty('cell_type', 'code');
    expect(cells[1]).toHaveProperty('cell_type', 'markdown');
    expect(result.metadata.deepnote.notebooks).toHaveProperty('Main Notebook');
    expect(result.nbformat).toBe(4);
    expect(result.nbformat_minor).toBe(0);
  });

  it('should include metadata for all notebooks', async () => {
    const yamlString = `
metadata:
  createdAt: 2025-04-30T14:02:50.919Z
  modifiedAt: 2025-09-05T11:05:19.666Z
project:
  id: test-project-id
  name: Test Project
  notebooks:
    - blocks:
        - content: x = 1
          id: block-1
          metadata: {}
          sortingKey: "1"
          type: code
      executionMode: block
      id: notebook-1
      isModule: false
      name: First Notebook
    - blocks:
        - content: "# Second"
          id: block-2
          metadata: {}
          sortingKey: "1"
          type: markdown
      executionMode: block
      id: notebook-2
      isModule: false
      name: Second Notebook
  settings: {}
version: 1.0.0
`;

    const result = await transformDeepnoteYamlToNotebookContent(yamlString);

    expect(result.metadata.deepnote.notebooks).toHaveProperty('First Notebook');
    expect(result.metadata.deepnote.notebooks).toHaveProperty(
      'Second Notebook'
    );
    const firstNotebook = result.metadata.deepnote.notebooks['First Notebook'];
    expect(firstNotebook).toBeDefined();
    expect(firstNotebook?.id).toBe('notebook-1');
    const secondNotebook =
      result.metadata.deepnote.notebooks['Second Notebook'];
    expect(secondNotebook).toBeDefined();
    expect(secondNotebook?.id).toBe('notebook-2');
  });

  it('should use the first notebook for primary cell content', async () => {
    const yamlString = `
metadata:
  createdAt: 2025-04-30T14:02:50.919Z
  modifiedAt: 2025-09-05T11:05:19.666Z
project:
  id: test-project-id
  name: Test Project
  notebooks:
    - blocks:
        - content: first_notebook_code
          id: block-1
          metadata: {}
          sortingKey: "1"
          type: code
      executionMode: block
      id: notebook-1
      isModule: false
      name: First
    - blocks:
        - content: second_notebook_code
          id: block-2
          metadata: {}
          sortingKey: "1"
          type: code
      executionMode: block
      id: notebook-2
      isModule: false
      name: Second
  settings: {}
version: 1.0.0
`;

    const result = await transformDeepnoteYamlToNotebookContent(yamlString);

    expect(result.cells).toHaveLength(1);
    const cells = result.cells as ICell[];
    expect(cells[0]).toHaveProperty('source', 'first_notebook_code');
  });

  it('should handle empty notebooks gracefully', async () => {
    const yamlString = `
metadata:
  createdAt: 2025-04-30T14:02:50.919Z
  modifiedAt: 2025-09-05T11:05:19.666Z
project:
  id: test-project-id
  name: Test Project
  notebooks:
    - blocks: []
      executionMode: block
      id: notebook-1
      isModule: false
      name: Empty Notebook
  settings: {}
version: 1.0.0
`;

    const result = await transformDeepnoteYamlToNotebookContent(yamlString);

    expect(result.cells).toHaveLength(0);
    expect(result.metadata.deepnote.notebooks).toHaveProperty('Empty Notebook');
  });

  it('should handle file with no notebooks', async () => {
    const yamlString = `
metadata:
  createdAt: 2025-04-30T14:02:50.919Z
  modifiedAt: 2025-09-05T11:05:19.666Z
project:
  id: test-project-id
  name: Test Project
  notebooks: []
  settings: {}
version: 1.0.0
`;

    const result = await transformDeepnoteYamlToNotebookContent(yamlString);

    expect(result.cells).toHaveLength(1);
    const cells = result.cells as ICell[];
    const firstCell = cells[0];
    expect(firstCell).toBeDefined();
    expect(firstCell?.cell_type).toBe('code');
    const source = firstCell?.source;
    expect(source).toBeDefined();
    expect(source).toContain('No notebooks found');
  });

  it('should include kernel metadata', async () => {
    const yamlString = `
metadata:
  createdAt: 2025-04-30T14:02:50.919Z
  modifiedAt: 2025-09-05T11:05:19.666Z
project:
  id: test-project-id
  name: Test Project
  notebooks:
    - blocks: []
      executionMode: block
      id: notebook-1
      isModule: false
      name: Test
  settings: {}
version: 1.0.0
`;

    const result = await transformDeepnoteYamlToNotebookContent(yamlString);

    expect(result.metadata).toHaveProperty('kernelspec');
    expect(result.metadata).toHaveProperty('language_info');
    expect(result.metadata.kernelspec).toHaveProperty('name', 'python3');
    expect(result.metadata.language_info).toHaveProperty('name', 'python');
  });

  it('should throw error when deserialization fails', async () => {
    const invalidYaml = 'this is not valid yaml: {{{';

    await expect(
      transformDeepnoteYamlToNotebookContent(invalidYaml)
    ).rejects.toThrow('Failed to transform Deepnote YAML to notebook content.');
  });

  it('should preserve notebook structure in metadata', async () => {
    const yamlString = `
metadata:
  createdAt: 2025-04-30T14:02:50.919Z
  modifiedAt: 2025-09-05T11:05:19.666Z
project:
  id: test-project-id
  name: Test Project
  notebooks:
    - blocks:
        - content: x = 1
          id: block-1
          metadata: {}
          executionCount: 5
          outputs:
            - output_type: stream
              text: output
          sortingKey: "1"
          type: code
      executionMode: block
      id: notebook-1
      isModule: false
      name: Test Notebook
  settings: {}
version: 1.0.0
`;

    const result = await transformDeepnoteYamlToNotebookContent(yamlString);

    const notebookMetadata =
      result.metadata.deepnote.notebooks['Test Notebook'];
    expect(notebookMetadata).toBeDefined();
    expect(notebookMetadata?.id).toBe('notebook-1');
    expect(notebookMetadata?.name).toBe('Test Notebook');
    expect(notebookMetadata?.cells).toHaveLength(1);
    const firstCell = notebookMetadata?.cells[0];
    expect(firstCell).toBeDefined();
    expect(firstCell?.cell_type).toBe('code');
  });

  it('should handle multiple blocks of different types', async () => {
    const yamlString = `
metadata:
  createdAt: 2025-04-30T14:02:50.919Z
  modifiedAt: 2025-09-05T11:05:19.666Z
project:
  id: test-project-id
  name: Test Project
  notebooks:
    - blocks:
        - content: import pandas
          id: block-1
          metadata: {}
          sortingKey: "1"
          type: code
        - content: "# Analysis"
          id: block-2
          metadata: {}
          sortingKey: "2"
          type: markdown
        - content: df.head()
          id: block-3
          metadata: {}
          sortingKey: "3"
          type: code
        - content: Results below
          id: block-4
          metadata: {}
          sortingKey: "4"
          type: markdown
      executionMode: block
      id: notebook-1
      isModule: false
      name: Mixed Content
  settings: {}
version: 1.0.0
`;

    const result = await transformDeepnoteYamlToNotebookContent(yamlString);

    expect(result.cells).toHaveLength(4);
    const cells = result.cells as ICell[];
    expect(cells[0]).toHaveProperty('cell_type', 'code');
    expect(cells[1]).toHaveProperty('cell_type', 'markdown');
    expect(cells[2]).toHaveProperty('cell_type', 'code');
    expect(cells[3]).toHaveProperty('cell_type', 'markdown');
  });
});
