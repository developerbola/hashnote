import { useEffect, useState } from "react";
import { handleCreateNewFile, handleDeleteFile } from "../utils/handlers";

const ShowCase = ({ data, setActiveFile, loadFilesFromDisk }) => {
  const [datas, setDatas] = useState([]);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(0);
    const timeout = setTimeout(() => {
      setDatas(data);
      setOpacity(1);
    }, 250);
    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <div
      style={{
        transition: "opacity 150ms ease-in-out",
        opacity: opacity,
      }}
    >
      <div className="showcase-header">
        <div className="showcase-title">
          <h3 className="title">{datas.title}</h3>
          <img src={datas.icon} height={20} width={20} />
        </div>
        <div>
          <button
            className="new-button"
            onClick={() => handleCreateNewFile(datas, loadFilesFromDisk)}
          >
            <img src="./svg_icons/plus.svg" height={17} width={17} />
          </button>
        </div>
      </div>
      <div className="showcase-wrapper">
        {datas.data?.map((note, idx) => (
          <div
            key={idx}
            className="showcase-link"
            onClick={() => {
              setActiveFile(true);
              console.log(note);
            }}
          >
            <img src="./svg_icons/hashtag.svg" height={13} width={13} />
            <div className="showcase-link-title">
              <h3>{note.title}</h3>
              <img
                src="./svg_icons/trash.svg"
                style={{ filter: "invert(1)", opacity: 0.2 }}
                height={16}
                width={16}
                onClick={(e) =>
                  handleDeleteFile(note, idx, e, datas, loadFilesFromDisk)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowCase;
