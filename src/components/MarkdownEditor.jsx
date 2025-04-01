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

    if (e.deltaX < -50 && now - lastTriggerTime > 500) {
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
    document.querySelectorAll(".mdx-editor blockquote span").forEach((el) => {
      if (el.innerHTML.includes("Warn:")) {
        const blockquote = el.closest("blockquote");
        if (blockquote) {
          blockquote.style.borderColor = " #ffee00";
          blockquote.style.background = "#ffee0020";
        }
      }
      if (el.innerHTML.includes("Alert:")) {
        const blockquote = el.closest("blockquote");
        if (blockquote) {
          blockquote.style.borderColor = " #ff0059";
          blockquote.style.background = "#ff005920";
        }
      }
      if (el.innerHTML.includes("Success:")) {
        const blockquote = el.closest("blockquote");
        if (blockquote) {
          blockquote.style.borderColor = " #00ff3c";
          blockquote.style.background = "#00ff3c20";
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
      />
    </div>
  );
};

export default MarkdownEditor;
