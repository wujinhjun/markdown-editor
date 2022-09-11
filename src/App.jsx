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
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import fileDealer from "./utils/fileDealer";

// const app = window.require("@electron/remote").app;

// const Store = window.require("electron-store");

// mde options
const mdeOption = {
  minHeight: "495px",
  autofocus: true,
  //   lineNumbers: true,
  spellChecker: false,
  //   toolbar: false,
};

function App() {
  // import the files and tran it from arr to obj
  const [files, setFiles] = useState(window.myApp.getFilesData() || {});
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

  const savedLocation = useRef(null);
  const filesArr = tranObjToArr(files);
  const activeFile = files[activeID];

  window.myApp.getPath("documents").then((res) => {
    savedLocation.current = res;
  });

  const searchFiles = (keyWord) => {
    const newTempList = filesList.filter((item) =>
      item.title.includes(keyWord)
    );
    console.log(newTempList);
    setSearchFiles(newTempList);
  };

  // read
  const openFile = (fileID) => {
    setActiveID(fileID);
    const currentFile = files[fileID];
    const { id, title, path, isLoaded } = currentFile;
    if (!isLoaded) {
      fileDealer.readFile(path).then((value) => {
        const newFile = { ...files[fileID], body: value, isLoaded: true };
        setFiles({ ...files, [fileID]: newFile });
      });
    }

    if (!openedFilesID.includes(fileID)) {
      const newOpenedFilesID = [...openedFilesID, fileID];
      setOpenedFilesID(newOpenedFilesID);
      const newOpenedFiles = newOpenedFilesID.map((id) => {
        const tempFile = files[id];
        return { id: tempFile.id, title: tempFile.title };
      });
      setOpenedFiles(newOpenedFiles);
    }
    // const newOpenedFiles = [
    //   ...openedFiles,
    //   { id: fileID, title: files[fileID].title },
    // ];
    // const newOpenedFilesID = [...openedFilesID, fileID];
    // setOpenedFiles(newOpenedFiles);
    // setOpenedFilesID(newOpenedFilesID);
  };

  const closeFile = (fileID) => {
    const afterClose = openedFiles.filter((item) => item.id !== fileID);
    const afterCloseIDs = openedFilesID.filter((itemID) => itemID !== fileID);
    setOpenedFiles(afterClose);
    setOpenedFilesID(afterCloseIDs);
    if (fileID === activeID) {
      if (afterCloseIDs.length > 0) {
        setActiveID(afterCloseIDs[0]);
      } else {
        setActiveID("");
      }
    }
  };

  const fileActive = (fileID) => {
    setActiveID(fileID);
  };

  const deleteFile = (fileID) => {
    const { [fileID]: value, ...afterDelete } = files;
    setFiles(afterDelete);
    if (openedFilesID.includes(fileID)) {
      closeFile(fileID);
    }
  };

  //   update
  const renameFile = (fileID, title, theNew) => {
    const newPath = theNew
      ? window.myApp.joinPath(savedLocation.current, `${title}`)
      : window.myApp.joinPath(
          window.myApp.dirPath(files[fileID].path),
          `${title}`
        );
    // const newPath = window.myApp.joinPath(savedLocation.current, `${title}`);
    console.log(newPath);
    const modifiedFile = {
      ...files[fileID],
      title,
      isNew: false,
      path: newPath,
    };
    const newFiles = { ...files, [fileID]: modifiedFile };
    // console.log(theNew);
    if (theNew) {
      fileDealer.writeFile(newPath, files[fileID].body).then(() => {
        setFiles(newFiles);
        window.myApp.saveFilesData(newFiles);
      });
    } else {
      const oldPath = files[fileID].path;
      fileDealer.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles);
        window.myApp.saveFilesData(newFiles);
      });
    }
    // setFiles(newFiles);
  };

  //   create
  const createFile = () => {
    const newID = uuidv4();
    const newFile = {
      id: newID,
      title: "",
      body: "",
      isNew: true,
    };

    setFiles({ ...files, [newID]: newFile });
  };

  const importFile = () => {
    console.log("import");
    window.myApp.showDialog();
  };

  //   update
  const updateContent = (fileID, value) => {
    if (value !== files[fileID].body) {
      const newFile = { ...files[fileID], body: value };
      setFiles({ ...files, [fileID]: newFile });
      if (!unSavedFiles.includes(fileID)) {
        setUnSavedFiles([...unSavedFiles, fileID]);
      }
    }
  };

  const updateState = () => {
    const newOpenedFiles = filesList.filter((item) =>
      openedFilesID.includes(item.id)
    );
    setOpenedFiles(newOpenedFiles);
  };

  const filesList = searchedFiles.length > 0 ? searchedFiles : filesArr;

  useEffect(() => {
    updateState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div id="app">
      <div className="left-panel">
        <SearchFile searchFiles={searchFiles} />
        <FileList
          filesList={filesList}
          activeID={activeID}
          fileClick={openFile}
          fileRename={renameFile}
          fileDelete={deleteFile}
          fileCreate={createFile}
          fileImport={importFile}
        />
      </div>
      <div className="right-panel">
        <FileTable
          openFileList={openedFiles}
          unSavedFileList={unSavedFiles}
          activeID={activeID}
          fileClose={closeFile}
          fileActive={fileActive}
        />
        {openedFiles.length > 0 && (
          <SimpleMDE
            value={activeFile && activeFile.body}
            onChange={(value) => {
              updateContent(activeID, value);
            }}
            options={mdeOption}
          />
        )}
      </div>
    </div>
  );
}

export default App;
