import React, { useEffect, useState } from "react";
import { DEFAULT_DATA } from "../../const";
import { addData, updateData } from "../Api/api";

import "./updateData.css";

const UpdateData = ({ data, setReloadData }) => {
  const [formData, setFormData] = useState({
    FirstName: data.FirstName,
    LastName: data.LastName,
    Gender: data.Gender,
    Country: data.Country,
    Age: data.Age,
    Date: data.Date,
    Id: data.Id,
  });

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.Id) {
      updateData(formData);
    } else {
      addData(formData);
    }
    setFormData(DEFAULT_DATA);
    const reload = setTimeout(() => {
      setReloadData(true);
    }, 100);

    return () => clearTimeout(reload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          margin: "40px",
          justifyContent: "space-between",
        }}
      >
        <label>
          First Name:
          <input
            type="text"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Gender:
          <input
            type="text"
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            name="Country"
            value={formData.Country}
            onChange={handleChange}
          />
        </label>
        <label>
          Age:
          <input
            type="text"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Add/Update Data</button>
    </form>
  );
};

export default UpdateData;
