import {
  readTextFile,
  writeTextFile,
  exists,
  createDir,
} from "@tauri-apps/api/fs";
import { homeDir, join } from "@tauri-apps/api/path";

let appBaseDir;

// Initialize home directory path on load
(async () => {
  const home = await homeDir();
  appBaseDir = await join(home, ".hashnote");
})();

export const readToken = async () => {
  try {
    const filePath = await join(appBaseDir, "token.txt");

    const baseExists = await exists(appBaseDir);
    if (!baseExists) {
      await createDir(appBaseDir, { recursive: true });
    }

    const fileExists = await exists(filePath);
    if (fileExists) {
      const token = await readTextFile(filePath);
      return token;
    } else {
      console.warn("Token file does not exist. So created one.");
      await writeTextFile(filePath, "");
      return "";
    }
  } catch (e) {
    console.error("Error reading token:", e);
    return "";
  }
};

export const readUsername = async () => {
  try {
    const filePath = await join(appBaseDir, "username.txt");

    const fileExists = await exists(filePath);
    if (fileExists) {
      const username = await readTextFile(filePath);
      return username;
    } else {
      console.warn("Username file does not exist. So created one.");
      await writeTextFile(filePath, "");
      return "";
    }
  } catch (e) {
    console.error("Error reading username:", e);
    return "";
  }
};

export const readFile = async (filePath) => {
  try {
    const fileExists = await exists(filePath);
    if (fileExists) {
      const fileValue = await readTextFile(filePath);
      return fileValue;
    } else {
      console.warn("File does not exist.");
      return "";
    }
  } catch (e) {
    console.error("Error reading file:", e);
    throw e;
  }
};
