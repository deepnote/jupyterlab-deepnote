// Copyright (c) Deepnote
// Distributed under the terms of the Modified BSD License.

import type { DeepnoteBlock } from "@deepnote/blocks";
import { convertDeepnoteBlockToJupyterCell } from "../convert-deepnote-block-to-jupyter-cell";

describe("convertDeepnoteBlockToJupyterCell", () => {
	describe("code cells", () => {
		it("should convert a basic code block to a Jupyter code cell", () => {
			const block: DeepnoteBlock = {
				id: "block-1",
				type: "code",
				content: 'print("hello")',
				metadata: { foo: "bar" },
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("code");
			expect(result.metadata).toEqual({ foo: "bar", cell_id: "block-1" });
			expect(result.source).toBe('print("hello")');
			expect(result.execution_count).toBeNull();
			expect(result.outputs).toEqual([]);
		});

		it("should include execution count if present", () => {
			const block: DeepnoteBlock = {
				id: "block-2",
				type: "code",
				content: "x = 1",
				metadata: {},
				executionCount: 5,
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("code");
			expect(result.execution_count).toBe(5);
		});

		it("should include outputs if present", () => {
			const blockOutputs = [
				{
					output_type: "stream",
					name: "stdout",
					text: "hello\n",
				},
			];

			const block: DeepnoteBlock = {
				id: "block-3",
				type: "code",
				content: 'print("hello")',
				metadata: {},
				outputs: blockOutputs,
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("code");
			expect(result.outputs).toEqual(blockOutputs);
		});

		it("should remove truncated property from outputs", () => {
			const blockOutputs = [
				{
					output_type: "stream",
					name: "stdout",
					text: "hello\n",
					truncated: true,
				},
			];

			const block: DeepnoteBlock = {
				id: "block-4",
				type: "code",
				content: 'print("hello")',
				metadata: {},
				outputs: blockOutputs,
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("code");
			expect(result.outputs).toHaveLength(1);
			const resultOutputs = result.outputs as Array<{
				output_type: string;
				name: string;
				text: string;
			}>;
			expect(resultOutputs[0]).not.toHaveProperty("truncated");
			expect(resultOutputs[0]).toEqual({
				output_type: "stream",
				name: "stdout",
				text: "hello\n",
			});
		});

		it("should handle multiple outputs with truncated properties", () => {
			const blockOutputs = [
				{
					output_type: "stream",
					name: "stdout",
					text: "line1\n",
					truncated: true,
				},
				{
					output_type: "stream",
					name: "stdout",
					text: "line2\n",
					truncated: false,
				},
			];

			const block: DeepnoteBlock = {
				id: "block-5",
				type: "code",
				content: 'print("test")',
				metadata: {},
				outputs: blockOutputs,
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("code");
			expect(result.outputs).toHaveLength(2);
			const resultOutputs = result.outputs as Array<{
				output_type: string;
				name: string;
				text: string;
			}>;
			expect(resultOutputs[0]).not.toHaveProperty("truncated");
			expect(resultOutputs[1]).not.toHaveProperty("truncated");
		});

		it("should not mutate the original block", () => {
			const blockOutputs = [
				{
					output_type: "stream",
					name: "stdout",
					text: "hello\n",
					truncated: true,
				},
			];

			const block: DeepnoteBlock = {
				id: "block-6",
				type: "code",
				content: 'print("hello")',
				metadata: { test: "value" },
				outputs: blockOutputs,
				sortingKey: "1",
			};

			convertDeepnoteBlockToJupyterCell(block);

			expect(block.outputs?.[0]).toHaveProperty("truncated");
			expect(block.metadata).toEqual({ test: "value" });
		});
	});

	describe("markdown cells", () => {
		it("should convert a basic markdown block to a Jupyter markdown cell", () => {
			const block: DeepnoteBlock = {
				id: "block-7",
				type: "markdown",
				content: "# Hello",
				metadata: { foo: "bar" },
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("markdown");
			expect(result.metadata).toEqual({});
			expect(result.source).toBe("# Hello");
		});

		it("should convert text-cell-h1 to markdown cell", () => {
			const block: DeepnoteBlock = {
				id: "block-8",
				type: "text-cell-h1",
				content: "Heading 1",
				metadata: {},
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("markdown");
		});

		it("should convert image block to markdown cell", () => {
			const block: DeepnoteBlock = {
				id: "block-9",
				type: "image",
				content: "![alt](url)",
				metadata: {},
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("markdown");
		});

		it("should not include metadata from Deepnote block in markdown cells", () => {
			const block: DeepnoteBlock = {
				id: "block-10",
				type: "markdown",
				content: "Text",
				metadata: { deepnoteMetadata: "should not appear" },
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("markdown");
			expect(result.metadata).toEqual({});
		});
	});

	describe("special block types", () => {
		it("should convert sql block to code cell", () => {
			const block: DeepnoteBlock = {
				id: "block-11",
				type: "sql",
				content: "SELECT * FROM table",
				metadata: {},
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("code");
		});

		it("should convert visualization block to code cell", () => {
			const block: DeepnoteBlock = {
				id: "block-12",
				type: "visualization",
				content: "chart_data",
				metadata: {},
				sortingKey: "1",
			};

			const result = convertDeepnoteBlockToJupyterCell(block);

			expect(result.cell_type).toBe("code");
		});
	});
});
