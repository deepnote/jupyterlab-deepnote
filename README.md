![Deepnote dragon](deepnote_dragon.png)
<!---This is a placeholder for the Deepnote + jupyterlab logo-->

<div align="center">

[![CI](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/deepnote/jupyterlab-deepnote/graph/badge.svg?token=OV32VZNOJ2)](https://codecov.io/gh/deepnote/jupyterlab-deepnote)
[![PyPI](https://img.shields.io/pypi/v/jupyterlab-deepnote.svg)](https://pypi.org/project/jupyterlab-deepnote/)
[![Python Version](https://img.shields.io/pypi/pyversions/jupyterlab-deepnote.svg)](https://pypi.org/project/jupyterlab-deepnote/)
[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

**A JupyterLab extension for viewing Deepnote projects (`.deepnote` files) directly in JupyterLab**

[Installation](#installation) • [Features](#features) • [Usage](#usage) • [Contributing](#contributing) • [License](#license)

</div>

---

## Overview

`jupyterlab-deepnote` is a JupyterLab extension that enables you to open and view [Deepnote](https://deepnote.com) project files (`.deepnote` format) directly within JupyterLab. This extension provides a seamless read-only viewer for Deepnote notebooks, allowing you to explore Deepnote projects without leaving your JupyterLab environment.

### Key Features

- 📂 **Open Deepnote Files**: View `.deepnote` project files containing Deepnote notebooks in JupyterLab
- 📓 **Multi-Notebook Support**: Switch between multiple notebooks within a single `.deepnote` file
- 👁️ **Read-Only Mode**: View notebook content safely without modifying the original `.deepnote` file
- 🔄 **Seamless Integration**: Works natively with JupyterLab's notebook interface
- 🎨 **Deepnote Block Support**: Renders Deepnote-specific block types as Jupyter cells

## Installation

### Requirements

- **Python**: 3.9 or higher
- **JupyterLab**: 4.0.0 or higher

### Install via pip

Install the extension using pip:

```bash
pip install jupyterlab_deepnote
```

The extension will be automatically enabled after installation.

### Verify Installation

Check that the extension is properly installed and enabled:

```bash
# Check server extension
jupyter server extension list

# Check frontend extension
jupyter labextension list
```

You should see `jupyterlab_deepnote` listed in both outputs.

## Usage

### Opening Deepnote Files

1. **Launch JupyterLab**:
   ```bash
   jupyter lab
   ```

2. **Open a `.deepnote` file**:
   - Use the file browser to navigate to your `.deepnote` file
   - Double-click the file to open it in the notebook viewer

3. **Switch Between Notebooks** (if the `.deepnote` file contains multiple notebooks):
   - Use the notebook picker dropdown in the toolbar
   - Select the notebook you want to view

### Features in Detail

#### Read-Only Viewing
All content is displayed in read-only mode. You cannot:
- Edit cell content
- Execute cells
- Save changes back to the `.deepnote` file

This ensures the integrity of your original Deepnote project files.

#### Supported Content
The extension converts Deepnote blocks to Jupyter cells, supporting:
- Code cells (Python and other languages)
- Markdown cells
- Cell outputs and visualizations

## Architecture

This extension consists of two main components:

- **Server Extension**: Handles `.deepnote` file parsing and conversion to Jupyter notebook format
- **Frontend Extension**: Provides the JupyterLab UI integration and notebook picker widget

The extension uses a custom content provider to intercept `.deepnote` file requests and transform them into Jupyter-compatible notebook content.

## Troubleshooting

### Extension Not Loading

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

### Common Issues

- **`.deepnote` files not opening**: Ensure the file extension is exactly `.deepnote`
- **Missing notebooks**: Verify the `.deepnote` file contains valid YAML-formatted Deepnote project data
- **Extension conflicts**: Try disabling other notebook-related extensions temporarily

### Getting Help

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

## Development

For development setup, testing, and contributing guidelines, please see [CONTRIBUTING.md](CONTRIBUTING.md).

### Quick Start for Contributors

```bash
# Clone the repository
git clone https://github.com/deepnote/jupyterlab-deepnote.git
cd jupyterlab-deepnote

# Install in development mode
pip install -e ".[test]"
jupyter labextension develop . --overwrite

# Watch for changes
jlpm watch
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for:
- Development setup instructions
- Code style and testing requirements
- Pull request process
- Release workflow

## License

This project is licensed under the BSD 3-Clause License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the [JupyterLab Extension Template](https://github.com/jupyterlab/extension-template)
- Developed by [Deepnote](https://deepnote.com)

## Related Projects

- [Deepnote](https://deepnote.com) - Collaborative data science notebook
- [JupyterLab](https://jupyterlab.readthedocs.io/) - Extensible environment for interactive computing

---

<div align="center">

**[⬆ Back to Top](#jupyterlab-deepnote-extension)**

Made with ❤️ by the Deepnote team

</div>
