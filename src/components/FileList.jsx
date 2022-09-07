import "./FileList.scss";

import BottomButton from "./BottomButton";

import mdIcon from "../static/markdown.svg";
import addIcon from "../static/plus.svg";
import importIcon from "../static/import.svg";

const FileList = (props) => {
  const { filesList, activeID, fileClick } = props;
  return (
    <>
      <ul className="list-wrapper">
        {filesList &&
          filesList.map((item) => {
            return (
              <li
                key={item.id}
                className={
                  item.id === activeID
                    ? "title-wrapper active"
                    : "title-wrapper"
                }
                onClick={() => {
                  fileClick(item.id);
                }}
              >
                <img
                  src={mdIcon}
                  alt="markdown-icon"
                  className="markdown-icon"
                />
                <span className="title">{item.title}</span>
              </li>
            );
          })}
      </ul>
      <div className="bottom-button-wrapper">
        <BottomButton
          icon={addIcon}
          title="新建"
          color="assist1"
        ></BottomButton>
        <BottomButton
          icon={importIcon}
          title="导入"
          color="assist2"
        ></BottomButton>
      </div>
    </>
  );
};

export default FileList;
