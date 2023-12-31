import React from "react";
import "./lsList.css";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import FolderIcon from "@mui/icons-material/Folder";

export default function LsList({ files, goDwn }) {
  var dirs = [];
  var fls = [];

  const goDown = (path) => {
    console.log(">>>>>>--------->>>>>>>>>>>>>>>>>" + path);
    goDwn(path);
  };

  files.forEach((item) => {
    if (item.name.includes(".")) {
      fls.push({ item: item, dir: 0 });
    } else {
      dirs.push({ item: item, dir: 1 });
    }
  });

  const newFiles = [...dirs, ...fls];
  return (
    <div className="lsWrapper">
      {newFiles.map((item) => {
        var path = item.item.path;
        var names = item.item.name;
        var newPath = path.slice(2, path.length - 1);

        return (
          <div className="fileLink">
            <div>
              {item.dir ? (
                <div className="linkContent">
                  <FolderIcon className="folderIcon" />

                  <input
                    type="button"
                    id="Down"
                    onClick={() => {
                      console.log("->" + item.item.name);
                      goDown(path + names + "/");
                      console.log(item.item.name);
                    }}
                    value={item.item.name}
                    //style={{ display: "none" }}
                  />
                </div>
              ) : (
                <div className="linkContent">
                  <a
                    href={
                      "http://192.168.1.7:8800/file" +
                      newPath +
                      "/" +
                      item.item.name
                    }
                    target="_blank"
                    download={names}
                    rel="noopener noreferrer"
                  >
                    <FileOpenIcon className="fileIcon" />
                  </a>
                  <a
                    href={
                      "http://192.168.1.7:8800/file" + newPath + "/" + names
                    }
                    target="_blank"
                    download={item.item.name}
                    rel="noopener noreferrer"
                  >
                    <h3 className="fileName">
                      {window.matchMedia("(max-width: 500px)").matches
                        ? names.length - 14 > 13
                          ? (names[13] === "_"
                              ? names.slice(14, 14 + 13)
                              : names.slice(0, 13)) +
                            "..." +
                            names.slice(names.lastIndexOf("."), names.length)
                          : names.slice(14, names.length)
                        : window.matchMedia("(max-width: 800px)").matches
                        ? names.length - 14 > 30
                          ? (names[13] === "_"
                              ? names.slice(14, 14 + 30)
                              : names.slice(0, 30)) +
                            "..." +
                            names.slice(names.lastIndexOf("."), names.length)
                          : names[13] === "_"
                          ? names.slice(14, names.length)
                          : names.slice(0, names.length)
                        : names}
                    </h3>
                  </a>
                  <h5>
                    {item.item.size > 1000000000
                      ? (item.item.size / 1000000000).toFixed(2) + " GB"
                      : (item.item.size / 1000000).toFixed(2) + " MB"}
                  </h5>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
