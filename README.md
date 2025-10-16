# jupyterlab_deepnote

[![CI](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/deepnote/jupyterlab-deepnote/graph/badge.svg?token=OV32VZNOJ2)](https://codecov.io/gh/deepnote/jupyterlab-deepnote)

Read‑only viewer for Deepnote `.deepnote` files inside JupyterLab.

## Requirements

- Python 3.7 or higher
- JupyterLab 4.0.0 or higher

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

## Compatibility and Maintenance

This extension is maintained to be compatible with JupyterLab versions 4.x. It is recommended to keep your JupyterLab installation updated within this major version to ensure full compatibility.

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

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.
