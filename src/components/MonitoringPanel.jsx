import React, { useEffect, useState } from "react";

export default function MonitoringPanel({
  computeInstances,
  buckets,
  vcns,
  adbs,
}) {
  const [cpuCompute, setCpuCompute] = useState(35);
  const [cpuAdb, setCpuAdb] = useState(20);
  const [avgObjects, setAvgObjects] = useState(1000);
  const [refreshMs, setRefreshMs] = useState(5000);

  const running = computeInstances.filter((c) => c.state === "RUNNING").length;
  const stopped = computeInstances.filter(
    (c) => c.state && c.state !== "RUNNING"
  ).length;

  useEffect(() => {
    const updateMetrics = () => {
      setCpuCompute((prev) => clamp(prev + (Math.random() * 10 - 5), 5, 95));
      setCpuAdb((prev) => clamp(prev + (Math.random() * 8 - 4), 5, 80));
      setAvgObjects(
        Math.max(
          100,
          buckets.length ? buckets.length * 1000 + Math.random() * 500 : 0
        )
      );
    };

    updateMetrics();
    if (!refreshMs || refreshMs <= 0) return;

    const id = setInterval(updateMetrics, refreshMs);
    return () => clearInterval(id);
  }, [buckets.length, refreshMs]);

  const timestamp = new Date().toISOString();

  return (
    <div>
      <div className="oci-form-row">
        <span style={{ fontSize: 12 }}>Auto-refresh (ms):</span>
        <input
          className="oci-input"
          type="number"
          value={refreshMs}
          onChange={(e) => setRefreshMs(Number(e.target.value))}
          style={{ width: 120 }}
        />
      </div>

      <p style={{ fontSize: 12, marginBottom: 12 }}>
        <strong>Last updated:</strong> {timestamp}
      </p>

      <div className="oci-metric-grid">
        <MetricCard
          title="Compute instances"
          value={computeInstances.length}
          details={`Running: ${running} • Stopped: ${stopped}`}
        />
        <MetricCard
          title="Buckets"
          value={buckets.length}
          details="Object Storage buckets in this region"
        />
        <MetricCard
          title="Virtual cloud networks"
          value={vcns.length}
          details="VCNs modelling your network topology"
        />
        <MetricCard
          title="Autonomous Databases"
          value={adbs.length}
          details="Mock ADBs for workload demos"
        />
      </div>

      <h3 style={{ fontSize: 14, marginTop: 16, marginBottom: 8 }}>
        Utilization (mock)
      </h3>

      <div className="oci-metric-grid">
        <GaugeLike label="Avg compute CPU" value={cpuCompute} suffix="%" />
        <GaugeLike label="Avg ADB CPU" value={cpuAdb} suffix="%" />
        <GaugeLike
          label="Approx. objects per bucket"
          value={Math.round(avgObjects)}
          suffix=""
          max={10000}
        />
      </div>
    </div>
  );
}

function MetricCard({ title, value, details }) {
  return (
    <div className="oci-metric-card">
      <div className="oci-metric-title">{title}</div>
      <div className="oci-metric-value">{value}</div>
      {details && <div className="oci-metric-detail">{details}</div>}
    </div>
  );
}

function GaugeLike({ label, value, suffix, max = 100 }) {
  const pct = clamp((Number(value) / max) * 100, 0, 100);

  let color;
  if (pct < 60) color = "#4caf50";
  else if (pct < 85) color = "#ff9800";
  else color = "#f44336";

  return (
    <div className="oci-metric-card">
      <div className="oci-metric-title">{label}</div>
      <div className="oci-metric-value">
        {Math.round(value * 10) / 10}
        {suffix}
      </div>
      <div className="oci-gauge-track">
        <div
          className="oci-gauge-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
