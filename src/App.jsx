import { useEffect, useRef, useState } from "react";
import Topbar from "./components/Topbar";
import Bottombar from "./components/Bottombar";
import MarkdownEditor from "./components/MarkdownEditor";
import { FunctionsProvider } from "./context/FunctionsProvider";
import { FoldersProvider } from "./context/FoldersContext";
import { GithubProvider } from "./context/GithubContext";

function App() {
  const [activeFile, setActiveFile] = useState(false);

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
    <FunctionsProvider>
      <FoldersProvider>
        <GithubProvider>
          <div className="drag-place"></div>
          <div className="container">
            <div ref={bottomRef} style={{ transition: "all 200ms ease" }}>
              <Topbar />
              <Bottombar
                setActiveFile={setActiveFile}
              />
            </div>
            <MarkdownEditor
              editorRef={editorRef}
              setActiveFile={setActiveFile}
            />
          </div>
        </GithubProvider>
      </FoldersProvider>
    </FunctionsProvider>
  );
}

export default App;
