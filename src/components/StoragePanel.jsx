import React, { useState } from "react";

export default function StoragePanel({ buckets, onCreate }) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    onCreate({ name });
    setName("");
  };

  return (
    <div>
      <div className="oci-form-row">
        <input
          className="oci-input"
          placeholder="Bucket name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="oci-button" onClick={handleCreate}>
          Create bucket
        </button>
      </div>

      <table className="oci-table">
        <thead>
          <tr>
            <th>Bucket name</th>
            <th>OCID</th>
            <th>Compartment</th>
            <th>Region</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {buckets.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.id}</td>
              <td>{b.compartment}</td>
              <td>{b.region}</td>
              <td>{b.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
