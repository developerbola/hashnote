import { handleCreateNewFile, handleDeleteFile } from "../utils/handlers";
import { useFolders } from "../context/FoldersProvider";
import { useFunctions } from "../context/FunctionsProvider";
import { useEffect } from "react";

const ShowCase = ({ setActiveFile }) => {
  const { setFilePath } = useFunctions();
  const { folders, loadFilesFromDisk } = useFolders();
  useEffect(() => {
    loadFilesFromDisk();
  }, []);

  return (
    <div>
      <div className="showcase-header">
        <div className="showcase-title">
          <h3 className="title">Notes</h3>
          <img src={"./svg_icons/notes.svg"} height={20} width={20} />
        </div>
        <div>
          <button
            className="new-button"
            onClick={() => handleCreateNewFile(folders, loadFilesFromDisk)}
          >
            <img src="./svg_icons/plus.svg" height={17} width={17} />
          </button>
        </div>
      </div>
      <div className="showcase-wrapper">
        {folders?.map((note, idx) => (
          <div
            key={idx}
            className="showcase-link"
            onClick={() => {
              setActiveFile(true);
              setFilePath("");
              setTimeout(() => {
                setFilePath(note.path);
              }, 0);
            }}
          >
            <img src="./svg_icons/hashtag.svg" height={13} width={13} />
            <div className="showcase-link-title">
              <h3>{note.name.split(".")[0].split("-").join(" ")}</h3>
              <img
                src="./svg_icons/trash.svg"
                style={{ filter: "invert(1)", opacity: 0.2 }}
                height={16}
                width={16}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(note, idx, e, folders, loadFilesFromDisk);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowCase;
