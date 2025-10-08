# jupyterlab_deepnote

A Deepnote extension for JupyterLab

This extension is composed of a Python package named `jupyterlab_deepnote`
for the server extension and a NPM package named `jupyterlab-deepnote`
for the frontend extension.

## Requirements

- JupyterLab >= 4.0.0

## Install

To install the extension, execute:

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

## Contributing

### Development install

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

**Configure Access to @deepnote/blocks Package**

The `@deepnote/blocks` package is published on GitHub Packages. To install it, you'll need to authenticate with GitHub:

1. Create a GitHub Personal Access Token (classic) with `read:packages` scope:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select the `read:packages` scope
   - Generate and copy the token

2. Set the `GITHUB_TOKEN` environment variable to ensure `jlpm` (which is a wrapper around Yarn) can download the `@deepnote/blocks` package from the GitHub package registry. You can set the variable in `.zshrc` or manually like:
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
`yarn` or `npm` in lieu of `jlpm` below.

In a separate terminal, run `jupyter lab` with the `--config` option to register our custom file contents manager for the `.deepnote` extension. The `--debug` option lets you see HTTP requests in the logs, which is helpful for debugging.

```shell
jupyter lab --debug --config="$(pwd)/jupyter-config/server-config/jupyter_server_config.json"
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

### Development uninstall

```bash
# Server extension must be manually disabled in develop mode
jupyter server extension disable jupyterlab_deepnote
pip uninstall jupyterlab_deepnote
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterlab-deepnote` within that folder.

### Testing the extension

#### Server tests

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

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

### Packaging the extension

See [RELEASE](RELEASE.md)
