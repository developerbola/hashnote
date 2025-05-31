import {
  MDXEditor,
  headingsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  listsPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useEffect, useRef } from "react";
import { useFunctions } from "../context/FunctionsProvider";
import { useFolders } from "../context/FoldersProvider";
import { handleRenameFile, handleSaveToFile } from "../utils/handlers";

const MarkdownEditor = ({ editorRef, setActiveFile, activeFile }) => {
  const { editorValue, setEditorValue, filePath } = useFunctions();
  const { loadFilesFromDisk } = useFolders();
  const mdxEditorRef = useRef(null);
  const filePathRef = useRef(filePath);
  const editorValueRef = useRef(editorValue);
  const lastTriggerTimeRef = useRef(0);

  useEffect(() => {
    filePathRef.current = filePath;
  }, [filePath]);

  useEffect(() => {
    editorValueRef.current = editorValue;
    if (mdxEditorRef.current && mdxEditorRef.current.setMarkdown) {
      mdxEditorRef.current.setMarkdown(editorValue);
    }
    mdxEditorRef.current.setMarkdown(editorValue);
  }, [editorValue]);

  const exitAndSave = async (e) => {
    const now = Date.now();

    if (e.deltaX < -20 && now - lastTriggerTimeRef.current > 500) {
      setActiveFile(false);
      lastTriggerTimeRef.current = now;
    } else {
      return;
    }
    if (!filePathRef.current || filePathRef.current.trim() === "") {
      console.error("Error: filePath is empty or undefined.");
      return;
    }

    const content = editorValueRef.current;
    const titleMatch = content.match(/^# (.+)/m);

    if (!titleMatch) {
      console.error("Error: No title found in the file.");
      return;
    }

    const title = titleMatch[1].trim();
    const currentFileName = filePathRef.current.split("/").pop().split(".")[0];
    const newFileName = title.replace(/\s+/g, "-") + ".md";

    if (title !== currentFileName) {
      try {
        const newFilePath = await handleRenameFile(
          filePathRef.current,
          newFileName,
          loadFilesFromDisk
        );
        filePathRef.current = newFilePath;
      } catch (err) {
        console.error("Rename failed:", err);
        return;
      }
    }

    // Now save to the new file path
    handleSaveToFile(filePathRef.current, content);
  };

  useEffect(() => {
    const wrapper = document.getElementById("mdx-wrapper");

    if (!wrapper) return;
    wrapper.addEventListener("wheel", exitAndSave);
    return () => wrapper.removeEventListener("wheel", exitAndSave);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const blockquotes = document.querySelectorAll(".mdx-editor blockquote");

      blockquotes.forEach((el) => {
        const text = el.innerText;

        if (text.includes("??")) {
          el.style.borderLeft = "2px solid #ff3b3b";
          el.style.background = "#ff3b3b20";
        } else if (text.includes("!!")) {
          el.style.borderLeft = "2px solid #ffc107";
          el.style.background = "#ffc10720";
        } else if (text.includes("::")) {
          el.style.borderLeft = "2px solid #17b832";
          el.style.background = "#17b83220";
        }
      });
    });

    const target = document.querySelector(".mdx-editor");

    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [activeFile]);

  const handleEditorChange = (newValue) => {
    if (newValue !== editorValue) {
      setEditorValue(newValue);
    }
  };

  return (
    <div className="mdx-wrapper" ref={editorRef} id="mdx-wrapper">
      <MDXEditor
        ref={mdxEditorRef}
        plugins={[
          headingsPlugin(),
          quotePlugin({}),
          markdownShortcutPlugin(),
          thematicBreakPlugin(),
          listsPlugin(),
        ]}
        contentEditableClassName="mdx-editor"
        onChange={handleEditorChange}
        markdown={editorValue}
        contentEditableProps={{ spellCheck: false }}
      />
    </div>
  );
};

export default MarkdownEditor;
