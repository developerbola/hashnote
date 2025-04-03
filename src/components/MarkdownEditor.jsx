import {
  MDXEditor,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useEffect, useRef } from "react";
import { useFunctions } from "../context/FunctionsProvider";
import { handleSaveToFile } from "../utils/handlers";

const MarkdownEditor = ({ editorRef, setActiveFile }) => {
  const { editorValue, setEditorValue, filePath } = useFunctions();
  const mdxEditorRef = useRef(null);
  const filePathRef = useRef(filePath);
  const editorValueRef = useRef(editorValue); // Ref for editorValue

  useEffect(() => {
    filePathRef.current = filePath;
    editorValueRef.current = editorValue; // Update editorValueRef when editorValue changes
  }, [filePath, editorValue]);

  let lastTriggerTime = 0;

  const exitAndSave = (e) => {
    const now = Date.now();
    if (e.deltaX < -20 && now - lastTriggerTime > 200) {
      setActiveFile(false);
      lastTriggerTime = now;
    }

    if (!filePathRef.current || filePathRef.current.trim() === "") {
      console.error("Error: filePath is empty or undefined.");
      return;
    }

    const content = editorValueRef.current;
    handleSaveToFile(filePathRef.current, content);
  };

  useEffect(() => {
    console.log(editorValue);
  }, [editorValue]);

  useEffect(() => {
    const wrapper = document.getElementById("mdx-wrapper");
    if (!wrapper) return;
    wrapper.addEventListener("wheel", exitAndSave);
    return () => wrapper.removeEventListener("wheel", exitAndSave);
  }, []);

  useEffect(() => {
    document.querySelectorAll("blockquote span").forEach((el) => {
      if (el.innerHTML.includes("Warning:")) {
        const blockquote = el.closest("blockquote");
        if (blockquote) {
          blockquote.style.borderColor = "#ffee00";
          blockquote.style.background = "#ffee0020";
        }
      }
      if (el.innerHTML.includes("Danger:")) {
        const blockquote = el.closest("blockquote");
        if (blockquote) {
          blockquote.style.borderColor = "#ff0059";
          blockquote.style.background = "#ff005920";
        }
      }
      if (el.innerHTML.includes("Success:")) {
        const blockquote = el.closest("blockquote");
        if (blockquote) {
          blockquote.style.borderColor = "#00ff3c";
          blockquote.style.background = "#00ff3c20";
        }
      }
      if (el.innerHTML.includes("Info:")) {
        const blockquote = el.closest("blockquote");
        if (blockquote) {
          blockquote.style.borderColor = "#00d8ff";
          blockquote.style.background = "#00d8ff20";
        }
      }
    });
    if (mdxEditorRef.current && mdxEditorRef.current.setMarkdown) {
      mdxEditorRef.current.setMarkdown(editorValue);
    }
  }, [editorValue]);

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
          listsPlugin(),
          linkPlugin({}),
          markdownShortcutPlugin(),
          thematicBreakPlugin(),
        ]}
        contentEditableClassName="mdx-editor"
        onChange={handleEditorChange}
        markdown={editorValue}
        spellCheck={false}
      />
    </div>
  );
};

export default MarkdownEditor;
