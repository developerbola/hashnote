import { useEffect, useState } from "react";

const AboutButton = () => {
  const [isPageVisible, setIsPageVisible] = useState(false);

  let lastTriggerTime = 0;

  const handleWheel = (e) => {
    const now = Date.now();

    if (e.deltaX < -30 && now - lastTriggerTime > 500) {
      setIsPageVisible(false);
      lastTriggerTime = now;
    }
  };

  useEffect(() => {
    const page = document.getElementById("about-page");
    if (!page) return;
    page.addEventListener("wheel", handleWheel);
    return () => page.removeEventListener("wheel", handleWheel);
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
          <img src="./icon.icns" height={50} width={50} />
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
                <span>{">"} ...</span> - Basic
              </blockquote>
            </div>
            <div className="option">
              <blockquote style={{ width: "100%" }}>
                <span>{">"} Success: ...</span> - Success Message
              </blockquote>
            </div>
            <div className="option">
              <blockquote style={{ width: "100%" }}>
                <span>{">"} Info: ...</span> - Informational Message
              </blockquote>
            </div>
            <div className="option">
              <blockquote style={{ width: "100%" }}>
                <span>{">"} Warning: ...</span> - Caution / Warning Message
              </blockquote>
            </div>
            <div className="option">
              <blockquote style={{ width: "100%" }}>
                <span>{">"} Danger: ...</span> - Error / Critical Issue
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
    </div>
  );
};
