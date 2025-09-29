import { parse } from 'yaml';

// Source:
// deepnote-internal
//
// Path:
// apps/webapp/server/modules/export-and-import-project/index.ts

// Commit SHA:
// 3ec11e794c6aca998ef88d894f18e4611586cc30

export function parseYaml(yamlContent: string): unknown {
  try {
    const parsed = parse(yamlContent);

    return parsed;
  } catch (e) {
    console.error('Failed to parse Deepnote file as YAML.', e);

    throw new Error('Failed to parse Deepnote file.');
  }
}
