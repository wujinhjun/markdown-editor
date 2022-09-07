import classNames from "classnames";
import "./FileTable.scss";

const FileTable = (props) => {
  // props:{[{id, saved}], activeID}
  const { openFileList, unSavedFileList, activeID, fileClose } = props;
  //   console.log(openFileList);
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
            <li key={id} className={tableDisplay}>
              <span className="file-title">{title}</span>
              <div className={iconDisplay} onClick={() => fileClose(id)}></div>
            </li>
          );
        })}
    </ul>
  );
};

export default FileTable;
