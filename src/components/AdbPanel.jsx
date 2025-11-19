import React, { useState } from "react";

export default function AdbPanel({ adbs, onCreate }) {
  const [name, setName] = useState("");
  const [cpu, setCpu] = useState(1);
  const [storage, setStorage] = useState(1);

  const handleCreate = () => {
    onCreate({
      name,
      cpuCount: Number(cpu),
      storageTb: Number(storage),
    });
    setName("");
  };

  return (
    <div>
      <div className="oci-form-row">
        <input
          className="oci-input"
          placeholder="Autonomous DB name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="oci-input"
          type="number"
          min="1"
          value={cpu}
          onChange={(e) => setCpu(e.target.value)}
        />
        <span style={{ fontSize: 12 }}>CPU cores</span>
        <input
          className="oci-input"
          type="number"
          min="1"
          value={storage}
          onChange={(e) => setStorage(e.target.value)}
        />
        <span style={{ fontSize: 12 }}>TB storage</span>
        <button className="oci-button" onClick={handleCreate}>
          Create Autonomous DB
        </button>
      </div>

      <table className="oci-table">
        <thead>
          <tr>
            <th>Display name</th>
            <th>OCID</th>
            <th>CPU core count</th>
            <th>Storage (TB)</th>
            <th>Workload type</th>
            <th>Lifecycle state</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {adbs.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.id}</td>
              <td>{d.cpuCount}</td>
              <td>{d.storageTb}</td>
              <td>{d.workload}</td>
              <td>
                <span className="oci-badge oci-badge-green">{d.state}</span>
              </td>
              <td>{d.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
