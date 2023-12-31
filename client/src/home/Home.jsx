import React, { useEffect, useState } from "react";
import "./home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import LsList from "../components/LsList/LsList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BottomBar from "../components/BottomBar/BottomBar";

export default function Home() {
  const [address, setAddress] = useState("F:/MyDrive/data/");
  const [files, setFiles] = useState([]);
  var addr = address.split("/");
  addr = addr.slice(0, addr.length - 1);

  const refresh = () => {
    setAddress(address);
  };

  const goUpAdd = async () => {
    var newAddr = "";
    try {
      var lss = address.split("/");
      lss.pop();
      lss.pop();
      for (let i = 0; i < lss.length; i++) {
        newAddr = newAddr + lss[i] + "/";
      }

      setAddress(newAddr);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + newAddr);
    } catch (err) {}
  };
  const goDwn = async (path) => {
    var oldaddress = address;
    var pathls = path.split("/");
    var fname = pathls[pathls.length - 2];
    try {
      var newAddr = address + fname + "/";
      const fls = await axios.get("/ls/" + address.replaceAll("/", "|"));
      if (fls.data) {
        setAddress(newAddr);
      } else {
        setAddress(oldaddress);
      }
    } catch (err) {}
  };

  const goUp = () => {
    goUpAdd();
  };

  // useEffect(() => {
  //   const getaddr = async () => {
  //     const adr = ;
  //     setAddress(adr);
  //   };
  //   getaddr();
  // }, []);

  useEffect(() => {
    const getfiles = async () => {
      if (address.length >= 2) {
        const fls = await axios.get("/ls/" + address.replaceAll("/", "|"));

        setFiles(fls.data);
      }
    };
    getfiles();
  }, [address]);

  const [fileNme, setFileNme] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [filed, setFile] = useState(null);

  const change = (event) => {
    if (!filed) {
      var files = event.target.files;
      setFileNme(files[0].name);
      console.log(files);
      setFile(files[0]);
      setFileSelected(true);
      console.log("jjjjjjjj");
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", filed);
    data.append("address", address);
    console.log(filed);

    try {
      var oldadd = address;
      await axios.post("/upload", data);
      setFile(null);

      if (address.length >= 2) {
        const fls = await axios.get("/ls/" + address.replaceAll("/", "|"));

        setFiles(fls.data);
      }

      // setFileSelected("false");
    } catch (err) {}
  };

  return (
    <div className="homeWrapper">
      <div className="addressWrapper">
        <div className="addressLine">
          <label htmlFor="up" className="upIcon">
            <ArrowUpwardIcon />
          </label>
          <input
            type="button"
            id="up"
            onClick={goUp}
            style={{ display: "none" }}
          />
          {addr.map((item) => {
            if (item.includes(":")) {
              item = item[0];
            }
            return <h4>{item} &nbsp; &gt;</h4>;
          })}
        </div>
        <hr />
      </div>
      <LsList files={files} goDwn={goDwn} />

      <BottomBar
        filed={filed}
        handleCLick={handleClick}
        change={change}
        fileSelected={fileSelected}
      />
    </div>
  );
}
