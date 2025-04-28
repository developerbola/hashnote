import { useEffect, useRef, useState } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import Bottombar from "./components/Bottombar";
import { FunctionsProvider } from "./context/FunctionsProvider";
import { FoldersProvider } from "./context/FoldersProvider";

function App() {
  const [activeFile, setActiveFile] = useState(false);
  const bottomRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!bottomRef.current || !editorRef.current) return;

    if (activeFile) {
      bottomRef.current.style.opacity = 0;
      editorRef.current.style.display = "block";
      
      setTimeout(() => {
        bottomRef.current.style.display = "none";
        editorRef.current.style.zIndex = "10";
        editorRef.current.style.opacity = 1;
      }, 200);
    } else {
      editorRef.current.style.opacity = 0;
      setTimeout(() => {
        editorRef.current.style.display = "none";
        editorRef.current.style.zIndex = "1";
        bottomRef.current.style.display = "block";
        bottomRef.current.style.zIndex = "10";
        setTimeout(() => {
          bottomRef.current.style.opacity = 1;
        }, 10);
      }, 190);
    }
  }, [activeFile]);

  return (
    <FunctionsProvider>
      <FoldersProvider>
        <div className="drag-place" data-tauri-drag-region></div>
        <div className="container">
          <div ref={bottomRef} style={{ transition: "all 200ms ease" }}>
            <Bottombar setActiveFile={setActiveFile} />
          </div>
          <MarkdownEditor
            editorRef={editorRef}
            setActiveFile={setActiveFile}
            activeFile={activeFile}
          />
        </div>
      </FoldersProvider>
    </FunctionsProvider>
  );
}

export default App;
