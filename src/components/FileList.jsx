import { useState, useEffect, useRef } from "react";

import useKeypress from "../hooks/useKeypress";

import "./FileList.scss";

import BottomButton from "./BottomButton";

import mdIcon from "../static/markdown.svg";
import addIcon from "../static/plus.svg";
import importIcon from "../static/import.svg";

const FileList = (props) => {
  const { filesList, activeID, fileClick, fileRename, fileDelete } = props;

  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");
  const node = useRef(null);
  //   listen key press
  const enterPress = useKeypress(13);
  const escPress = useKeypress(27);

  const closeInput = (item) => {
    setEditStatus(false);
    setValue("");
  };

  useEffect(() => {
    const editItem = filesList.find((item) => item.id === editStatus);
    if (enterPress && editStatus && value.trim()) {
      fileRename(editItem.id, value);
      setValue("");
      setEditStatus(false);
    }

    if (escPress && editStatus) {
      closeInput(editItem);
    }
  });

  useEffect(() => {
    if (editStatus) {
      node.current.focus();
    }
  });
  return (
    <>
      <ul className="list-wrapper">
        {filesList &&
          filesList.map((item) => {
            const { id, title } = item;
            return (
              <li
                key={id}
                className={
                  item.id === activeID
                    ? "title-wrapper active"
                    : "title-wrapper"
                }
                onClick={() => {
                  fileClick(id);
                }}
              >
                <img
                  src={mdIcon}
                  alt="markdown-icon"
                  className="markdown-icon"
                />
                {editStatus !== id && (
                  <>
                    <span className="title">{title}</span>

                    <div className="tempCon">
                      <span
                        className="temp"
                        onClick={(e) => {
                          //   console.log(e);
                          e.preventDefault();
                          e.stopPropagation();
                          setEditStatus(id);
                          setValue(title);
                        }}
                      >
                        {"R"}
                      </span>

                      <span
                        className="temp"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileDelete(id);
                        }}
                      >
                        {"X"}
                      </span>
                    </div>
                  </>
                )}
                {editStatus === id && (
                  <input
                    className="edit-title"
                    type="text"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    ref={node}
                  />
                )}
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
