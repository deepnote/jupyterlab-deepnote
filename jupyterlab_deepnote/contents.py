# deepnote_jupyter_extension/contents.py
from jupyter_server.services.contents.filemanager import FileContentsManager
from typing import cast

from nbformat.v4 import new_notebook


class DeepnoteContentsManager(FileContentsManager):
    def get(self, path, content=True, type=None, format=None, require_hash=False):
        if path.endswith(".deepnote") and (content == 1):
            os_path = self._get_os_path(path)

            # _read_file may return 2- or 3-tuple depending on raw flag in implementation hints
            _content, _fmt, *_ = self._read_file(os_path, "text")  # type: ignore[misc]
            # Coerce to str for converter
            if isinstance(_content, bytes):
                yaml_text = _content.decode("utf-8", errors="replace")
            else:
                yaml_text = cast(str, _content)

            model = self._base_model(path)
            model["type"] = "notebook"
            model["format"] = "json"
            model["content"] = new_notebook(
                cells=[], metadata={"deepnote": {"rawYamlString": yaml_text}}
            )
            model["writable"] = False

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
