import React, { useState } from "react";

export default function NetworkPanel({ vcns, onCreate }) {
  const [name, setName] = useState("");
  const [cidr, setCidr] = useState("10.0.0.0/16");

  const handleCreate = () => {
    onCreate({ name, cidr });
    setName("");
  };

  return (
    <div>
      <div className="oci-form-row">
        <input
          className="oci-input"
          placeholder="VCN name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="oci-input"
          placeholder="CIDR block (e.g. 10.0.0.0/16)"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
        />
        <button className="oci-button" onClick={handleCreate}>
          Create VCN
        </button>
      </div>

      <table className="oci-table">
        <thead>
          <tr>
            <th>VCN</th>
            <th>OCID</th>
            <th>CIDR block</th>
            <th>Compartment</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {vcns.map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.id}</td>
              <td>{v.cidr}</td>
              <td>{v.compartment}</td>
              <td>{v.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
