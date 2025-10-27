# jupyterlab_deepnote

[![CI](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/deepnote/jupyterlab-deepnote/graph/badge.svg?token=OV32VZNOJ2)](https://codecov.io/gh/deepnote/jupyterlab-deepnote)

Read‑only viewer for Deepnote `.deepnote` files inside JupyterLab.

## Requirements

- Python 3.9 or higher
- JupyterLab >= 4.4.0, < 5.0.0

## Install

Install the extension using pip:

```bash
pip install jupyterlab_deepnote
```

## Usage

After installation you can:

- Open Deepnote files (`.deepnote`) containing Deepnote projects in JupyterLab
- Switch between notebooks inside a `.deepnote` file
- View content in **read‑only** mode (no editing or saving back to the `.deepnote` file)

## Troubleshooting

If you encounter issues with the extension, verify that both the server and frontend extensions are properly installed and enabled.

Check server extensions:

```bash
jupyter server extension list
```

Check frontend extensions:

```bash
jupyter labextension list
```

## Uninstall

To remove the extension, run:

```bash
pip uninstall jupyterlab_deepnote
```

## Compatibility

### JupyterLab Version Support

This extension is compatible with **JupyterLab 4.4.0 or higher**. It requires the content provider registry API introduced in JupyterLab 4.4.

**Upper bound:** The extension sets an upper bound of `< 5.0.0` to prevent automatic installation with potentially incompatible future major versions of JupyterLab.

### Maintenance Policy

Following [JupyterLab's extension development guidelines](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html#overview-of-extensions), we adhere to semantic versioning principles:

- **Major releases** (e.g., 1.0.0 → 2.0.0): May introduce breaking changes and require user action
- **Minor releases** (e.g., 1.0.0 → 1.1.0): Add new features while maintaining backwards compatibility
- **Patch releases** (e.g., 1.0.0 → 1.0.1): Bug fixes and minor improvements only

When JupyterLab 5.x is released, we will:

1. Evaluate the changes and update the extension as needed
2. Release a new major or minor version with explicit JupyterLab 5.x support
3. Clearly document any breaking changes in the changelog

### Backwards Compatibility

This extension follows semantic versioning for its own API:

- **Current version (0.x.x)**: Pre-release phase. APIs may change without prior notice.
- **Version 1.0.0 onwards**: We will maintain backwards compatibility within major versions and clearly document breaking changes between major versions.

Note: This extension does **not** support JupyterLab 3.x or earlier versions.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.
