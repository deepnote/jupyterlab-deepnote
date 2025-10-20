# Contributing to jupyterlab-deepnote

Thank you for your interest in contributing to the Deepnote JupyterLab extension! This guide will help you set up your development environment and understand the contribution workflow.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Building and Running](#building-and-running)
- [Testing](#testing)
- [Making Changes](#making-changes)
- [Troubleshooting](#troubleshooting)
- [Development Uninstall](#development-uninstall)

## Prerequisites

Before you begin, ensure you have the following installed:

1. [Python](https://www.python.org/) 3.12 or later - Required for the server extension
2. [Node.js](https://nodejs.org/) v18 or later - Required for building the frontend extension
3. [npm](https://www.npmjs.com/) (comes with Node.js) - JavaScript package manager
4. [Git](https://git-scm.com/) - For version control
5. [JupyterLab](https://jupyterlab.readthedocs.io/) >= 4.0.0 - The extension requires JupyterLab 4.x
6. **GitHub Account** - With access to create [Personal Access Tokens](https://github.com/settings/tokens)
7. macOS, Linux, or Windows

<details>
<summary><b>📦 Or use these commands to install the prerequisites</b></summary>

#### macOS (using Homebrew)

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (LTS version)
brew install node

# Install Python 3.12
brew install python@3.12

# Install Git (usually pre-installed on macOS)
brew install git

# Verify installations
node --version
npm --version
python3.12 --version
git --version
```

#### macOS/Linux (using nvm for Node.js)

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc for zsh

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify Node.js and npm
node --version
npm --version

# Install Python (Ubuntu/Debian)
sudo apt update && sudo apt install python3.12 python3.12-venv python3-pip git

# Install Python (Fedora)
sudo dnf install python3.12 python3-pip git

# Install Python (Arch Linux)
sudo pacman -S python git

# Verify installations
python3.12 --version
git --version
```

#### Linux (using package managers)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm python3.12 python3.12-venv python3-pip git curl

# Fedora
sudo dnf install nodejs npm python3.12 python3-pip git curl

# Arch Linux
sudo pacman -S nodejs npm python git curl

# Verify installations
node --version
npm --version
python3.12 --version
git --version
```

</details>

## Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/deepnote/jupyterlab-deepnote.git
cd jupyterlab-deepnote
```

### Step 2: Set Up Python Environment

We recommend using [uv](https://docs.astral.sh/uv/) for Python environment management, but you can use any tool you prefer (venv, conda, poetry, etc.).

#### Option A: Using uv (Recommended)

Install uv:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Create and activate a Python environment:
```bash
# Create virtual environment with Python 3.12
uv venv --python 3.12 --managed-python

# Activate the environment
source .venv/bin/activate  # On macOS/Linux
# OR
.venv\Scripts\activate     # On Windows
```

#### Option B: Using venv

```bash
python3.12 -m venv .venv
source .venv/bin/activate  # On macOS/Linux
# OR
.venv\Scripts\activate     # On Windows
```

### Step 3: Install JupyterLab

The extension package itself doesn't depend on `jupyterlab`, but you need it in your environment for testing:

```bash
# If using uv
uv pip install jupyterlab

# If using pip
pip install jupyterlab
```

### Step 4: Configure GitHub Packages Access

The `@deepnote/blocks` package is published on GitHub Packages and requires authentication.

#### Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name (e.g., "jupyterlab-deepnote-dev")
4. Select the **`read:packages`** scope
5. Click **"Generate token"** and copy the token

#### Set the Environment Variable

You need to set the `GITHUB_TOKEN` environment variable so that `jlpm` (JupyterLab's wrapper around Yarn) can authenticate with GitHub Packages.

**Option A: Set it in your shell profile (persistent)**

Add to your `~/.zshrc` (macOS/Linux with zsh) or `~/.bashrc` (Linux with bash):

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Then reload your shell:
```bash
source ~/.zshrc  # or ~/.bashrc
```

**Option B: Set it for the current session (temporary)**

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

**Option C: Use a .env file**

Create a `~/.env` file:
```bash
GITHUB_TOKEN=ghp_your_token_here
```

Then source it in your shell profile:
```bash
# Add to ~/.zshrc or ~/.bashrc
if [ -f ~/.env ]; then
    export $(cat ~/.env | xargs)
fi
```

### Step 5: Install the Extension in Development Mode

Install the extension package in editable mode. This will also install all Python and JavaScript dependencies:

```bash
# If using uv
uv pip install --editable . --verbose

# If using pip
pip install --editable . --verbose
```

This command will:
- Install Python dependencies
- Run `jlpm install` to install JavaScript dependencies (including `@deepnote/blocks`)
- Build the frontend extension

### Step 6: Link the Extension with JupyterLab

Link your development version of the extension with JupyterLab:

```bash
jupyter labextension develop . --overwrite
```

This creates a symlink so JupyterLab uses your local development version.

### Step 7: Enable the Server Extension

Enable the extension in Jupyter Server:

```bash
jupyter server extension enable jupyterlab_deepnote
```

### Step 8: Verify Installation

Check that both the frontend and server extensions are installed:

```bash
# Check server extension
jupyter server extension list

# Check frontend extension
jupyter labextension list
```

You should see `jupyterlab_deepnote` listed as enabled in both outputs.

## Building and Running

### Development Workflow

For active development, you'll want to run two processes simultaneously:

#### Terminal 1: Watch Mode (Auto-rebuild)

This watches your TypeScript source files and automatically rebuilds when you make changes:

```bash
jlpm run watch
```

Keep this running in the background. It will automatically rebuild the extension whenever you save changes to TypeScript files.

#### Terminal 2: Run JupyterLab

In a separate terminal, start JupyterLab:

```bash
# Basic
jupyter lab

# With debug logging (recommended for development)
jupyter lab --debug
```

### Making Changes Visible

With the watch command running:
1. Make changes to your TypeScript/Python code
2. Save the file
3. Wait a few seconds for the rebuild to complete
4. **Refresh your browser** to see the changes

**Note:** Python changes (server extension) require restarting JupyterLab, but frontend changes only require a browser refresh.

### Manual Build

If you're not using watch mode, you can manually rebuild:

```bash
jlpm run build
```

### Build with Source Maps

To generate source maps for easier debugging:

```bash
# For this extension only (default)
jlpm run build

# For JupyterLab core extensions too
jupyter lab build --minimize=False
```

## Testing

### Python Tests

This extension uses [Pytest](https://docs.pytest.org/) for Python testing.

#### Install Test Dependencies

```bash
pip install -e ".[test]"

# Re-link the frontend extension after installing
jupyter labextension develop . --overwrite
```

#### Run Python Tests

```bash
# Run all tests with coverage
pytest -vv -r ap --cov jupyterlab_deepnote

# Run specific test file
pytest tests/test_handlers.py -vv

# Run with verbose output
pytest -vv -s
```

### JavaScript Tests

This extension uses [Jest](https://jestjs.io/) for JavaScript testing.

#### Install Dependencies (if not already done)

```bash
jlpm install
```

#### Run JavaScript Tests

```bash
# Run all tests
jlpm test

# Run tests in watch mode
jlpm test --watch

# Run with coverage
jlpm test --coverage
```

## Making Changes

### Code Style

- **Python:** Follow PEP 8 guidelines
- **TypeScript:** The project uses ESLint and Prettier (configured in the project)

### Commit Messages

Write clear, descriptive commit messages:
- Use present tense ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Reference issues when applicable (#123)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything passes
5. Commit your changes
6. Push to your fork
7. Open a Pull Request with a clear description

## Troubleshooting

### Extension Not Showing Up

**Check server extension:**
```bash
jupyter server extension list
```

If not enabled, run:
```bash
jupyter server extension enable jupyterlab_deepnote
```

**Check frontend extension:**
```bash
jupyter labextension list
```

If not linked, run:
```bash
jupyter labextension develop . --overwrite
```

### GitHub Packages Authentication Issues

If you see errors about `@deepnote/blocks` not being found:

1. Verify your `GITHUB_TOKEN` is set:
   ```bash
   echo $GITHUB_TOKEN
   ```

2. Ensure the token has `read:packages` scope

3. Try re-installing:
   ```bash
   jlpm install --force
   ```

### Build Errors

If you encounter build errors:

1. Clear the build cache:
   ```bash
   jlpm clean
   jupyter lab clean
   ```

2. Reinstall dependencies:
   ```bash
   jlpm install
   pip install -e . --force-reinstall
   ```

3. Rebuild:
   ```bash
   jupyter labextension develop . --overwrite
   jlpm run build
   ```

### Changes Not Appearing

1. Ensure watch mode is running (`jlpm run watch`)
2. Wait for the rebuild to complete (check the watch terminal)
3. Hard refresh your browser (Cmd+Shift+R on macOS, Ctrl+Shift+R on Windows/Linux)
4. If Python changes, restart JupyterLab

### Port Already in Use

If port 8888 is already in use:

```bash
# Use a different port
jupyter lab --port=8889

# Or find and kill the process using port 8888
lsof -ti:8888 | xargs kill -9  # macOS/Linux
```

## Development Uninstall

When you're done developing or want to clean up:

### Step 1: Disable the Server Extension

```bash
jupyter server extension disable jupyterlab_deepnote
```

### Step 2: Uninstall the Python Package

```bash
pip uninstall jupyterlab_deepnote
```

### Step 3: Remove the Symlink

Find the labextensions folder:
```bash
jupyter labextension list
```

Look for the path to the `labextensions` folder in the output, then remove the symlink:

```bash
# Example path (yours may differ)
rm -rf /path/to/share/jupyter/labextensions/jupyterlab-deepnote
```

### Step 4: Clean Build Artifacts

```bash
jlpm clean
jupyter lab clean
```

## Additional Resources

- [JupyterLab Extension Developer Guide](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html)
- [JupyterLab Extension Tutorial](https://jupyterlab.readthedocs.io/en/stable/extension/extension_tutorial.html)
- [Project Issues](https://github.com/deepnote/jupyterlab-deepnote/issues)

## Questions?

If you have questions or run into issues:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Search existing [GitHub Issues](https://github.com/deepnote/jupyterlab-deepnote/issues)
3. Open a new issue with details about your problem

Thank you for contributing! 🎉
