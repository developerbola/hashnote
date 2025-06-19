import { useContext, useState } from "react";
import { FoldersContext } from "./context";
import { createDir, exists, readDir } from "@tauri-apps/api/fs";
import { metadata } from "tauri-plugin-fs-extra-api";
import { homeDir, join } from "@tauri-apps/api/path";

export const FoldersProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);

  const loadFilesFromDisk = async () => {
    try {
      const home = await homeDir();
      const appBaseDir = await join(home, ".hashnote");
      if (!(await exists(appBaseDir))) {
        await createDir(appBaseDir);
      }

      const files = await readDir(appBaseDir);

      const filesWithMeta = await Promise.all(
        files.map(async (file) => {
          const fileMetadata = await metadata(file.path);
          return {
            ...file,
            createdAt: fileMetadata.createdAt,
          };
        })
      );

      const sortedFiles = filesWithMeta.sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );

      setFolders(sortedFiles);
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
