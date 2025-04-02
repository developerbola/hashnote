import { useEffect, useRef, useState } from "react";
import Topbar from "./components/Topbar";
import Bottombar from "./components/Bottombar";
import MarkdownEditor from "./components/MarkdownEditor";
import { readToken, readUsername } from "./utils/readDataFromFile";

function App() {
  const [activeFile, setActiveFile] = useState(false);
  const [token, setToken] = useState(readToken());
  const [username, setUsername] = useState(readUsername());

  const bottomRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (activeFile) {
      bottomRef.current.style.opacity = 0;
      editorRef.current.style.display = "block";

      setTimeout(() => {
        bottomRef.current.style.display = "none";
        editorRef.current.style.opacity = 1;
      }, 200);
    } else {
      editorRef.current.style.opacity = 0;
      setTimeout(() => {
        editorRef.current.style.display = "none";
        bottomRef.current.style.display = "block";
        setTimeout(() => {
          bottomRef.current.style.opacity = 1;
        }, 10);
      }, 190);
    }
  }, [activeFile]);


  return (
    <>
      <div className="drag-place"></div>
      <div className="container">
        <div ref={bottomRef} style={{ transition: "all 200ms ease" }}>
          <Topbar
            token={token}
            setToken={setToken}
            username={username}
            setUsername={setUsername}
          />
          <Bottombar
            setActiveFile={setActiveFile}
            token={token}
            username={username}
          />
        </div>
        <MarkdownEditor editorRef={editorRef} setActiveFile={setActiveFile} />
      </div>
    </>
  );
}

export default App;
