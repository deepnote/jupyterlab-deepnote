<div align="center">

![Deepnote cover image](./assets/deepnote-cover-image.png)

[![CI](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/deepnote/jupyterlab-deepnote/graph/badge.svg?token=OV32VZNOJ2)](https://codecov.io/gh/deepnote/jupyterlab-deepnote)
[![PyPI](https://img.shields.io/pypi/v/jupyterlab-deepnote.svg)](https://pypi.org/project/jupyterlab-deepnote/)
[![Python Version](https://img.shields.io/pypi/pyversions/jupyterlab-deepnote.svg)](https://pypi.org/project/jupyterlab-deepnote/)

[Website](https://deepnote.com/?utm_source=github&utm_medium=github&utm_campaign=github&utm_content=readme_main) • [Docs](https://deepnote.com/docs?utm_source=github&utm_medium=github&utm_campaign=github&utm_content=readme_main) • [Changelog](https://deepnote.com/changelog?utm_source=github&utm_medium=github&utm_campaign=github&utm_content=readme_main) • [X](https://x.com/DeepnoteHQ) • [Examples](https://deepnote.com/explore?utm_source=github&utm_medium=github&utm_campaign=github&utm_content=readme_main) • [Community](https://github.com/deepnote/deepnote/discussions)

</div>

# Deepnote extension for JupyterLab

`jupyterlab-deepnote` is a JupyterLab extension that enables you to open and view [Deepnote](https://deepnote.com) project files (`.deepnote` format) directly within JupyterLab. This extension provides a seamless read-only viewer for Deepnote notebooks, allowing you to explore Deepnote projects without leaving your JupyterLab environment.

## Key features

- **Open Deepnote files**: View `.deepnote` project files containing Deepnote notebooks in JupyterLab
- **Multi-notebook support**: Switch between multiple notebooks within a single `.deepnote` file
- **Read-only mode**: View notebook content safely without modifying the original `.deepnote` file
- **Seamless integration**: Works natively with JupyterLab's notebook interface
- **Deepnote block support**: Renders Deepnote-specific block types as Jupyter cells

## Installation

### Requirements

- **Python**: 3.10 or higher
- **JupyterLab**: 4.4.0 or higher

### Install via pip

Install the extension using pip, see our [PyPI page](https://pypi.org/project/jupyterlab-deepnote/):

```bash
pip install jupyterlab-deepnote
```

The extension will be automatically enabled after installation.

### Verify installation

Check that the extension is properly installed and enabled:

```bash
# Check server extension
jupyter server extension list

# Check frontend extension
jupyter labextension list
```

You should see `jupyterlab_deepnote` listed in both outputs.

## Opening Deepnote files

1. **Launch JupyterLab**:

   ```bash
   jupyter lab
   ```

2. **Open a `.deepnote` file**:
   - Use the file browser to navigate to your `.deepnote` file
   - Double-click the file to open it in the notebook viewer

3. **Switch between notebooks** (if the `.deepnote` file contains multiple notebooks):
   - Use the notebook picker dropdown in the toolbar
   - Select the notebook you want to view

## Architecture

This extension consists of two main components:

- **Server extension**: Handles `.deepnote` file parsing and conversion to Jupyter notebook format. Not all the blocks are supported; visit [docs](https://deepnote.com/docs?utm_source=github&utm_medium=github&utm_campaign=github&utm_content=readme_main) to learn more
- **Frontend extension**: Provides the JupyterLab UI integration and notebook picker widget

The extension uses a custom content provider to intercept `.deepnote` file requests and transform them into Jupyter-compatible notebook content.

## Troubleshooting

### Extension not loading

If the extension doesn't appear to be working:

1. **Verify installation**:

   ```bash
   jupyter server extension list
   jupyter labextension list
   ```

2. **Rebuild JupyterLab** (if installed from source):

   ```bash
   jupyter lab build
   ```

3. **Check for errors**:

   ```bash
   jupyter lab --debug
   ```

### Common issues

- **`.deepnote` files not opening**: Ensure the file extension is exactly `.deepnote`
- **Missing notebooks**: Verify the `.deepnote` file contains valid YAML-formatted Deepnote project data
- **Extension conflicts**: Try disabling other notebook-related extensions temporarily

### Getting help

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/deepnote/jupyterlab-deepnote/issues) for similar problems
2. Review the [CONTRIBUTING.md](CONTRIBUTING.md) for development setup
3. Open a new issue with detailed information about your environment and the problem

## Uninstall

To remove the extension:

```bash
pip uninstall jupyterlab_deepnote
```

After uninstalling, restart JupyterLab for the changes to take effect.

## Compatibility

### JupyterLab version support

This extension is compatible with **JupyterLab 4.4.0 or higher**. It requires the content provider registry API introduced in JupyterLab 4.4.

**Upper bound:** The extension sets an upper bound of `< 5.0.0` to prevent automatic installation with potentially incompatible future major versions of JupyterLab.

### Maintenance policy

Following [JupyterLab's extension development guidelines](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html#overview-of-extensions), we adhere to semantic versioning principles:

- **Major releases** (e.g., 1.0.0 → 2.0.0): May introduce breaking changes and require user action
- **Minor releases** (e.g., 1.0.0 → 1.1.0): Add new features while maintaining backwards compatibility
- **Patch releases** (e.g., 1.0.0 → 1.0.1): Bug fixes and minor improvements only

When JupyterLab 5.x is released, we will:

1. Evaluate the changes and update the extension as needed
2. Release a new major or minor version with explicit JupyterLab 5.x support
3. Clearly document any breaking changes in the changelog

### Backwards compatibility

This extension follows semantic versioning for its own API:

- **Current version (0.x.x)**: Pre-release phase. APIs may change without prior notice.
- **Version 1.0.0 onwards**: We will maintain backwards compatibility within major versions and clearly document breaking changes between major versions.

Note: This extension does **not** support JupyterLab 3.x or earlier versions.

## Need help?

- Join our Community!
- Open an issue for bug reports or feature requests
- Check out source code of related repositories: [Deepnote Open Source](https://github.com/deepnote/deepnote), [JupyterLab extension](https://github.com/deepnote/jupyterlab-deepnote) and [Deepnote Toolkit](https://github.com/deepnote/deepnote-toolkit).
- Check out our [documentation](https://deepnote.com/docs?utm_source=github&utm_medium=github&utm_campaign=github&utm_content=readme_main)
- Want a low-code experience? Visit [Deepnote Cloud](https://deepnote.com/?utm_source=github&utm_medium=github&utm_campaign=github&utm_content=readme_main) together with Deepnote AI agent

## Contributing

For development setup, testing, and contributing guidelines, please see [CONTRIBUTING.md](CONTRIBUTING.md).

---

<div align="center">
Built with 💙
</div>
