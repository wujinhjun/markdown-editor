// import components
import SearchFile from "./components/SearchFile";
import FileList from "./components/FileList";
import FileTable from "./components/FileTable";

import "./App.scss";

function App() {
  return (
    <div id="app">
      <div className="left-panel">
        <SearchFile></SearchFile>
        <FileList></FileList>
      </div>
      <div className="right-panel">
        <FileTable></FileTable>
      </div>
    </div>
  );
}

export default App;
