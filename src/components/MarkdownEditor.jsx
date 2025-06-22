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

    if (e.deltaX < -50 && now - lastTriggerTimeRef.current > 500) {
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
    setTimeout(() => {
      const blockquotes = document.querySelectorAll(".mdx-editor blockquote");
      blockquotes.forEach((el) => {
        const text = el.innerText;
        const codeSpan = el.querySelector("code span");

        if (text.startsWith("?? ")) {
          el.classList.add("red");
          if (codeSpan.innerText === "??") {
            codeSpan.classList.add("red");
          }
        } else if (text.startsWith("!! ")) {
          el.classList.add("yellow");
          if (codeSpan.innerText === "!!") {
            codeSpan.classList.add("yellow");
          }
        } else if (text.startsWith(":: ")) {
          el.classList.add("green");
          if (codeSpan.innerText === "::") {
            codeSpan.classList.add("green");
          }
        }
      });

      const codeSpan = document.querySelectorAll(".mdx-editor code span");
      codeSpan.forEach((el) => {
        const text = el.innerText;
        console.log(el);

        if (text.startsWith("?? ")) {
          el.classList.add("red");
        } else if (text.startsWith("!! ")) {
          el.classList.add("yellow");
        } else if (text.startsWith(":: ")) {
          el.classList.add("green");
        }
      });
    }, 100);
  }, [activeFile, editorValue]);

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
