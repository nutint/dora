# Tools for using calculating DORA metric

## To install as dependencies
- Retrieve [Personal Access Token](https://github.com/settings/tokens/new?description=Npm-package-access&scopes=read:packages) click at Generate token
- Authenticate with pnpm with PAT from GitHub
  ```shell
  $ pnpm login --scope=@nutint --registry=https://npm.pkg.github.com
  ```
- Install the package
  ```shell
  $ pnpm install @nutint/dora
  ```

## Set up
- Set workflow permission to be able to have Read and write permission `https://github.com/{user}/{repository}/settings/actions`

## Reference
- [Step by step: Building and publishing an NPM Typescript package](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)
