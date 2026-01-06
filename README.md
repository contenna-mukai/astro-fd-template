# astro-fd-template

## npm-scripts

```shell
# Installs dependencies
$ npm install

# Starts local dev server at localhost:4321
$ npm run dev

# Build for production
$ npm run build

# Format code
$ npm run format
```

## publicディレクトリ

`public`ディレクトリ内のファイルはそのままビルドフォルダ（`dist`）にコピーされます。

## ビルド後のCSSディレクトリをデフォルトから変更する

`npm install`後に`node_modules/astro/dist/core/build/css-asset-name.js`のL27とL35辺りにあるコードを変更する。<br>
ビルド後、各ページのディレクトリ内のcssフォルダ内にcssファイルがコンパイルされていればOKです。

```diff
L27
- const sep = "-";
+ const sep = "/";

L35
- while (i < 2) {
+ while (i < 10) {
```