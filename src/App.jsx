// import react api
import { useState, useEffect, useRef } from "react";

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
  //   set the active file to display
  const [activeFileID, setActiveFileID] = useState(0);

  const savedLocation = useRef(null);

  const filesArr = tranObjToArr(files);
  const activeFile = useRef(null);
  activeFile.current = files[activeFileID];
  //   console.log(activeFile);

  //   by preload.js to use the app.getPath("documents")
  window.myApp.getPath("documents").then((res) => {
    savedLocation.current = res;
  });

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
  };

  //   update
  const renameFile = (fileID, title, theNew) => {
    const newPath = theNew
      ? window.myApp.joinPath(savedLocation.current, `${title}`)
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
        // console.log(a);
      });
    }
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
    // console.log(activeFile.current);
    const { path, body } = activeFile.current;
    fileDealer.writeFile(path, body).then(() => {
      setUnSavedFiles(
        unSavedFiles.filter((id) => id !== activeFile.current.id)
      );
    });
  };

  const updateState = () => {
    const newOpenedFiles = filesList.filter((item) =>
      openedFilesID.includes(item.id)
    );
    setOpenedFiles(newOpenedFiles);
  };

  //   close file
  const closeFile = (fileID) => {
    const afterClose = openedFiles.filter((item) => item.id !== fileID);
    const afterCloseIDs = openedFilesID.filter((itemID) => itemID !== fileID);
    setOpenedFiles(afterClose);
    setOpenedFilesID(afterCloseIDs);
    if (fileID === activeFileID) {
      if (afterCloseIDs.length > 0) {
        setActiveFileID(afterCloseIDs[0]);
      } else {
        setActiveFileID("");
      }
    }
  };

  //   deleteFile
  const deleteFile = (fileID) => {
    const { [fileID]: value, ...afterDelete } = files;
    setFiles(afterDelete);
    if (openedFilesID.includes(fileID)) {
      closeFile(fileID);
    }
  };

  const importFile = () => {
    // console.log("import");
    window.myApp.showImportDialog().then((res) => {
      //   console.log(res.filePaths);
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

  //   useIpcRenderer({
  //     save_edit_file: saveContent,
  //   });

  useEffect(() => {
    // console.log("effect");
    // console.log(activeFile);
    // TODO: 问题逐步缩小到了这里，在这个回调函数里是读不到activeFile这个变量的
    // TODO: 好吧，最后还是用了useRef
    // in the preload function, the callback function can't read the variable of activeFile
    // why?

    window.myApp.listenIPC("save_edit_file", saveContent);
    return () => {
      window.myApp.removeListenIPC("save_edit_file", saveContent);
    };
  });

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
          activeID={activeFileID}
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
          activeID={activeFileID}
          fileClose={closeFile}
          fileActive={fileActive}
        />
        {openedFiles.length > 0 && (
          <SimpleMDE
            value={activeFile.current && activeFile.current.body}
            onChange={(value) => {
              updateContent(activeFileID, value);
            }}
            options={mdeOption}
          />
        )}
      </div>
    </div>
  );
}

export default App;
