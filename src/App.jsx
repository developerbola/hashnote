import { useEffect, useRef, useState } from "react";
import Topbar from "./components/Topbar";
import Bottombar from "./components/Bottombar";
import MarkdownEditor from "./components/MarkdownEditor";

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
      }, 200);
    }
  }, [activeFile]);

  const readToken = () => {
    try {
      const fs = window.require("fs");
      const path = window.require("path");
      const os = window.require("os");

      // Get home directory
      const homeDir = os.homedir();
      const filePath = path.join(homeDir, ".hashnote", "token.txt");

      // Check if token file exists
      if (fs.existsSync(filePath)) {
        const token = fs.readFileSync(filePath, "utf-8");
        console.log("Token read successfully:", token);
        return token;
      } else {
        console.warn("Token file does not exist.");
        return "";
      }
    } catch (e) {
      console.error("Error reading token:", e);
      return "";
    }
  };
  const readUsername = () => {
    try {
      const fs = window.require("fs");
      const path = window.require("path");
      const os = window.require("os");

      // Get home directory
      const homeDir = os.homedir();
      const filePath = path.join(homeDir, ".hashnote", "username.txt");

      // Check if token file exists
      if (fs.existsSync(filePath)) {
        const username = fs.readFileSync(filePath, "utf-8");
        console.log("Username read successfully:", username);
        return username;
      } else {
        console.warn("Username file does not exist.");
        return "";
      }
    } catch (e) {
      console.error("Error reading username:", e);
      return "";
    }
  };
  const [token, setToken] = useState(readToken());
  const [username, setUsername] = useState(readUsername());

  return (
    <>
      <div className="drag-place"></div>
      <div className="container">
        <div className="wrapper">
          <Topbar
            token={token}
            setToken={setToken}
            username={username}
            setUsername={setUsername}
          />
          <Bottombar
            setActiveFile={setActiveFile}
            ref={bottomRef}
            token={token}
            username={username}
          />
          <MarkdownEditor editorRef={editorRef} setActiveFile={setActiveFile} />
        </div>
      </div>
    </>
  );
}

export default App;
