// Copyright (c) Deepnote
// Distributed under the terms of the Modified BSD License.

import { convertDeepnoteBlockTypeToJupyter } from '../convert-deepnote-block-type-to-jupyter';

describe('convertDeepnoteBlockTypeToJupyter', () => {
  describe('code block types', () => {
    it('should convert "code" to "code"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('code')).toBe('code');
    });

    it('should convert "sql" to "code"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('sql')).toBe('code');
    });

    it('should convert "notebook-function" to "code"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('notebook-function')).toBe(
        'code'
      );
    });

    it('should convert "big-number" to "code"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('big-number')).toBe('code');
    });

    it('should convert "visualization" to "code"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('visualization')).toBe('code');
    });

    describe('input block types', () => {
      it('should convert "input-text" to "code"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('input-text')).toBe('code');
      });

      it('should convert "input-checkbox" to "code"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('input-checkbox')).toBe(
          'code'
        );
      });

      it('should convert "input-textarea" to "code"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('input-textarea')).toBe(
          'code'
        );
      });

      it('should convert "input-file" to "code"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('input-file')).toBe('code');
      });

      it('should convert "input-select" to "code"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('input-select')).toBe('code');
      });

      it('should convert "input-date-range" to "code"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('input-date-range')).toBe(
          'code'
        );
      });

      it('should convert "input-date" to "code"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('input-date')).toBe('code');
      });

      it('should convert "input-slider" to "code"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('input-slider')).toBe('code');
      });
    });
  });

  describe('markdown block types', () => {
    it('should convert "markdown" to "markdown"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('markdown')).toBe('markdown');
    });

    it('should convert "image" to "markdown"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('image')).toBe('markdown');
    });

    it('should convert "button" to "markdown"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('button')).toBe('markdown');
    });

    it('should convert "separator" to "markdown"', () => {
      expect(convertDeepnoteBlockTypeToJupyter('separator')).toBe('markdown');
    });

    describe('text cell types', () => {
      it('should convert "text-cell-h1" to "markdown"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('text-cell-h1')).toBe(
          'markdown'
        );
      });

      it('should convert "text-cell-h2" to "markdown"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('text-cell-h2')).toBe(
          'markdown'
        );
      });

      it('should convert "text-cell-h3" to "markdown"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('text-cell-h3')).toBe(
          'markdown'
        );
      });

      it('should convert "text-cell-p" to "markdown"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('text-cell-p')).toBe(
          'markdown'
        );
      });

      it('should convert "text-cell-bullet" to "markdown"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('text-cell-bullet')).toBe(
          'markdown'
        );
      });

      it('should convert "text-cell-todo" to "markdown"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('text-cell-todo')).toBe(
          'markdown'
        );
      });

      it('should convert "text-cell-callout" to "markdown"', () => {
        expect(convertDeepnoteBlockTypeToJupyter('text-cell-callout')).toBe(
          'markdown'
        );
      });
    });
  });

  describe('unknown block types', () => {
    it('should convert unknown types to "markdown" (default)', () => {
      expect(convertDeepnoteBlockTypeToJupyter('unknown-type')).toBe(
        'markdown'
      );
    });

    it('should convert empty string to "markdown" (default)', () => {
      expect(convertDeepnoteBlockTypeToJupyter('')).toBe('markdown');
    });
  });
});
