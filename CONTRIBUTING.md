# Contributing to `jupyterlab-deepnote`

Thank you for your interest in contributing to the Deepnote JupyterLab extension! This guide will help you set up your development environment and understand the contribution workflow.

This document is intended for contributors and maintainers working on the extension's source code. For general usage and installation instructions, please refer to the README.

## Prerequisites

Before you begin, ensure you have the following installed:

1. [Python](https://www.python.org/) 3.10 or later - Required for the server extension
2. [Node.js](https://nodejs.org/) v22 or later - Required for building the frontend extension
3. [JupyterLab](https://jupyterlab.readthedocs.io/) >= 4.4.0 - The extension requires JupyterLab 4.x
4. **GitHub Account** - With access to create [Personal Access Tokens](https://github.com/settings/tokens)

## Development install

Note: You will need NodeJS to build the extension package.

Use any Python environment and dependency manager you like, for example [uv](https://docs.astral.sh/uv/getting-started/installation/):

```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Create a Python environment in the project directory:

```shell
uv venv --python 3.12 --managed-python
```

Activate the Python environment:

```shell
source .venv/bin/activate
```

Install `jupyterlab`. The extension package itself doesn’t depend on `jupyterlab`, you just need `jupyterlab` in the environment where you will be testing the extension.

```shell
uv pip install jupyterlab
```

### Configure Access to @deepnote/blocks Package

The `@deepnote/blocks` package is published on GitHub Packages. To install it, you'll need to authenticate with GitHub:

1. Create a GitHub Personal Access Token (classic) with `read:packages` scope:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select the `read:packages` scope
   - Generate and copy the token

2. Set the `GITHUB_TOKEN` environment variable to ensure `jlpm` (which is a wrapper around Yarn) can download the `@deepnote/blocks` package from the GitHub package registry. You can export the variable in `.zshrc` (or by reading a `~/.env` file):
   ```shell
   export GITHUB_TOKEN=your_token_here
   ```
   Replace `YOUR_TOKEN_HERE` with your actual token.

Install the extension package in editable mode. It installs the package’s dependencies, too:

```shell
uv pip install --editable . --verbose
```

Link your development version of the extension with JupyterLab:

```shell
jupyter labextension develop . --overwrite
```

Enable the extension in Jupyter Server:

```shell
jupyter server extension enable jupyterlab_deepnote
```

Rebuild the extension’s Typescript source after making changes:

```shell
jlpm run watch
```

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` instead of `jlpm` below.

In a separate terminal, run `jupyter lab`. You can add the `--debug` option to see HTTP requests in the logs, which can be helpful for debugging.

```shell
jupyter lab --debug
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

## Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable jupyterlab_deepnote
pip uninstall jupyterlab_deepnote
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab-deepnote` within that folder.

## Testing the extension

### Server tests

This extension is using [Pytest](https://docs.pytest.org/) for Python code testing.

Install test dependencies (needed only once):

```sh
pip install -e ".[test]"
# Each time you install the Python package, you need to restore the front-end extension link
jupyter labextension develop . --overwrite
```

To execute them, run:

```sh
pytest -vv -r ap --cov jupyterlab_deepnote
```

### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

## Versioning and compatibility

We follow [Semantic Versioning (semver)](https://semver.org/).

The extension requires **JupyterLab 4.4.0 or higher** (but not JupyterLab 5.x) due to its dependency on the content provider registry API. All JupyterLab dependencies include upper bounds to prevent automatic installation with incompatible future major versions.

**Current `pyproject.toml` build requirement:**

```toml
[build-system]
requires = ["hatchling>=1.5.0", "jupyterlab>=4.4.0,<5", "hatch-nodejs-version>=0.3.2"]
```

**Current `package.json` dependencies with upper bounds:**

```json
  "dependencies": {
    "@jupyterlab/application": "^4.4.0 <5",
    "@jupyterlab/notebook": "^4.4.7 <5",
    "@jupyterlab/services": "^7.0.0 <8",
    "@jupyterlab/coreutils": "^6.0.0 <7",
    ...
  }
```

These upper bounds help prevent breaking changes from affecting users and align with JupyterLab's [extension development best practices](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html#overview-of-extensions).

## Sync with the JupyterLab extension template

This project was bootstrapped using the [JupyterLab extension template](https://github.com/jupyterlab/extension-template). To keep your project up to date with improvements and best practices from the template, run:

```sh
copier update --trust
```

This will apply the latest template changes interactively. Review and commit any updates as appropriate.

## Making Changes

### Code Style

- **Python:** Follow PEP 8 guidelines
- **TypeScript:** The project uses ESLint and Prettier (configured in the project)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write clear, descriptive commit messages
5. Run tests to ensure everything passes
6. Commit your changes
7. Push to your fork
8. Open a Pull Request with a clear description

## Release workflow

See [RELEASE](RELEASE.md) for details on the release process. We recommend using [Jupyter Releaser](https://github.com/jupyter-server/jupyter_releaser) and [PyPI trusted publishing](https://docs.pypi.org/trusted-publishers/) for secure and automated releases.

## Additional Resources

- [JupyterLab Extension Developer Guide](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html)
- [JupyterLab Extension Tutorial](https://jupyterlab.readthedocs.io/en/stable/extension/extension_tutorial.html)
- [Project Issues](https://github.com/deepnote/jupyterlab-deepnote/issues)

## Questions?

If you have questions or run into issues:

1. Search existing [GitHub Issues](https://github.com/deepnote/jupyterlab-deepnote/issues)
2. Open a new issue with details about your problem

Thank you for contributing! 🎉
