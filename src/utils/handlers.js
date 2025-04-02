export const handleSaveToFile = (fileName, content) => {
  try {
    const fs = window.require("fs");
    const path = window.require("path");
    const os = window.require("os");

    const homeDir = os.homedir();
    const appBaseDir = path.join(homeDir, ".hashnote");
    const filePath = path.join(appBaseDir, fileName);

    if (!fs.existsSync(appBaseDir)) {
      fs.mkdirSync(appBaseDir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, "utf-8");
  } catch (e) {
    console.error(`Error saving ${fileName}:`, e);
  }
};

export const handleCreateNewFile = (datas, loadFilesFromDisk) => {
  try {
    const fs = window.require("fs");
    const path = window.require("path");
    const os = window.require("os");

    const homeDir = os.homedir();
    const appBaseDir = path.join(homeDir, ".hashnote");
    const folderPath = path.join(appBaseDir, datas.title.toLowerCase());

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const name = datas?.title?.split("s")[0];
    const filePath = path.join(folderPath, `New-${name}.txt`);
    fs.writeFileSync(filePath, `New ${name}`);

    loadFilesFromDisk();
    return filePath;
  } catch (error) {
    console.error("Error saving file:", error);
  }
};

export const handleDeleteFile = (note, index, e, datas, loadFilesFromDisk) => {
  e.stopPropagation();
  try {
    const fs = window.require("fs");
    const path = window.require("path");
    const os = window.require("os");

    let filePath = note.path;
    if (!filePath) {
      const homeDir = os.homedir();
      const appBaseDir = path.join(homeDir, ".hashnote");
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
