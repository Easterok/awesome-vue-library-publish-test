import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

const fs = require("fs-extra");
const path = require("path");

let entries = [];

let globalDependencies = {
  vue: "Vue",
};

function addEntry(folder, inFile, outFile) {
  entries.push({
    input: `src/presentation/components/${folder}/${inFile}`,
    output: [
      {
        format: "cjs",
        file: `dist/${folder}/${outFile}.cjs.js`,
      },
      {
        format: "esm",
        file: `dist/${folder}/${outFile}.esm.js`,
      },
      {
        format: "iife",
        name: `awesome-vue-library-publish-test.${folder}`,
        file: `dist/${folder}/${outFile}.js`,
        globals: globalDependencies,
      },
    ],
    plugins: [vue(), postcss()],
  });

  entries.push({
    input: `src/presentation/components/${folder}/${inFile}`,
    output: [
      {
        format: "cjs",
        file: `dist/${folder}/${outFile}.cjs.min.js`,
      },
      {
        format: "esm",
        file: `dist/${folder}/${outFile}.esm.min.js`,
      },
      {
        format: "iife",
        name: `awesome-vue-library-publish-test.${folder}`,
        file: `dist/${folder}/${outFile}.min.js`,
        globals: globalDependencies,
      },
    ],
    plugins: [vue(), postcss(), terser()],
  });
}

function addSFC() {
  fs.readdirSync(path.resolve(__dirname, "./src/presentation/components"), {
    withFileTypes: true,
  })
    .filter((dir) => dir.isDirectory())
    .forEach(({ name: folderName }) => {
      fs.readdirSync(
        path.resolve(__dirname, `./src/presentation/components/${folderName}`)
      ).forEach((file) => {
        const name = file.split(/(.vue)$|(.js)$/)[0].toLowerCase();

        if (/\.vue$/.test(file) && name === folderName) {
          addEntry(folderName, file, name);
        }
      });
    });
}

addSFC();

export default entries;
