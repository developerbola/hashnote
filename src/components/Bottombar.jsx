import ShowCase from "./ShowCase";

const Bottombar = ({ setActiveFile }) => {
  return (
    <div className={"bottom-bar"}>
      <ShowCase setActiveFile={setActiveFile} />
    </div>
  );
};

export default Bottombar;
