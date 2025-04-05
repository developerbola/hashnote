import { useState, useEffect } from "react";
import GitHubActivity from "./GitHubActivity";
import ShowCase from "./ShowCase";
import AboutButton from "./AboutButton";
import { readToken } from "../utils/readDataFromFile";
import { useFolders } from "../context/FoldersProvider";

const Bottombar = ({ setActiveFile }) => {
  const [activeFolder, setActiveFolder] = useState("Notes");
  const { folders, loadFilesFromDisk } = useFolders();
  useEffect(() => {
    loadFilesFromDisk();
    readToken();
  }, []);

  useEffect(() => {
    loadFilesFromDisk();
  }, [activeFolder]);

  return (
    <div className={"bottom-bar"}>
      <GitHubActivity  />
      {/* Show active folder data */}
      <ShowCase data={folders[activeFolder]} setActiveFile={setActiveFile} />

      <div className="footbar">
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
        <AboutButton />
      </div>
    </div>
  );
};

export default Bottombar;
