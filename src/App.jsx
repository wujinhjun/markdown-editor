// import react api
import { useState, useEffect } from "react";

// import components
import SearchFile from "./components/SearchFile";
import FileList from "./components/FileList";
import FileTable from "./components/FileTable";

// import style
import "./App.scss";

// import utils
import { flattenArrToObj, tranObjToArr } from "./utils/Helpers";
import { obj } from "./utils/object";

function App() {
  // import the files and tran it from arr to obj
  const [files, setFiles] = useState(flattenArrToObj(obj.data));
  //   opened files list
  const [openedFiles, setOpenedFiles] = useState([]);
  //   unsaved files list
  const [unSavedFiles, setUnSavedFiles] = useState([]);
  //   searched files list
  const [searchedFiles, setSearchFiles] = useState([]);
  //   set the activeID to display
  const [activeID, setActiveID] = useState(null);

  const filesList = tranObjToArr(files);

  const searchFile = (keyWord) => {
    const newTempList = filesList.filter((item) =>
      item.title.includes(keyWord)
    );
    setSearchFiles(newTempList);
  };

  const openFile = (fileID) => {
    const newOpenedFiles = [...openFile, files[fileID]];
    setOpenedFiles(newOpenedFiles);
  };
  const deleteFile = (fileID) => {
    console.log("delete");
  };

  return (
    <div id="app">
      <div className="left-panel">
        <SearchFile></SearchFile>
        <FileList filesList={filesList} activeID={activeID}></FileList>
      </div>
      <div className="right-panel">
        <FileTable openFileList={openedFiles} activeID={activeID}></FileTable>
      </div>
    </div>
  );
}

export default App;
