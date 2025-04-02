import {
  MDXEditor,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useEffect, useState } from "react";

const MarkdownEditor = ({ editorRef, setActiveFile }) => {
  const [editorValue, setEditorValue] = useState("## New Note");
  let lastTriggerTime = 0;

  const handleWheel = (e) => {
    const now = Date.now();
    if (e.deltaX < -20 && now - lastTriggerTime > 200) {
      setActiveFile(false);
      lastTriggerTime = now;
    }
  };

  useEffect(() => {
    const wrapper = document.getElementById("mdx-wrapper");
    if (!wrapper) return;
    wrapper.addEventListener("wheel", handleWheel);
    return () => wrapper.removeEventListener("wheel", handleWheel);
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
  }, [editorValue]);

  return (
    <div className="mdx-wrapper" ref={editorRef} id="mdx-wrapper">
      <MDXEditor
        plugins={[
          headingsPlugin(),
          quotePlugin({}),
          listsPlugin(),
          linkPlugin({}),
          markdownShortcutPlugin(),
        ]}
        contentEditableClassName="mdx-editor"
        onChange={(e) => {
          setEditorValue(e);
        }}
        markdown={editorValue}
        spellCheck={false}
      />
    </div>
  );
};

export default MarkdownEditor;
