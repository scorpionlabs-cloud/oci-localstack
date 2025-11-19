import React, { useEffect, useState } from "react";
import "./oci-console.css";
import MonitoringPanel from "./components/MonitoringPanel.jsx";
import ComputePanel from "./components/ComputePanel.jsx";
import StoragePanel from "./components/StoragePanel.jsx";
import NetworkPanel from "./components/NetworkPanel.jsx";
import AdbPanel from "./components/AdbPanel.jsx";
import CloudShell from "./components/CloudShell.jsx";

const VIEW = {
  MONITORING: "Monitoring",
  COMPUTE: "Compute",
  STORAGE: "Storage",
  NETWORKING: "Networking",
  ADB: "ADB",
};

const STORAGE_KEY = "ociLocalstackUiState_v1";

export default function App() {
  const [computeInstances, setComputeInstances] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [vcns, setVcns] = useState([]);
  const [adbs, setAdbs] = useState([]);

  const [activeView, setActiveView] = useState(VIEW.MONITORING);
  const [region, setRegion] = useState("ap-singapore-1");
  const [theme, setTheme] = useState("light");
  const [cloudShellOpen, setCloudShellOpen] = useState(false);

  const regions = ["ap-singapore-1", "us-ashburn-1", "eu-frankfurt-1"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setComputeInstances(saved.computeInstances || []);
        setBuckets(saved.buckets || []);
        setVcns(saved.vcns || []);
        setAdbs(saved.adbs || []);
        if (saved.region) setRegion(saved.region);
        if (saved.theme) setTheme(saved.theme);
        if (saved.activeView) setActiveView(saved.activeView);
        return;
      }
    } catch (e) {
      console.warn("Failed to load saved state, seeding defaults:", e);
    }

    setComputeInstances([
      {
        id: "inst-1",
        name: "demo-web",
        shape: "VM.Standard3.Flex",
        state: "RUNNING",
        region: "ap-singapore-1",
      },
      {
        id: "inst-2",
        name: "demo-api",
        shape: "VM.Standard.E4.Flex",
        state: "STOPPED",
        region: "ap-singapore-1",
      },
    ]);
    setBuckets([
      {
        id: "bkt-1",
        name: "logs-bucket",
        compartment: "root",
        region: "ap-singapore-1",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bkt-2",
        name: "images-bucket",
        compartment: "root",
        region: "ap-singapore-1",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
    ]);
    setVcns([
      {
        id: "vcn-1",
        name: "vcn-demo",
        cidr: "10.0.0.0/16",
        region: "ap-singapore-1",
        compartment: "root",
      },
    ]);
    setAdbs([
      {
        id: "adb-1",
        name: "adb-finops",
        cpuCount: 2,
        storageTb: 1,
        workload: "OLTP",
        region: "ap-singapore-1",
        state: "AVAILABLE",
      },
    ]);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = {
      computeInstances,
      buckets,
      vcns,
      adbs,
      region,
      theme,
      activeView,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed to save state:", e);
    }
  }, [computeInstances, buckets, vcns, adbs, region, theme, activeView]);

  const randomId = (prefix) =>
    `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

  const addInstance = ({ name, shape }) => {
    const instance = {
      id: randomId("inst"),
      name: name || "instance",
      shape: shape || "VM.Standard3.Flex",
      state: "RUNNING",
      region,
    };
    setComputeInstances((prev) => [...prev, instance]);
  };

  const addBucket = ({ name }) => {
    const bucket = {
      id: randomId("bkt"),
      name: name || "new-bucket",
      compartment: "root",
      region,
      createdAt: new Date().toISOString(),
    };
    setBuckets((prev) => [...prev, bucket]);
  };

  const addVcn = ({ name, cidr }) => {
    const vcn = {
      id: randomId("vcn"),
      name: name || "vcn",
      cidr: cidr || "10.0.0.0/16",
      region,
      compartment: "root",
    };
    setVcns((prev) => [...prev, vcn]);
  };

  const addAdb = ({ name, cpuCount, storageTb }) => {
    const adb = {
      id: randomId("adb"),
      name: name || "adb-demo",
      cpuCount: cpuCount || 1,
      storageTb: storageTb || 1,
      workload: "OLTP",
      region,
      state: "AVAILABLE",
    };
    setAdbs((prev) => [...prev, adb]);
  };

  const filteredInstances = computeInstances.filter((i) => i.region === region);
  const filteredBuckets = buckets.filter((b) => b.region === region);
  const filteredVcns = vcns.filter((v) => v.region === region);
  const filteredAdbs = adbs.filter((d) => d.region === region);

  const pageMeta = getPageMeta(activeView);

  const handleResetTenancy = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    window.location.reload();
  };

  return (
    <div className={`oci-app ${theme === "dark" ? "oci-app-dark" : ""}`}>
      <div className="oci-topbar">
        <div className="oci-topbar-left">
          <div className="oci-oracle-logo">ORACLE</div>
          <div className="oci-topbar-title">Cloud Console (LocalStack UI)</div>
          <div className="oci-topbar-divider" />
          <div style={{ fontSize: 12 }}>Tenancy: mock-tenancy (browser)</div>
        </div>
        <div className="oci-topbar-right">
          <div className="oci-topbar-pill">User: demo.user@local</div>
          <div className="oci-topbar-pill">Environment: Frontend-only</div>
          <button
            className="oci-cloudshell-toggle"
            onClick={() => setCloudShellOpen((v) => !v)}
          >
            {cloudShellOpen ? "Close Cloud Shell" : "Open Cloud Shell"}
          </button>
        </div>
      </div>

      <div className="oci-body">
        <aside className="oci-sidebar">
          <div className="oci-sidebar-section-title">
            Observability &amp; Mgmt
          </div>
          <SidebarItem
            label="Monitoring"
            icon="📈"
            active={activeView === VIEW.MONITORING}
            onClick={() => setActiveView(VIEW.MONITORING)}
          />

          <div className="oci-sidebar-section-title">Core Infrastructure</div>
          <SidebarItem
            label="Compute → Instances"
            icon="🖥️"
            active={activeView === VIEW.COMPUTE}
            onClick={() => setActiveView(VIEW.COMPUTE)}
          />
          <SidebarItem
            label="Networking → VCNs"
            icon="🌐"
            active={activeView === VIEW.NETWORKING}
            onClick={() => setActiveView(VIEW.NETWORKING)}
          />
          <SidebarItem
            label="Storage → Object Storage"
            icon="🗂️"
            active={activeView === VIEW.STORAGE}
            onClick={() => setActiveView(VIEW.STORAGE)}
          />

          <div className="oci-sidebar-section-title">Database</div>
          <SidebarItem
            label="Autonomous Database"
            icon="🗄️"
            active={activeView === VIEW.ADB}
            onClick={() => setActiveView(VIEW.ADB)}
          />
        </aside>

        <main className="oci-main">
          <div className="oci-main-toolbar">
            <button
              className="oci-button"
              style={{ fontSize: 11, padding: "4px 10px" }}
              onClick={handleResetTenancy}
            >
              Reset mock tenancy
            </button>

            <div>
              <label style={{ marginRight: 4 }}>Theme:</label>
              <select
                className="oci-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label style={{ marginRight: 4 }}>Region:</label>
              <select
                className="oci-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="oci-page-header">
            <div className="oci-breadcrumbs">{pageMeta.breadcrumbs}</div>
            <div className="oci-page-title-line">
              <div className="oci-page-title">{pageMeta.title}</div>
            </div>
            <div className="oci-page-subtitle">{pageMeta.subtitle}</div>
          </div>

          <div className="oci-panel-card">
            {activeView === VIEW.MONITORING && (
              <MonitoringPanel
                computeInstances={filteredInstances}
                buckets={filteredBuckets}
                vcns={filteredVcns}
                adbs={filteredAdbs}
              />
            )}
            {activeView === VIEW.COMPUTE && (
              <ComputePanel
                instances={filteredInstances}
                onCreate={addInstance}
              />
            )}
            {activeView === VIEW.STORAGE && (
              <StoragePanel buckets={filteredBuckets} onCreate={addBucket} />
            )}
            {activeView === VIEW.NETWORKING && (
              <NetworkPanel vcns={filteredVcns} onCreate={addVcn} />
            )}
            {activeView === VIEW.ADB && (
              <AdbPanel adbs={filteredAdbs} onCreate={addAdb} />
            )}
          </div>
        </main>
      </div>

      <CloudShell open={cloudShellOpen} region={region} />
    </div>
  );
}

function SidebarItem({ label, icon, active, onClick }) {
  return (
    <div
      className={`oci-sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function getPageMeta(view) {
  switch (view) {
    case "Compute":
      return {
        breadcrumbs: "Core Infrastructure / Compute / Instances",
        title: "Instances (LocalStack)",
        subtitle: "Mock compute instances running entirely in your browser.",
      };
    case "Storage":
      return {
        breadcrumbs: "Core Infrastructure / Storage / Object Storage",
        title: "Buckets (LocalStack)",
        subtitle:
          "Mock Object Storage buckets with metadata for demos and training.",
      };
    case "Networking":
      return {
        breadcrumbs: "Core Infrastructure / Networking / Virtual Cloud Networks",
        title: "Virtual Cloud Networks (VCNs)",
        subtitle: "Model your virtual cloud topology without touching real OCI.",
      };
    case "ADB":
      return {
        breadcrumbs: "Database / Autonomous Database",
        title: "Autonomous Databases (LocalStack)",
        subtitle:
          "Simulated Autonomous Databases for architecture walkthroughs.",
      };
    case "Monitoring":
    default:
      return {
        breadcrumbs: "Observability & Management / Monitoring",
        title: "Monitoring Overview",
        subtitle:
          "Mock metrics and summaries derived from your in-browser tenancy.",
      };
  }
}
