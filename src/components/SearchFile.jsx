import "../style/SearchFile.scss";
import search from "../static/search.svg";
import { useState, useEffect, useRef } from "react";

// import self hooks
import useKeypress from "../hooks/useKeypress";
import useIpcRenderer from "../hooks/useIpcRenderer";

const SearchFile = (props) => {
  const { searchFiles } = props;
  const [isSearch, setIsSearch] = useState(false);

  const [value, setValue] = useState("");

  const node = useRef(null);

  //   listen key press
  const enterPress = useKeypress(13);
  const escPress = useKeypress(27);

  const openSearch = () => {
    setIsSearch(true);
  };

  const closeSearch = () => {
    setIsSearch(false);
    setValue("");
    searchFiles(" ");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (enterPress && isSearch) {
      searchFiles(value);
    }

    if (escPress && isSearch) {
      closeSearch();
    }
  });

  useEffect(() => {
    if (isSearch) {
      node.current.focus();
    }
  }, [isSearch]);

  useIpcRenderer({
    "search-file": openSearch,
  });

  return (
    <div id="search-file">
      {!isSearch && (
        <>
          <div className="search-title">文档</div>
          <img
            src={search}
            onClick={openSearch}
            alt="search-icon"
            className="search-icon"
          />
        </>
      )}
      {isSearch && (
        <input
          ref={node}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
          type="text"
          className="search-input"
        />
      )}
    </div>
  );
};

export default SearchFile;
