# deepnote_jupyter_extension/contents.py
from jupyter_server.services.contents.filemanager import FileContentsManager
from typing import cast
import nbformat

import yaml
from nbformat.v4 import new_notebook, new_code_cell, new_markdown_cell


def yaml_to_ipynb(yaml_text: str):
    """Convert Deepnote YAML into a minimal Jupyter nbformat v4 notebook."""
    try:
        data = yaml.safe_load(yaml_text)
    except Exception:
        return new_notebook(cells=[])

    notebooks = (
        data.get("project", {}).get("notebooks", []) if isinstance(data, dict) else []
    )
    if not notebooks:
        return new_notebook(cells=[])

    nb0 = notebooks[0]
    blocks = nb0.get("blocks", [])
    cells = []

    for block in sorted(blocks, key=lambda b: b.get("sortingKey", "")):
        btype = block.get("type", "code")
        content = block.get("content", "")

        if btype == "code":
            cells.append(new_code_cell(content))
        else:
            cells.append(new_markdown_cell(content))

    return new_notebook(cells=cells, metadata={})


def yaml_to_ipynb_dummy(yaml_text: str) -> dict:
    return {"nbformat": 4, "nbformat_minor": 5, "metadata": {}, "cells": []}


class DeepnoteContentsManager(FileContentsManager):
    def get(self, path, content=True, type=None, format=None, require_hash=False):
        if path.endswith(".deepnote") and (content == 1):
            self.log.info(
                "\n\n\n🌴🌴🌴 path %s, content: %s, type: %s", path, content, type
            )
            os_path = self._get_os_path(path)

            # _read_file may return 2- or 3-tuple depending on raw flag in implementation hints
            _content, _fmt, *_ = self._read_file(os_path, "text")  # type: ignore[misc]
            # Coerce to str for converter
            if isinstance(_content, bytes):
                yaml_text = _content.decode("utf-8", errors="replace")
            else:
                yaml_text = cast(str, _content)

            nb_dict = yaml_to_ipynb(yaml_text)
            nb_node = nbformat.from_dict(nb_dict)

            model = self._base_model(path)
            model["type"] = "notebook"
            model["format"] = "json"
            model["content"] = nb_node
            self.mark_trusted_cells(nb_node, path)
            self.validate_notebook_model(model, validation_error={})

            if require_hash:
                # Accept 2- or 3-tuple; we only need the bytes
                bytes_content, *_ = self._read_file(os_path, "byte")  # type: ignore[misc]
                if isinstance(bytes_content, str):
                    bytes_content = bytes_content.encode("utf-8", errors="replace")
                model.update(**self._get_hash(bytes_content))  # type: ignore[arg-type]

            return model

        return super().get(
            path, content=content, type=type, format=format, require_hash=require_hash
        )
