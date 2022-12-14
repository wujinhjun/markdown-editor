// import react api
import { useState, useRef } from "react";

// import components
import SearchFile from "./components/SearchFile";
import FileList from "./components/FileList";
import FileTable from "./components/FileTable";

// import style
import "./App.scss";

// import utils
import { flattenArrToObj, tranObjToArr } from "./utils/Helpers";
import useIpcRenderer from "./hooks/useIpcRenderer";

// import third-party libraries
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { v4 as uuidv4 } from "uuid";
import fileDealer from "./utils/fileDealer";

// mde options
const mdeOption = {
  minHeight: "450px",
  autofocus: true,
  //   lineNumbers: true,
  spellChecker: false,
  //   toolbar: false,
};

function App() {
  // import the files and tran it from arr to obj
  const [files, setFiles] = useState(window.myApp.getFilesData() || {});
  //   opened files list
  const [openedFilesID, setOpenedFilesID] = useState([]);
  //   unsaved files list
  //   data structure[id]
  const [unSavedFiles, setUnSavedFiles] = useState([]);
  //   searched files list
  const [searchedFiles, setSearchFiles] = useState([]);
  //   set the active file to display
  const [activeFileID, setActiveFileID] = useState(0);

  const savedLocation = useRef(null);

  const filesArr = tranObjToArr(files);
  const activeFile = useRef(null);
  activeFile.current = files[activeFileID];
  const openedFiles = openedFilesID.map((id) => {
    return { id: id, title: files[id].title };
  });

  //   by preload.js to use the app.getPath("documents")
  window.myApp.getPath("documents").then((res) => {
    savedLocation.current = res;
  });

  const savedPath = window.myApp.getSavedPath() || savedLocation.current;

  //   search files
  const searchFiles = (keyWord) => {
    const newTempList = filesList.filter((item) =>
      item.title.includes(keyWord)
    );
    console.log(newTempList);
    setSearchFiles(newTempList);
  };

  const fileActive = (fileID) => {
    setActiveFileID(fileID);
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

  // read file by click
  const openFile = (fileID) => {
    setActiveFileID(fileID);
    const currentFile = files[fileID];
    const { path, isLoaded } = currentFile;
    if (!isLoaded) {
      fileDealer.readFile(path).then((value) => {
        const newFile = { ...files[fileID], body: value, isLoaded: true };
        setFiles({ ...files, [fileID]: newFile });
      });
    }

    if (!openedFilesID.includes(fileID)) {
      const newOpenedFilesID = [...openedFilesID, fileID];
      setOpenedFilesID(newOpenedFilesID);
    }
  };

  //   update
  const renameFile = (fileID, title, theNew) => {
    const temp = filesArr.filter((item) => item.title === title);
    if (temp.length !== 0 && fileID !== temp?.id) {
      window.myApp.showRenameErrorBox();
      return false;
    }
    const newPath = theNew
      ? window.myApp.joinPath(savedPath, `${title}`)
      : window.myApp.joinPath(
          window.myApp.dirPath(files[fileID].path),
          `${title}`
        );
    const modifiedFile = {
      ...files[fileID],
      title,
      isNew: false,
      path: newPath,
    };
    const newFiles = { ...files, [fileID]: modifiedFile };
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

    return true;
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

  const saveContent = () => {
    if (activeFile.current) {
      const { id, path, body } = activeFile.current;
      fileDealer.writeFile(path, body).then(() => {
        if (!unSavedFiles.filter((fileID) => fileID !== id)) {
          setUnSavedFiles(unSavedFiles.filter((fileID) => fileID !== id));
        } else {
          setUnSavedFiles([]);
        }
      });
    }
  };

  //   close file
  const closeFile = (fileID) => {
    const afterCloseIDs = openedFilesID.filter((itemID) => itemID !== fileID);
    setOpenedFilesID(afterCloseIDs);

    if (unSavedFiles.includes(fileID)) {
      window.myApp.showSaveBox().then((res) => {
        if (res.response === 1) {
          saveContent();
          if (fileID === activeFileID) {
            if (afterCloseIDs.length > 0) {
              setActiveFileID(afterCloseIDs[0]);
            } else {
              setActiveFileID("");
            }
          }
        } else if (res.response === 0) {
          setUnSavedFiles(
            unSavedFiles.filter((id) => id !== activeFile.current.id)
          );
          if (fileID === activeFileID) {
            if (afterCloseIDs.length > 0) {
              setActiveFileID(afterCloseIDs[0]);
            } else {
              setActiveFileID("");
            }
          }
        }
      });
    } else {
      if (fileID === activeFileID) {
        if (afterCloseIDs.length > 0) {
          setActiveFileID(afterCloseIDs[0]);
        } else {
          setActiveFileID("");
        }
      }
    }
  };

  //   deleteFile
  const deleteFile = (fileID) => {
    const { path } = files[fileID];
    const { [fileID]: value, ...afterDelete } = files;
    setFiles(afterDelete);
    window.myApp.saveFilesData(afterDelete);
    window.myApp.deleteFile(path);
    if (openedFilesID.includes(fileID)) {
      closeFile(fileID);
    }
  };

  const importFile = () => {
    window.myApp.showImportDialog().then((res) => {
      const filePaths = res.filePaths;
      if (Array.isArray(filePaths)) {
        const filteredPaths = filePaths.filter((path) => {
          const alreadyAdded = Object.values(files).find((file) => {
            return file.path === path;
          });
          return !alreadyAdded;
        });

        const importFilesArray = filteredPaths.map((path) => {
          return {
            id: uuidv4(),
            title: window.myApp.basePath(path),
            path: path,
          };
        });

        const newFiles = { ...files, ...flattenArrToObj(importFilesArray) };
        setFiles(newFiles);
        window.myApp.saveFilesData(newFiles);

        if (importFilesArray.length > 0) {
          window.myApp.showMessageBox(importFilesArray.length);
        } else {
          window.myApp.showErrorBox();
        }
      }
    });
  };

  const filesList = searchedFiles.length > 0 ? searchedFiles : filesArr;

  useIpcRenderer({
    "create-new-file": createFile,
    "save-edit-file": saveContent,
    "import-file": importFile,
    "close-file": () => closeFile(activeFileID),
    "open-setting-window": window.myApp.openSettingWindowIPC,
  });

  return (
    <div id="app">
      <div className="left-panel">
        <SearchFile searchFiles={searchFiles} />
        <FileList
          filesList={filesList}
          activeID={activeFileID}
          fileClick={openFile}
          fileRename={renameFile}
          fileDelete={deleteFile}
          fileCreate={createFile}
          fileImport={importFile}
        />
      </div>
      <div className="right-panel">
        {openedFiles.length > 0 && (
          <>
            <FileTable
              openFileList={openedFiles}
              unSavedFileList={unSavedFiles}
              activeID={activeFileID}
              fileClose={closeFile}
              fileActive={fileActive}
            />
            <SimpleMDE
              value={activeFile.current && activeFile.current.body}
              onChange={(value) => {
                updateContent(activeFileID, value);
              }}
              options={mdeOption}
            />
          </>
        )}
        {!openedFiles.length > 0 && (
          <div className="new-file-tips">?????????????????????</div>
        )}
      </div>
    </div>
  );
}

export default App;
