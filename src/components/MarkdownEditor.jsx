import {
  MDXEditor,
  codeBlockPlugin,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useEffect } from "react";

const MarkdownEditor = ({ editorRef, setActiveFile }) => {
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

  return (
    <div className="mdx-wrapper" ref={editorRef} id="mdx-wrapper">
      <MDXEditor
        markdown={
          "## New Note\n\n```javascript\nconsole.log('Hello, World!');\n```"
        }
        plugins={[
          headingsPlugin(),
          quotePlugin({}),
          listsPlugin(),
          linkPlugin({}),
          markdownShortcutPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          thematicBreakPlugin(),
        ]}
        autoFocus
        contentEditableClassName="mdx-editor dark"
      />
    </div>
  );
};

export default MarkdownEditor;
