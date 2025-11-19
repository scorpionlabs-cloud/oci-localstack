
# OCI LocalStack UI (Frontend-only, GitHub Pages-ready)

This project is a **React-only mock of the OCI Console** that runs entirely in your browser:

- OCI-style layout (top bar, left sidebar, page headers)
- Mock services:
  - Compute instances
  - Object Storage buckets
  - Virtual Cloud Networks (VCNs)
  - Autonomous Databases (ADB)
  - Monitoring overview
- Mock **Cloud Shell** with fake `oci` commands
- **Light / Dark** theme toggle
- **Region** selector (multi-region view)
- **LocalStorage persistence** (mock tenancy survives refresh)
- One-click **Reset mock tenancy**

No backend, no Go, no Docker required. Perfect for demos, workshops, and teaching cloud concepts without touching a real OCI tenancy.

---

## Getting Started

```bash
npm install
npm run dev
# open http://localhost:5173
```

Github Pages - https://scorpionlabs-cloud.github.io/oci-localstack/
