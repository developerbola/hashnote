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
import { useFolders } from "../context/FoldersProvider";
import { handleRenameFile, handleSaveToFile } from "../utils/handlers";

const MarkdownEditor = ({ editorRef, setActiveFile }) => {
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
  }, [editorValue]);

  const exitAndSave = (e) => {
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
    const nameOfFileBasedTitleMatch = content.match(/^# (.+)/m);

    if (!nameOfFileBasedTitleMatch) {
      console.error("Error: No title found in the file.");
      return;
    }

    const nameOfFileBasedTitle = nameOfFileBasedTitleMatch[1].trim();
    const currentFileName = filePathRef.current.split("/").pop().split(".")[0]; // Get the actual filename

    const newFileName = nameOfFileBasedTitle.replace(/\s+/g, "-") + ".txt";

    if (nameOfFileBasedTitle !== currentFileName) {
      handleRenameFile(filePathRef.current, newFileName, loadFilesFromDisk);
    }

    handleSaveToFile(filePathRef.current, content);
  };

  useEffect(() => {
    const wrapper = document.getElementById("mdx-wrapper");
    if (!wrapper) return;
    wrapper.addEventListener("wheel", exitAndSave);
    return () => wrapper.removeEventListener("wheel", exitAndSave);
  }, []);

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
