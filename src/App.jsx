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

// import third-party libraries
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

// mde options
const mdeOption = {
  minHeight: "495px",
  //   lineNumbers: true,
  spellChecker: false,
  //   toolbar: false,
};

function App() {
  // import the files and tran it from arr to obj
  const [files, setFiles] = useState(flattenArrToObj(obj.data));
  //   opened files list
  //   data structure: [{id, title}, {id, title}]
  const [openedFiles, setOpenedFiles] = useState([]);
  const [openedFilesID, setOpenedFilesID] = useState([]);
  //   unsaved files list
  //   data structure[id]
  const [unSavedFiles, setUnSavedFiles] = useState([]);
  //   searched files list
  const [searchedFiles, setSearchFiles] = useState([]);
  //   set the activeID to display
  const [activeID, setActiveID] = useState(0);
  //    set the editor value
  const [textValue, setTextValue] = useState("");

  const filesArr = tranObjToArr(files);
  const activeFile = files[activeID];

  const searchFiles = (keyWord) => {
    const newTempList = filesList.filter((item) =>
      item.title.includes(keyWord)
    );
    console.log(newTempList);
    setSearchFiles(newTempList);
  };

  const openFile = (fileID) => {
    setActiveID(fileID);
    if (openedFilesID.includes(fileID)) {
      return;
    }
    const newOpenedFiles = [
      ...openedFiles,
      { id: fileID, title: files[fileID].title },
    ];
    const newOpenedFilesID = [...openedFilesID, fileID];
    setOpenedFiles(newOpenedFiles);
    setOpenedFilesID(newOpenedFilesID);
  };

  const closeFile = (fileID) => {
    const afterClose = openedFiles.filter((item) => item.id !== fileID);
    const afterCloseIDs = openedFilesID.filter((itemID) => itemID !== fileID);
    setOpenedFiles(afterClose);
    setOpenedFilesID(afterCloseIDs);
    console.log(afterClose);
    console.log(afterCloseIDs);
    // setActiveID(afterCloseIDs[0]);
    // console.log(fileID === activeID);
    // if (fileID === activeID) {
    //   console.log(fileID);
    if (fileID === activeID) {
      setActiveID(afterCloseIDs[0]);
    }
    // if (afterCloseIDs.length > 0) {
    //   //   console.log(afterCloseIDs);
    //   // console.log(afterClose[0]);
    //   //   setActiveID(1);
    //   setActiveID(afterCloseIDs[0]);
    //   // setActiveID(fileID - 1);
    // } else {
    //   setActiveID("");
    // }
    // }
  };

  const fileActive = (fileID) => {
    setActiveID(fileID);
  };

  const deleteFile = (fileID) => {
    console.log("delete");
  };

  const filesList = searchedFiles.length > 0 ? searchedFiles : filesArr;

  return (
    <div id="app">
      <div className="left-panel">
        <SearchFile searchFiles={searchFiles}></SearchFile>
        <FileList
          filesList={filesList}
          activeID={activeID}
          fileClick={openFile}
        ></FileList>
      </div>
      <div className="right-panel">
        <FileTable
          openFileList={openedFiles}
          unSavedFileList={unSavedFiles}
          activeID={activeID}
          fileClose={closeFile}
          fileActive={fileActive}
        ></FileTable>
        {openedFiles.length > 0 && (
          <SimpleMDE value="hello" options={mdeOption} />
        )}
      </div>
    </div>
  );
}

export default App;
