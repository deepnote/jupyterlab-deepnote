# jupyterlab_deepnote

[![CI](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/deepnote/jupyterlab-deepnote/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/deepnote/jupyterlab-deepnote/graph/badge.svg?token=OV32VZNOJ2)](https://codecov.io/gh/deepnote/jupyterlab-deepnote)

A Deepnote extension for JupyterLab

This extension is composed of a Python package named `jupyterlab_deepnote`
for the server extension and a NPM package named `jupyterlab-deepnote`
for the frontend extension.

## Requirements

- JupyterLab >= 4.0.0

## Install

To install the extension:

```bash
pip install jupyterlab_deepnote
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyterlab_deepnote
```

## Troubleshoot

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled:

```bash
jupyter server extension list
```

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed:

```bash
jupyter labextension list
```
