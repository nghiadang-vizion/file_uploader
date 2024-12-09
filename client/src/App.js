import { useState } from "react";
import { Preview } from "./components/Preview";
import { DEFAULT_DATA } from "./const";
import UpdateData from "./components/UpdateData";
import { FileUploader } from "./components/FileUploader";
import DeleteData from "./components/DeleteData";

export default function App() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [isReloadData, setIsReloadData] = useState(false);
  return (
    <div className="App">
      <UpdateData data={data} setReloadData={setIsReloadData} />
      <DeleteData
        selectedRow={data}
        setReloadData={setIsReloadData}
        setSelectedRow={setData}
      />
      <FileUploader setReloadData={setIsReloadData} />
      <Preview
        reloadData={isReloadData}
        setReloadData={setIsReloadData}
        setSelectedRow={setData}
      />
    </div>
  );
}
