import { useState, useEffect } from "react";
import GitHubActivity from "./GitHubActivity";
import ShowCase from "./ShowCase";

const Bottombar = ({ setActiveFile, token, username }) => {
  const [activeFolder, setActiveFolder] = useState("Notes");
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

  const readTokenFromFile = () => {
    try {
      const fs = window.require("fs");
      const path = window.require("path");
      const os = window.require("os");

      const homeDir = os.homedir();
      const appBaseDir = path.join(homeDir, ".hashnote");
      const filePath = path.join(appBaseDir, "token.txt");

      if (!fs.existsSync(appBaseDir)) {
        fs.mkdirSync(appBaseDir, { recursive: true });
      }

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "");
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  useEffect(() => {
    loadFilesFromDisk();
    readTokenFromFile();
  }, []);

  useEffect(() => {
    loadFilesFromDisk();
  }, [activeFolder]);

  return (
    <div className={"bottom-bar"}>
      <GitHubActivity username={username} token={token} />
      {/* Show active folder data */}
      <ShowCase
        data={folders[activeFolder]}
        setActiveFile={setActiveFile}
        loadFilesFromDisk={loadFilesFromDisk}
      />

      <div className="folder-links-wrapper">
        {Object.keys(folders).map((folderKey) => (
          <button
            key={folderKey}
            className={`folder-link ${
              activeFolder === folderKey ? "active" : ""
            }`}
            onClick={() => {
              setActiveFolder(folderKey);
            }}
          >
            <h4>{folders[folderKey].title}</h4>
            <img
              src={folders[folderKey].icon}
              height={15}
              width={15}
              alt={folders[folderKey].title}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Bottombar;
