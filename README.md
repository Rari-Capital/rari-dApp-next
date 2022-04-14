# Rari dApp &middot; ![Tests](https://github.com/Rari-Capital/rari-dApp/workflows/Tests/badge.svg) &middot; [![Coverage Status](https://coveralls.io/repos/github/Rari-Capital/rari-dApp/badge.svg?branch=master)](https://coveralls.io/github/Rari-Capital/rari-dApp?branch=master)

Rari Capital's Web3 Portal.

## Scripts

- Run `npm run dev` to start the development server.
- Run `npm run build` to build a production bundle
- Run `npm run bump-rari-components` to automatically install the latest version (i.e. most recent commit hash) of [rari-components](https://github.com/Rari-Capital/rari-components) and update `package.json`.
- Run `npm run typecheck` to typecheck

## Requirements

- node: `v14.17.0`
- npm: `v6.14.13`

## Notes:

<details>
  <summary>What are the "compiled" folders in src/static?</summary>
  
- The `src/static/compiled` folder has misc. files that are auto generated from scripts like: [rari-tokens-generator](https://github.com/Rari-Capital/rari-tokens-generator)
- You can generate these files using `npm install`.
- These files are gitignored so do not worry about trying to commit them!
 </details>
