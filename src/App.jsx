// import components
import SearchFile from "./components/SearchFile";
import FileList from "./components/FileList";

import "./App.scss";
function App() {
  return (
    <div id="app">
      <div className="left-panel">
        <SearchFile></SearchFile>
        <FileList></FileList>
      </div>
      <div className="right-panel"></div>
    </div>
  );
}

export default App;
