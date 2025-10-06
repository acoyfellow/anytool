---
title: Build image · Cloudflare Pages docs
description: Cloudflare Pages' build environment has broad support for a variety
  of languages, such as Ruby, Node.js, Python, PHP, and Go.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/configuration/build-image/
  md: https://developers.cloudflare.com/pages/configuration/build-image/index.md
---

Cloudflare Pages' build environment has broad support for a variety of languages, such as Ruby, Node.js, Python, PHP, and Go.

If you need to use a [specific version](#override-default-versions) of a language, (for example, Node.js or Ruby) you can specify it by providing an associated environment variable in your build configuration, or setting the relevant file in your source code.

## Supported languages and tools

In the following tables, review the preinstalled versions for languages and tools included in the Cloudflare Pages' build image, and the environment variables and/or files available for [overriding the preinstalled version](#override-default-versions):

### Languages and runtime

* v3

  | Tool | Default version | Supported versions | Environment variable | File |
  | - | - | - | - | - |
  | **Go** | 1.24.3 | Any version | `GO_VERSION` | |
  | **Node.js** | 22.16.0 | Any version | `NODE_VERSION` | .nvmrc, .node-version |
  | **Bun** | 1.2.15 | Any version | `BUN_VERSION` | |
  | **Python** | 3.13.3 | Any version | `PYTHON_VERSION` | .python-version, runtime.txt |
  | **Ruby** | 3.4.4 | Any version | `RUBY_VERSION` | .ruby-version |

* v1

  | Tool | Default version | Supported versions | Environment variable | File |
  | - | - | - | - | - |
  | **Clojure** | | | | |
  | **Elixir** | 1.7 | 1.7 only | | |
  | **Erlang** | 21 | 21 only | | |
  | **Go** | 1.14.4 | Any version | `GO_VERSION` | |
  | **Java** | 8 | 8 only | | |
  | **Node.js** | 12.18.0 | Any version | `NODE_VERSION` | .nvmrc, .node-version |
  | **PHP** | 5.6 | 5.6, 7.2, 7.4 only | `PHP_VERSION` | |
  | **Python** | 2.7 | 2.7, 3.5, 3.7 only | `PYTHON_VERSION` | runtime.txt, Pipfile |
  | **Ruby** | 2.7.1 | Any version between 2.6.2 and 2.7.5 | `RUBY_VERSION` | .ruby-version |
  | **Swift** | 5.2.5 | Any 5.x version | `SWIFT_VERSION` | .swift-version |
  | **.NET** | 3.1.302 | | | |

* v2

  | Tool | Default version | Supported versions | Environment variable | File |
  | - | - | - | - | - |
  | **Go** | 1.21.0 | Any version | `GO_VERSION` | |
  | **Node.js** | 18.17.1 | Any version | `NODE_VERSION` | .nvmrc, .node-version |
  | **Bun** | 1.1.33 | Any version | `BUN_VERSION` | |
  | **Python** | 3.11.5 | Any version | `PYTHON_VERSION` | .python-version, runtime.txt |
  | **Ruby** | 3.2.2 | Any version | `RUBY_VERSION` | .ruby-version |

Any version

Under Supported versions, "Any version" refers to support for all versions of the language or tool including versions newer than the Default version.

### Tools

* v3

  | Tool | Default version | Supported versions | Environment variable |
  | - | - | - | - |
  | **Bundler** | 2.6.9 | Corresponds with Ruby version | |
  | **Embedded Dart Sass** | 1.62.1 | Up to 1.62.1 | `EMBEDDED_DART_SASS_VERSION` |
  | **gem** | 3.6.9 | Corresponds with Ruby version | |
  | **Hugo** | 0.147.7 | Any version | `HUGO_VERSION` |
  | **npm** | 10.9.2 | Corresponds with Node.js version | |
  | **pip** | 25.1.1 | Corresponds with Python version | |
  | **pipx** | 1.7.1 | | |
  | **pnpm** | 10.11.1 | Any version | `PNPM_VERSION` |
  | **Poetry** | 2.1.3 | | |
  | **Yarn** | 4.9.1 | Any version | `YARN_VERSION` |

* v1

  | Tool | Default version | Supported versions | Environment variable |
  | - | - | - | - |
  | **Boot** | 2.5.2 | 2.5.2 | |
  | **Bower** | | | |
  | **Cask** | | | |
  | **Composer** | | | |
  | **Doxygen** | 1.8.6 | | |
  | **Emacs** | 25 | | |
  | **Gutenberg** | (requires environment variable) | Any version | `GUTENBERG_VERSION` |
  | **Hugo** | 0.54.0 | Any version | `HUGO_VERSION` |
  | **GNU Make** | 3.8.1 | | |
  | **ImageMagick** | 6.7.7 | | |
  | **jq** | 1.5 | | |
  | **Leiningen** | | | |
  | **OptiPNG** | 0.6.4 | | |
  | **npm** | Corresponds with Node.js version | Any version | `NPM_VERSION` |
  | **pip** | Corresponds with Python version | | |
  | **Pipenv** | Latest version | | |
  | **sqlite3** | 3.11.0 | | |
  | **Yarn** | 1.22.4 | Any version from 0.2.0 to 1.22.19 | `YARN_VERSION` |
  | **Zola** | (requires environment variable) | Any version from 0.5.0 and up | `ZOLA_VERSION` |

* v2

  | Tool | Default version | Supported versions | Environment variable |
  | - | - | - | - |
  | **Bundler** | 2.4.10 | Corresponds with Ruby version | |
  | **Embedded Dart Sass** | 1.62.1 | Up to 1.62.1 | `EMBEDDED_DART_SASS_VERSION` |
  | **gem** | 3.4.10 | Corresponds with Ruby version | |
  | **Hugo** | 0.118.2 | Any version | `HUGO_VERSION` |
  | **npm** | 9.6.7 | Corresponds with Node.js version | |
  | **pip** | 23.2.1 | Corresponds with Python version | |
  | **pipx** | 1.2.0 | | |
  | **pnpm** | 8.7.1 | Any version | `PNPM_VERSION` |
  | **Poetry** | 1.6.1 | | |
  | **Yarn** | 3.6.3 | Any version | `YARN_VERSION` |

Any version

Under Supported versions, "Any version" refers to support for all versions of the language or tool including versions newer than the Default version.

### Frameworks

To use a specific version of a framework, specify it in the project's package manager configuration file. For example, if you use Gatsby, your `package.json` should include the following:

```plaintext
"dependencies": {
  "gatsby": "^5.13.7",
}
```

When your build starts, if not already [cached](https://developers.cloudflare.com/pages/configuration/build-caching/), version 5.13.7 of Gatsby will be installed using `npm install`.

## Advanced Settings

### Override default versions

To override default versions of languages and tools in the build system, you can either set the desired version through environment variables or by adding files to your project.

To set the version using environment variables, you can:

1. Find the environment variable name for the language or tool in [this table](https://developers.cloudflare.com/pages/configuration/build-image/#supported-languages-and-tools).
2. Add the environment variable on the dashboard by going to **Settings** > **Environment variables** in your Pages project, or [add the environment variable via Wrangler](https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-wrangler).

Or, to set the version by adding a file to your project, you can:

1. Find the file name for the language or tool in [this table](https://developers.cloudflare.com/pages/configuration/build-image/#supported-languages-and-tools).
2. Add the specified file name to the root directory of your project, and add the desired version number as the contents of the file.

For example, if you were previously relying on the default version of Node.js in the v1 build system, to migrate to v2, you must specify that you need Node.js `12.18.0` by setting a `NODE_VERSION = 12.18.0` environment variable or by adding a `.node-version` or `.nvmrc` file to your project with `12.18.0` added as the contents to the file.

### Skip dependency install

You can add the following environment variable to disable automatic dependency installation, and run a custom install command instead.

| Build variable | Value |
| - | - |
| `SKIP_DEPENDENCY_INSTALL` | `1` or `true` |

## v3 build system

The v3 build system updates the default tools, libraries and languages to their LTS versions, as of May 2025.

### v2 to v3 Migration

To migrate to this new version, configure your Pages project settings in the dashboard:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select your Pages project.

3. Go to **Deployments** > **All deployments** > and select the latest version.

If you were previously relying on the default versions of any languages or tools in the build system, your build may fail when migrating to v3. To fix this, you must specify the version you wish to use by [overriding](https://developers.cloudflare.com/pages/configuration/build-image/#overriding-default-versions) the default versions.

### Limitations

The following features are not currently supported when using the v3 build system:

* Specifying Node.js versions as codenames (for example, `hydrogen` or `lts/hydrogen`).
* Detecting Yarn version from `yarn.lock` file version.
* Detecting pnpm version detection based `pnpm-lock.yaml` file version.
* Detecting Node.js and package managers from `package.json` -> `"engines"`.
* `pipenv` and `Pipfile` support.

## Build environment

Cloudflare Pages builds are run in a [gVisor](https://gvisor.dev/docs/) container.

* v3

  | | |
  | - | - |
  | **Build environment** | Ubuntu `22.04.2` |
  | **Architecture** | x86\_64 |

* v1

  | | |
  | - | - |
  | **Build environment** | Ubuntu `20.04.5` |
  | **Architecture** | x86\_64 |

* v2

  | | |
  | - | - |
  | **Build environment** | Ubuntu `22.04.2` |
  | **Architecture** | x86\_64 |
