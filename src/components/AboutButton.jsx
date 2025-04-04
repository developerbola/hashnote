import { useEffect, useState } from "react";

const AboutButton = () => {
  const [isPageVisible, setIsPageVisible] = useState(false);

  let lastTriggerTime = 0;

  const exitAndSave = (e) => {
    const now = Date.now();
    if (e.deltaX < -20 && now - lastTriggerTime > 200) {
      setIsPageVisible(false);
      lastTriggerTime = now;
    }
  };

  useEffect(() => {
    const page = document.getElementById("about-page");
    if (!page) return;
    page.addEventListener("wheel", exitAndSave);
    return () => page.removeEventListener("wheel", exitAndSave);
  }, []);
  return (
    <>
      <div className="about">
        <button
          className="about-btn"
          onClick={() => setIsPageVisible(!isPageVisible)}
        >
          <img src="./svg_icons/about.svg" height={20} width={20} />
        </button>
        <AboutPage isPageVisible={isPageVisible} />
      </div>
    </>
  );
};

export default AboutButton;

const AboutPage = ({ isPageVisible }) => {
  return (
    <div
      className={`about-page ${isPageVisible ? "visible" : ""}`}
      id="about-page"
    >
      <div className="start section">
        <div className="title">
          <h1>Hashnote</h1>
          <img src="./svg_icons/icon.svg" height={45} width={45} />
        </div>
        <p>
          Hashnote - a minimal and powerful productivity app designed for
          developers. Also non developers can use {":)"}
        </p>
        <p>
          It visualizes your daily GitHub activity with an interactive heatmap
          while allowing you to take notes, build habits, and save code snippets
          with a powerful editor. Organized into Notes, Habits, and Codes
          sections.
        </p>
        <p>
          Hashnote helps you stay on top of your workflow with a sleek,
          developer-friendly interface. 🚀
        </p>

        <p style={{ marginTop: "auto" }}>Scroll down</p>
      </div>
      <div className="guides section">
        <div className="title" style={{ gap: 10 }}>
          <h1>Editor using guides</h1>
          <img
            src="./svg_icons/guides.svg"
            height={50}
            width={30}
            style={{ height: 30, width: 30, opacity: 0.9 }}
          />
        </div>
        <div className="actions-list">
          <div className="action">
            <div>
              <h3>Dynamic back</h3>
            </div>
            <div className="option">
              <p>
                You can navigate back to the home screen by swiping left with
                two fingers. This feature is available both here and in the
                editor.
              </p>
            </div>
            <div className="option">
              <p>
                Additionally, in the settings panel, your username and token are
                automatically saved when you click the close button (×).
              </p>
            </div>
            <div className="option">
              <p>
                These features are designed to keep the interface clean and
                minimal.
              </p>
            </div>
          </div>

          <div className="action">
            <div>
              <h3>Double enter</h3>
            </div>
            <div className="option">
              <p>
                To remove list markers or checkboxes in the editor, simply press
                Enter twice to skip these actions.
              </p>
            </div>
          </div>
          <div className="action" style={{ marginBottom: 10 }}>
            <div>
              <h3>File Name as Title</h3>
            </div>
            <div className="option">
              <p>
                Rename your file by updating its title inside{" "}
                <span># My hash notes</span>. The new title will be applied as
                the file name when you exit.
              </p>
            </div>
          </div>

          <div className="action headings">
            <div>
              <h3>
                Headings <span>#</span>
              </h3>
            </div>
            <div className="option">
              <span># ...</span> - <h1>Heading 1</h1>
            </div>
            <div className="option">
              <span>## ...</span> - <h2>Heading 2</h2>
            </div>
            <div className="option">
              <span>### ...</span> - <h3>Heading 3</h3>
            </div>
            <div className="option">
              <span>#### ...</span> - <h4>Heading 4</h4>
            </div>
            <div className="option">
              <span>##### ...</span> - <h5>Heading 5</h5>
            </div>
            <div className="option">
              <span>###### ...</span> - <h5>Heading 6</h5>
            </div>
          </div>
          <div className="action">
            <div>
              <h3>
                Block quotes <span>{">"}</span>
              </h3>
            </div>
            <div className="option">
              <blockquote style={{ width: "100%" }}>
                <span>{">"} ...</span> - Block quote
              </blockquote>
            </div>
          </div>
          <div className="action">
            <div>
              <h3>
                Lists <span>{"1."}</span> & <span>{"-"}</span>
              </h3>
            </div>
            <div className="option lists">
              <li>
                <span>{"1."} ...</span> - Ordered
              </li>
              <li>
                <span>{"2."} ...</span> - lists
              </li>
              <li>
                <span>{"-"} ...</span> - Unordered
              </li>
              <li>
                <span>{"*"} ...</span> - lists
              </li>
            </div>
          </div>
          <div className="action">
            <div>
              <h3>
                Text styles <span>{"**"}</span> and <span>{"_"}</span>
              </h3>
            </div>
            <div className="option">
              <span>
                {"**"}...{"**"}
              </span>{" "}
              - <strong style={{ fontWeight: "bold" }}>Bold</strong>
            </div>
            <div className="option">
              <span>
                {"_"}...{"_"}
              </span>{" "}
              - <em>Italic</em>
            </div>
          </div>
          <div className="action">
            <div>
              <h3>
                Checkbox <span>{"[x]"}</span>
              </h3>
            </div>
            <div className="option">
              <span>[x]</span> - Checked{" "}
              <input type="checkbox" className="checkbox" defaultChecked />
            </div>
            <div className="option">
              <span>[ ]</span> - Unchecked{" "}
              <input type="checkbox" className="checkbox" />
            </div>
          </div>
          <div className="action">
            <div>
              <h3>
                Inline code <span>{"`...`"}</span>
              </h3>
            </div>
            <div className="option">
              <span style={{ fontFamily: "JetBrains" }}>
                some inline code here
              </span>{" "}
              - `some inline code here`
            </div>
          </div>
        </div>
      </div>
      <div className="privacy section">
        <div className="title" style={{ gap: 10 }}>
          <h1>Privacy</h1>
          <img
            src="./svg_icons/privacy.svg"
            height={50}
            width={30}
            style={{ height: 30, width: 30, opacity: 0.9 }}
          />
        </div>
        <div className="action-list">
          <div className="action">
            <div>
              <h3> Data Storage & Security</h3>
            </div>
            <div className="option">
              <p>This app does not store any data on external servers.</p>
              <p>
                All user data, including your GitHub username, token, and notes,
                is stored locally on your device in{" "}
                <samp style={{ fontFamily: "JetBrains" }}>~/.hashnote/</samp>.
              </p>
              <p>
                We do not collect, share, or transmit your data to any third
                party.
              </p>
            </div>
          </div>
          <div className="action">
            <div>
              <h3> Access & Permissions</h3>
            </div>
            <div className="option">
              <p>
                The app only accesses local files required for storing your
                settings and notes.
              </p>
              <p>
                No internet connection is required, except for GitHub API
                interactions if configured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
