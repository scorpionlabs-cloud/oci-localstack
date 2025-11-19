import React, { useState } from "react";

export default function ComputePanel({ instances, onCreate }) {
  const [name, setName] = useState("");
  const [shape, setShape] = useState("VM.Standard3.Flex");

  const handleCreate = () => {
    onCreate({ name, shape });
    setName("");
  };

  return (
    <div>
      <div className="oci-form-row">
        <input
          className="oci-input"
          placeholder="Instance name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="oci-input"
          placeholder="Shape (e.g. VM.Standard3.Flex)"
          value={shape}
          onChange={(e) => setShape(e.target.value)}
        />
        <button className="oci-button" onClick={handleCreate}>
          Create instance
        </button>
      </div>

      <table className="oci-table">
        <thead>
          <tr>
            <th>Display name</th>
            <th>OCID</th>
            <th>Shape</th>
            <th>Lifecycle state</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {instances.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.id}</td>
              <td>{i.shape}</td>
              <td>
                <span
                  className={
                    i.state === "RUNNING"
                      ? "oci-badge oci-badge-green"
                      : "oci-badge oci-badge-gray"
                  }
                >
                  {i.state}
                </span>
              </td>
              <td>{i.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
