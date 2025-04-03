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
    try {
      const fs = window.require("fs");
      const path = window.require("path");
      const os = window.require("os");

      const homeDir = os.homedir();
      const appBaseDir = path.join(homeDir, ".hashnote");
      const updatedFolders = { ...folders };

      Object.keys(updatedFolders).forEach((folderKey) => {
        const directory = path.join(appBaseDir, folderKey.toLowerCase());

        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }

        const files = fs.readdirSync(directory);
        updatedFolders[folderKey].data = files.map((fileName) => ({
          title: fileName.split(".")[0].split("-").join(" "),
          path: path.join(directory, fileName),
        }));
      });

      setFolders(updatedFolders);
    } catch (error) {
      console.error("Error loading files:", error);
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
