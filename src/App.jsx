import React, { useEffect, useRef, useState, Suspense } from "react";
import Topbar from "./components/Topbar";
import Bottombar from "./components/Bottombar";
const MarkdownEditor = React.lazy(() => import("./components/MarkdownEditor"));
import { FunctionsProvider } from "./context/FunctionsProvider";
import { FoldersProvider } from "./context/FoldersProvider";
import { GithubProvider } from "./context/GithubProvider";

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
              <Bottombar setActiveFile={setActiveFile} />
            </div>
            <Suspense
              fallback={
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <span className="spinner" />
                </div>
              }
            >
              <MarkdownEditor
                editorRef={editorRef}
                setActiveFile={setActiveFile}
                activeFile={activeFile}
              />
            </Suspense>
          </div>
        </GithubProvider>
      </FoldersProvider>
    </FunctionsProvider>
  );
}

export default App;
