// Copyright (c) Deepnote
// Distributed under the terms of the Modified BSD License.

import { NotebookPicker } from "../../src/components/NotebookPicker";
import { framePromise } from "@jupyterlab/testing";
import { NotebookPanel } from "@jupyterlab/notebook";
import { INotebookModel } from "@jupyterlab/notebook";
import { Widget } from "@lumino/widgets";
import { simulate } from "simulate-event";

describe("NotebookPicker", () => {
	let panel: NotebookPanel;
	let model: INotebookModel;

	beforeEach(async () => {
		// Mock model + metadata
		model = {
			fromJSON: jest.fn(),
			get cells() {
				return [];
			},
			dirty: true,
		} as any;

		panel = {
			context: {
				ready: Promise.resolve(),
				model: {
					getMetadata: jest.fn().mockReturnValue({
						notebooks: {
							nb1: { id: "nb1", name: "nb1", cells: [{ source: "code" }] },
							nb2: { id: "nb2", name: "nb2", cells: [] },
						},
						notebook_names: ["nb1", "nb2"],
					}),
				},
			},
			model,
		} as any;

		// Attach to DOM
		const widget = new NotebookPicker(panel);
		// Override onAfterAttach to avoid errors from this.parent being null
		(widget as any).onAfterAttach = jest.fn();
		Widget.attach(widget, document.body);
		await framePromise();
	});

	afterEach(() => {
		document.body.innerHTML = "";
		jest.restoreAllMocks();
	});

	it("should render a select element", async () => {
		await framePromise(); // wait for rendering
		const select = document.querySelector("select") as HTMLSelectElement;
		expect(select).not.toBeNull();
		expect(select.options.length).toBe(2);
		expect(select.options[0] && select.options[0].value).toBe("nb1");
	});

	it("should call fromJSON when selecting a notebook", async () => {
		const select = document.querySelector("select") as HTMLSelectElement;
		simulate(select, "change", { target: { value: "nb2" } });
		await framePromise();
		expect(model.fromJSON).toHaveBeenCalledWith(
			expect.objectContaining({
				cells: expect.any(Array),
				metadata: expect.objectContaining({
					deepnote: expect.objectContaining({
						notebooks: expect.any(Object),
					}),
				}),
			}),
		);
	});

	it("should not call fromJSON if selected notebook is invalid", async () => {
		const getMetadata = panel.context.model.getMetadata as jest.Mock;
		getMetadata.mockReturnValue({ notebooks: {}, notebook_names: [] });

		const select = document.querySelector("select") as HTMLSelectElement;
		simulate(select, "change", { target: { value: "nonexistent" } });
		await framePromise();
		expect(model.fromJSON).not.toHaveBeenCalled();
	});

	it("should update UI after selection", async () => {
		const select = document.querySelector("select") as HTMLSelectElement;
		select.value = "nb2";
		simulate(select, "change");
		await framePromise();
		expect(select.value).toBe("nb2");
	});

	it("should handle empty metadata gracefully", async () => {
		const getMetadata = panel.context.model.getMetadata as jest.Mock;
		getMetadata.mockReturnValue({ notebooks: {}, notebook_names: [] });

		document.body.innerHTML = "";
		const widget = new NotebookPicker(panel);
		// Override onAfterAttach to avoid errors from this.parent being null
		(widget as any).onAfterAttach = jest.fn();
		Widget.attach(widget, document.body);
		await framePromise();

		const select = document.querySelector("select") as HTMLSelectElement;
		expect(select.options.length).toBeGreaterThanOrEqual(1);
		expect(select.options[0] && select.options[0].value).toBe("-");
	});

	it("should handle null model in handleChange", async () => {
		const nullModelPanel = {
			context: {
				ready: Promise.resolve(),
				model: {
					getMetadata: jest.fn().mockReturnValue({
						notebooks: {
							nb1: { id: "nb1", name: "nb1", cells: [] },
						},
						notebook_names: ["nb1"],
					}),
				},
			},
			model: null,
		} as any;

		document.body.innerHTML = "";
		const widget = new NotebookPicker(nullModelPanel);
		(widget as any).onAfterAttach = jest.fn();
		Widget.attach(widget, document.body);
		await framePromise();

		const select = document.querySelector("select") as HTMLSelectElement;
		simulate(select, "change", { target: { value: "nb1" } });
		await framePromise();
	});

	it("should handle invalid metadata in handleChange", async () => {
		const consoleErrorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const getMetadata = panel.context.model.getMetadata as jest.Mock;
		getMetadata.mockReturnValue({ invalid: "metadata" });

		const select = document.querySelector("select") as HTMLSelectElement;
		simulate(select, "change", { target: { value: "nb1" } });
		await framePromise();

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Invalid deepnote metadata:",
			expect.anything(),
		);
		expect(model.fromJSON).not.toHaveBeenCalled();

		consoleErrorSpy.mockRestore();
	});
});
