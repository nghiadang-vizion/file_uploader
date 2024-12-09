import { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { DEFAULT_DATA } from "../../const";
import { getListData } from "../Api/api";

export const Preview = ({
  setSelectedRow = () => {},
  reloadData = false,
  setReloadData = () => {},
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getListData(setData, setError, setLoading);
  }, []);

  useEffect(() => {
    if (reloadData) {
      getListData(setData, setError, setLoading);
      setReloadData(false);
    }
  }, [reloadData, setReloadData]);

  const columns = [
    {
      name: "FirstName",
      selector: (row) => row.FirstName,
    },
    {
      name: "LastName",
      selector: (row) => row.LastName,
    },
    {
      name: "Gender",
      selector: (row) => row.Gender,
    },
    {
      name: "Country",
      selector: (row) => row.Country,
    },
    {
      name: "Age",
      selector: (row) => row.Age,
    },
    {
      name: "Date",
      selector: (row) => row.Date,
    },
  ];

  const handleOnSelectChanged = useCallback(
    ({ selectedRows }) => {
      if (selectedRows.length) setSelectedRow(selectedRows[0]);
      else {
        setSelectedRow(DEFAULT_DATA);
      }
    },
    [setSelectedRow]
  );

  if (!data) {
    return null;
  }

  return (
    <>
      <div style={{ border: "1px solid black", margin: "40px" }}>
        <DataTable
          noHeader
          columns={columns}
          data={data}
          pagination
          selectableRows
          onSelectedRowsChange={handleOnSelectChanged}
          selectableRowsSingle
          progressPending={loading}
        />
      </div>
    </>
  );
};
