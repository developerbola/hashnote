const fs = window.require("fs");
const path = window.require("path");
const os = window.require("os");

const homeDir = os.homedir(); // ~/
const appBaseDir = path.join(homeDir, ".hashnote"); // ~/.hashnote

export const handleSaveToFile = (filePath, content) => {
  try {
    if (!filePath) {
      console.error("Error: filePath is empty or undefined.");
      return;
    }

    if (!content) {
      console.warn("Error: content is empty.");
      content = "";
    }

    if (!fs.existsSync(appBaseDir)) {
      fs.mkdirSync(appBaseDir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, "utf-8");
  } catch (e) {
    console.error(`Error saving ${filePath}:`, e);
  }
};

export const handleCreateNewFile = (datas, loadFilesFromDisk) => {
  try {
    const folderPath = path.join(appBaseDir, datas.title.toLowerCase());

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const name = datas?.title?.split("s")[0];
    const filePath = path.join(folderPath, `New-${name}.md`);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `# New ${name}`);
    } else {
      console.warn("File already exist");
      return "";
    }

    loadFilesFromDisk();
    return filePath;
  } catch (error) {
    console.error("Error saving file:", error);
  }
};

export const handleDeleteFile = (note, index, e, datas, loadFilesFromDisk) => {
  e.stopPropagation();
  try {
    let filePath = note.path;
    if (!filePath) {
      const folderPath = path.join(appBaseDir, datas.title.toLowerCase());
      filePath = path.join(folderPath, note.title);
    }

    if (!fs.existsSync(filePath)) {
      console.warn(`File not found for deletion: ${filePath}`);

      setDatas((prev) => {
        const updatedData = { ...prev };
        updatedData.data = updatedData.data.filter((_, i) => i !== index);
        return updatedData;
      });
      return;
    }

    fs.unlinkSync(filePath);
    loadFilesFromDisk();
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const handleRenameFile = (filePath, newFileName, loadFilesFromDisk) => {
  return new Promise((resolve, reject) => {
    const fs = window.require("fs");
    const path = window.require("path");

    if (!fs.existsSync(filePath)) {
      return reject(new Error("File does not exist"));
    }

    const targetDir = path.dirname(filePath);
    const newFilePath = path.join(targetDir, newFileName);

    try {
      fs.renameSync(filePath, newFilePath);
      loadFilesFromDisk();
      resolve(newFilePath);
    } catch (err) {
      console.error("Error during file rename:", err);
      reject(err);
    }
  });
};
