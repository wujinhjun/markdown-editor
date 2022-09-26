import classNames from "classnames";
import "./FileTable.scss";

const FileTable = (props) => {
  const { openFileList, unSavedFileList, activeID, fileClose, fileActive } =
    props;
  return (
    <ul className="file-tables">
      {openFileList &&
        openFileList.map((item) => {
          const { id, title } = item;
          const tableDisplay = classNames("file-table", {
            active: activeID === id,
          });
          const iconDisplay = classNames("icon", {
            save: unSavedFileList.includes(id),
          });
          return (
            <li
              key={id}
              className={tableDisplay}
              onClick={() => fileActive(id)}
            >
              <span className="file-title">{title}</span>
              <div
                className={iconDisplay}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fileClose(id);
                }}
              ></div>
            </li>
          );
        })}
    </ul>
  );
};

export default FileTable;
