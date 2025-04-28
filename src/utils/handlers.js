import {
  readTextFile,
  writeTextFile,
  removeFile,
  renameFile,
  createDir,
  exists,
} from "@tauri-apps/api/fs";
import { homeDir, join } from "@tauri-apps/api/path";

let appBaseDir;

// Initialize home directory path on load
(async () => {
  const home = await homeDir();
  appBaseDir = await join(home, ".hashnote");
})();

export const handleSaveToFile = async (filePath, content) => {
  try {
    if (!filePath) {
      console.error("Error: filePath is empty or undefined.");
      return;
    }

    if (!content) {
      console.warn("Error: content is empty.");
      content = "";
    }

    // Split content by lines
    const lines = content.split("\n");

    let emptyLineCount = 0;
    for (let i = 0; i < lines.length; i++) {
      // Check if the line is empty
      if (lines[i].trim() === "") {
        emptyLineCount++;

        // If we've encountered 2 empty lines, replace the next empty line with &#x20;
        if (emptyLineCount === 2) {
          lines[i] = "&#x20;";
          emptyLineCount = 0; // Reset the counter after replacing
        }
      } else {
        emptyLineCount = 0; // Reset if we encounter a non-empty line
      }
    }

    // Join the lines back into a string with newlines
    content = lines.join("\n");

    const baseExists = await exists(appBaseDir);
    if (!baseExists) {
      await createDir(appBaseDir, { recursive: true });
    }

    await writeTextFile(filePath, content);
  } catch (e) {
    console.error(`Error saving ${filePath}:`, e);
  }
};

export const handleCreateNewFile = async (data, loadFilesFromDisk) => {
  try {
    const folderPath = appBaseDir;
    const folderExists = await exists(folderPath);
    if (!folderExists) {
      await createDir(folderPath, { recursive: true });
    }

    const filePath = await join(folderPath, `New-Note.md`);

    const fileExists = await exists(filePath);
    if (!fileExists) {
      await writeTextFile(filePath, `# New Note`);
    } else {
      console.warn("File already exists");
      return "";
    }

    loadFilesFromDisk();
    return filePath;
  } catch (error) {
    console.error("Error creating file:", error);
  }
};

export const handleDeleteFile = async (
  note,
  index,
  e,
  data,
  loadFilesFromDisk,
  setData
) => {
  e.stopPropagation();
  try {
    let filePath = note.path;
    if (!filePath) {
      const folderPath = await join(appBaseDir, data.title.toLowerCase());
      filePath = await join(folderPath, note.title);
    }

    const fileExists = await exists(filePath);
    if (!fileExists) {
      console.warn(`File not found for deletion: ${filePath}`);
      setData((prev) => {
        const updatedData = { ...prev };
        updatedData.data = updatedData.data.filter((_, i) => i !== index);
        return updatedData;
      });
      return;
    }

    await removeFile(filePath);
    loadFilesFromDisk();
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const handleRenameFile = async (
  filePath,
  newFileName,
  loadFilesFromDisk
) => {
  try {
    const fileExists = await exists(filePath);
    if (!fileExists) {
      throw new Error("File does not exist");
    }

    const targetDir = filePath.substring(0, filePath.lastIndexOf("/"));
    const newFilePath = `${targetDir}/${newFileName}`;

    await renameFile(filePath, newFilePath);
    loadFilesFromDisk();
    return newFilePath;
  } catch (err) {
    console.error("Error during file rename:", err);
    throw err;
  }
};
