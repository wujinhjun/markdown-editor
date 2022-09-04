import "./FileList.scss";

import BottomButton from "./BottomButton";

import mdIcon from "../static/markdown.svg";
import addIcon from "../static/plus.svg";
import importIcon from "../static/import.svg";

const FileList = (props) => {
  return (
    <>
      <ul className="list-wrapper">
        <li className="title-wrapper">
          <img src={mdIcon} alt="markdown-icon" className="markdown-icon" />
          <span className="title">hello</span>
        </li>
        <li className="title-wrapper">
          <img src={mdIcon} alt="markdown-icon" className="markdown-icon" />
          <span className="title">hello</span>
        </li>
        <li className="title-wrapper active">
          <img src={mdIcon} alt="markdown-icon" className="markdown-icon" />
          <span className="title">hello</span>
        </li>
        <li className="title-wrapper">
          <img src={mdIcon} alt="markdown-icon" className="markdown-icon" />
          <span className="title">hello</span>
        </li>
        <li className="title-wrapper">
          <img src={mdIcon} alt="markdown-icon" className="markdown-icon" />
          <span className="title">hello</span>
        </li>
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
