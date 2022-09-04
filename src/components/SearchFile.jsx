import "./SearchFile.scss";
import search from "../static/search.svg";

const SearchFile = (props) => {
  return (
    <div id="search-file">
      <div className="search-title">文档</div>
      <img src={search} alt="search-icon" />
    </div>
  );
};

export default SearchFile;
