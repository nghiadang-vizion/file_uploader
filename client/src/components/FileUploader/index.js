import { useState } from "react";

import "./style.css";
import { uploadFile } from "../Api/api";

function isExcelFile(fileName) {
  var fileExtension = fileName.split(".").pop().toLowerCase();

  var excelExtensions = ["xlsx", "xls"];
  return excelExtensions.includes(fileExtension);
}

export const FileUploader = ({ setReloadData }) => {
  const [files, setFiles] = useState([]);

  const onInputChange = (e) => {
    setFiles(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const isExcel = isExcelFile(files.name);
    if (!isExcel) {
      window.alert("Invalid file format. Please upload an Excel file.");
      return;
    }
    const data = new FormData();
    data.append("file", files);
    uploadFile(data);
    const timeout = setTimeout(() => {
      setReloadData(true);
    }, 500);
    return () => clearTimeout(timeout);
  };

  return (
    <form method="post" action="#" id="#" onSubmit={onSubmit}>
      <div className="form-group files">
        <label>Upload Your File </label>
        <input
          type="file"
          onChange={onInputChange}
          className="form-control"
          // multiple
        />
      </div>
      <button>Submit</button>
    </form>
  );
};
