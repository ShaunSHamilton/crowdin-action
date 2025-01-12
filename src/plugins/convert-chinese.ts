import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

import { outputFile } from "fs-extra";
import opencc from "node-opencc";

const getFiles = async (directory: string, fileList: string[] = []) => {
  const files = await readdir(directory);
  for (const file of files) {
    const fileStat = await stat(join(directory, file));
    if (fileStat.isDirectory()) {
      // eslint-disable-next-line no-param-reassign
      fileList = await getFiles(join(directory, file), fileList);
    } else {
      fileList.push(join(directory, file));
    }
  }
  return fileList;
};

/**
 * Module to convert Simplified Chinese files to Traditional Chinese.
 *
 * @param {string} directory The directory to convert.
 */
export const convertChinese = async (directory: string) => {
  console.info("Getting file list...");
  const files = await getFiles(join(process.cwd(), directory));
  for (const file of files) {
    console.info(`Converting ${file}...`);
    const fileText = await readFile(file, "utf-8");
    const translatedText = await opencc.simplifiedToTraditional(fileText);
    await outputFile(
      file.replace("chinese", "chinese-traditional"),
      translatedText
    );
  }
};
