import { useContext, useState } from "react";
import { FoldersContext } from "./context";

export const FoldersProvider = ({ children }) => {
  const [folders, setFolders] = useState({
    Notes: {
      title: "Notes",
      icon: "./svg_icons/notes.svg",
      data: [],
    },
    Habits: {
      title: "Habits",
      icon: "./svg_icons/habits.svg",
      data: [],
    },
    Codes: {
      title: "Codes",
      icon: "./svg_icons/codes.svg",
      data: [],
    },
  });

  const loadFilesFromDisk = () => {
    setFolders((prev) => {
      const fs = window.require("fs");
      const path = window.require("path");
      const os = window.require("os");

      const homeDir = os.homedir();
      const appBaseDir = path.join(homeDir, ".hashnote");
      const updated = { ...prev };

      Object.keys(updated).forEach((folderKey) => {
        const directory = path.join(appBaseDir, folderKey.toLowerCase());

        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }

        const files = fs.readdirSync(directory);

        const filesWithStats = files.map((fileName) => {
          const fullPath = path.join(directory, fileName);
          const stats = fs.statSync(fullPath); // get file metadata

          return {
            title: fileName.split(".")[0].split("-").join(" "),
            path: fullPath,
            createdAt: stats.birthtime, // or stats.ctime
          };
        });

        // Sort newest first
        filesWithStats.sort((a, b) => b.createdAt - a.createdAt);

        updated[folderKey].data = filesWithStats;
      });

      return updated;
    });
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
