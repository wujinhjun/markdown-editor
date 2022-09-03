import SearchFile from "./components/SearchFile";
import "./App.scss";
function App() {
  return (
    <div id="app">
      <div className="left-panel">
        <SearchFile></SearchFile>
      </div>
      <div className="right-panel"></div>
    </div>
  );
}

export default App;
