# hardhat-fe


[Hardhat](https://hardhat.org) plugin to develop smart contracts with Fe.

## What

This plugin adds support for Fe to Hardhat. Once installed, Fe contracts can be compiled by running the `compile` task.

This plugin generates the same artifact format as the built-in Solidity compiler, so that it can be used in conjunction with all other plugins.

The Fe compiler is run using the local Fe binaries on your computer. Please make sure, that you have dowloaded them. 

## Installation

First you have to install the Fe Binaries. [Fe Binaries](http://fe.ethereum.org/).

Then, you need to install the plugin by running

```bash
npm install --save-dev @nomiclabs/hardhat-fe
```

And add the following statement to your `hardhat.config.js`:

```js
require("@nomiclabs/hardhat-fe");
```

Or, if you are using TypeScript, add this to your `hardhat.config.ts`:

```js
import "@nomiclabs/hardhat-fe";
```

## Required plugins

No plugins dependencies.

## Tasks

This plugin creates no additional tasks.

## Environment extensions

This plugin does not extend the Hardhat Runtime Environment.

## Configuration

This plugin adds an optional `fe` entry to Hardhat's config, which lets you specify the Vyper version to use. --Delete this version entry

This is an example of how to set it:

```js
module.exports = {
  vyper: {
    version: "0.1.0b10",
  },
};
```

## Usage

There are no additional steps you need to take for this plugin to work.
