import { DeepnoteFile, deepnoteFileSchema } from './deepnote-file-schema';
import { parseYaml } from './parse-yaml';

// Source:
// deepnote-internal
//
// Path:
// apps/webapp/server/modules/export-and-import-project/index.ts

// Commit SHA:
// 3ec11e794c6aca998ef88d894f18e4611586cc30

/**
 * Deserialize a YAML string into a DeepnoteFile object.
 */
export function deserializeDeepnoteFile(yamlContent: string): DeepnoteFile {
  const parsed = parseYaml(yamlContent);
  const result = deepnoteFileSchema.safeParse(parsed);

  if (!result.success) {
    const issue = result.error.issues[0];

    if (!issue) {
      console.error('Invalid Deepnote file with no issues.');

      throw new Error('Invalid Deepnote file.');
    }

    const path = issue.path.join('.');
    const message = path ? `${path}: ${issue.message}` : issue.message;

    console.error(`Failed to parse the Deepnote file: ${message}.`);

    throw new Error(`Failed to parse the Deepnote file: ${message}.`);
  }

  return result.data;
}
