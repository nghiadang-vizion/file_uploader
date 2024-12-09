import React, { useCallback } from "react";
import { DEFAULT_DATA } from "../../const";
import { deleteData } from "../Api/api";

function DeleteData({ selectedRow, setReloadData, setSelectedRow }) {
  const onDeleteData = useCallback(() => {
    deleteData(selectedRow);
    setReloadData(true);
    setSelectedRow(DEFAULT_DATA);
  }, [selectedRow, setReloadData, setSelectedRow]);

  return (
    <div style={{ textAlign: "left", marginLeft: "40px" }}>
      <button disabled={selectedRow.Id ? false : true} onClick={onDeleteData}>
        Delete
      </button>
    </div>
  );
}

export default DeleteData;
