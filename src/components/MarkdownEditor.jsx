import {
  MDXEditor,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const MarkdownEditor = ({ editorRef, setActiveFile }) => {
  return (
    <div
      className="mdx-wrapper"
      ref={editorRef}
    >
      <button
        onClick={() => {
          setActiveFile(false);
        }}
        className="back-button"
      >
        <img
          src="./svg_icons/back.svg"
          height={15}
          width={15}
          style={{ filter: "invert(1)" }}
        />
        Back
      </button>
      <MDXEditor
        markdown="## New file"
        plugins={[
          headingsPlugin(),
          quotePlugin({}),
          listsPlugin(),
          linkPlugin({}),
          linkDialogPlugin(),
          markdownShortcutPlugin(),
        ]}
        autoFocus
        contentEditableClassName="mdx-editor"
      />
    </div>
  );
};

export default MarkdownEditor;
