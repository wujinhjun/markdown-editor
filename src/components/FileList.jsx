import { useState, useEffect, useRef } from "react";

import useKeypress from "../hooks/useKeypress";
import useContextmenu from "../hooks/useContextmenu";
import useIpcRenderer from "../hooks/useIpcRenderer";

import "../style/FileList.scss";

import BottomButton from "./BottomButton";

import mdIcon from "../static/markdown.svg";
import addIcon from "../static/plus.svg";
import importIcon from "../static/import.svg";

import { getParentNode } from "../utils/Helpers";

const FileList = (props) => {
  const {
    filesList,
    activeID,
    fileClick,
    fileRename,
    fileDelete,
    fileCreate,
    fileImport,
  } = props;

  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");
  const node = useRef(null);
  //   listen key press
  const enterPress = useKeypress("Enter");
  const escPress = useKeypress("Escape");

  const closeInput = (item) => {
    setEditStatus(false);
    setValue("");
    if (item.isNew) {
      fileDelete(item.id);
    }
  };

  useEffect(() => {
    const editItem = filesList.find((item) => item.id === editStatus);
    if (enterPress && editStatus && value.trim() !== "") {
      const res = fileRename(editItem.id, value, editItem.isNew);
      if (res) {
        setValue("");
        setEditStatus(false);
      }
    }

    if (escPress && editStatus) {
      closeInput(editItem);
    }
  });

  useEffect(() => {
    const newFile = filesList.find((item) => item.isNew);
    if (newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [filesList]);

  useEffect(() => {
    if (editStatus) {
      node.current.focus();
    }
  }, [editStatus]);

  const clickElement = useContextmenu(".list-wrapper", [filesList]);

  useIpcRenderer({
    "open-file": () => {
      const parentElement = getParentNode(
        clickElement.current,
        "title-wrapper"
      );

      if (parentElement) {
        const { id } = parentElement.dataset;
        // console.log(id, title);
        fileClick(id);
      }
    },
    "rename-file": () => {
      const parentElement = getParentNode(
        clickElement.current,
        "title-wrapper"
      );

      if (parentElement) {
        const { id, title } = parentElement.dataset;
        setEditStatus(id);
        setValue(title);
      }
    },

    "delete-file": () => {
      const parentElement = getParentNode(
        clickElement.current,
        "title-wrapper"
      );

      if (parentElement) {
        const { id } = parentElement.dataset;
        fileDelete(id);
      }
    },
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
                data-id={id}
                data-title={title}
              >
                <img
                  src={mdIcon}
                  alt="markdown-icon"
                  className="markdown-icon"
                />
                {editStatus !== id && !item.isNew && (
                  <span className="title">{title}</span>
                )}
                {(editStatus === id || item.isNew) && (
                  <input
                    className="edit-title"
                    type="text"
                    value={value}
                    ref={node}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                )}
              </li>
            );
          })}
      </ul>
      <div className="bottom-button-wrapper">
        <BottomButton
          icon={addIcon}
          title="??????"
          color="assist1"
          operateFunc={fileCreate}
        />
        <BottomButton
          icon={importIcon}
          title="??????"
          color="assist2"
          operateFunc={fileImport}
        />
      </div>
    </>
  );
};

export default FileList;
