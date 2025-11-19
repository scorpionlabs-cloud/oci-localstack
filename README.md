
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

---

## Build for GitHub Pages

The Vite config is set to output into `docs/` (suitable for GitHub Pages):

```bash
npm run build
# build artifacts in docs/
```

On GitHub:

1. Push this repo.
2. Go to **Settings → Pages**.
3. Source: `Deploy from a branch`.
4. Branch: `main`, Folder: `/docs`.
5. Save.

Your console will be live at:

```text
https://<your-username>.github.io/<repo-name>/
```

---
