// In ShowCase.jsx
import { useEffect, useRef, useState } from "react";

const ShowCase = ({ data, setActiveFile, loadFilesFromDisk }) => {
  const showcaseRef = useRef(null);
  const [datas, setDatas] = useState([]);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(0);
    const timeout = setTimeout(() => {
      setDatas(data);
      setOpacity(1);
    }, 200);
    return () => clearTimeout(timeout);
  }, [data]);

  const handleCreateNewFile = () => {
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

      const filePath = path.join(folderPath, `New-${datas.title}.txt`);

      fs.writeFileSync(filePath, `New-${datas.title}`);
      loadFilesFromDisk();
      return filePath;
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  const handleDeleteFile = (note, index, event) => {
    event.stopPropagation();

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

  return (
    <div
      ref={showcaseRef}
      style={{
        transition: "opacity 100ms ease-in-out",
        opacity: opacity,
      }}
    >
      <div className="notes-header">
        <div className="notes-title">
          <h3 className="title">{datas.title}</h3>
          <img src={datas.icon} height={20} width={20} />
        </div>
        <div>
          <button className="new-button" onClick={handleCreateNewFile}>
            <img src="./svg_icons/plus.svg" height={17} width={17} />
          </button>
        </div>
      </div>
      <div className="notes-wrapper">
        {datas.data?.map((note, idx) => (
          <div
            key={idx}
            className="note-link"
            onClick={() => setActiveFile(true)}
          >
            <img src="./svg_icons/hashtag.svg" height={13} width={13} />
            <div className="note-link-title">
              <h3>{note.title}</h3>
              <img
                src="./svg_icons/trash.svg"
                style={{ filter: "invert(1)", opacity: 0.2 }}
                height={16}
                width={16}
                onClick={(e) => handleDeleteFile(note, idx, e)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowCase;
