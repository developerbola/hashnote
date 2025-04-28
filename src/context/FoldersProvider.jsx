import { useContext, useState } from "react";
import { FoldersContext } from "./context";
import { createDir, exists, readDir } from "@tauri-apps/api/fs";
import { homeDir, join } from "@tauri-apps/api/path";

export const FoldersProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);

  const loadFilesFromDisk = async () => {
    try {
      const home = await homeDir();
      const appBaseDir = await join(home, ".hashnote");
      if (!exists(appBaseDir)) {
        createDir(home, ".hashnote");
      }
      setFolders(await readDir(appBaseDir));
    } catch (err) {
      console.error("Error loading files:", err);
    }
  };

  return (
    <FoldersContext.Provider value={{ folders, setFolders, loadFilesFromDisk }}>
      {children}
    </FoldersContext.Provider>
  );
};

export const useFolders = () => {
  return useContext(FoldersContext);
};
