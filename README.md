# TrustKYC — Enterprise B2B KYC, Trust Scoring & Trade Verification Platform

> **100% Static Frontend-Only Interactive Demo Application**  
> Zero external backend, Node.js server, or MongoDB dependencies required. Fully self-contained with client-side state persistence and realistic mock verification pipelines.

---

## ⚡ Quick Start

```bash
# 1. Install frontend dependencies
npm install

# 2. Launch interactive development server
npm run dev

# 3. Compile standalone production bundle into /dist
npm run build
```

The application will launch on `http://localhost:5173/` by default.

---

## 🔑 Demo Access Personas (1-Click Login Available on Landing Page)

| Role                 | Email                       | Password       | Scope / Experience                                                                              |
| :------------------- | :-------------------------- | :------------- | :---------------------------------------------------------------------------------------------- |
| **Business Portal**  | `business@trustverify.demo` | `Business@123` | Upload KYC, view trust score breakdown, manage trade deals, search counterparty directory       |
| **Admin Operations** | `admin@trustverify.demo`    | `Admin@123`    | Verification queue dispatch, approve/reject documents, calibrate trust scores, mediate disputes |

_Tip: Quick 1-click login buttons are directly embedded on the landing page for immediate evaluation._

---

## 📖 In-App Documentation Portal

TrustKYC includes a built-in interactive documentation portal accessible at [`/documentation`](/documentation) or via the top navigation bar. It features:

- **System Architecture & Data Flows**
- **Interactive Role Switcher & Credential Registry**
- **Comprehensive Route Matrix**
- **Clean Project Folder Structure**
- **Static Mock Data Schema Catalog**
- **Step-by-step KYC and Commercial Dispute Workflows**
- **Zero-Backend Static Deployment Guides** (Vercel, Netlify, GitHub Pages)

---

## 🏗️ Architecture & Technical Highlights

- **React 19 & Vite 7**: Blazing fast SPA build and hot module replacement.
- **Tailwind CSS 4**: Enterprise dark/light theme engine with high-contrast compliance color tokens.
- **Client-Side State Engine (`src/utils/storage.js`)**: Reactive `localStorage` abstraction supporting automatic initial dataset seeding, CRUD operations, and cross-tab/cross-component `CustomEvent` synchronization.
- **Simulated OCR & Verification Engine**: Realistic OCR bounding box extracts, confidence metrics, and statutory validation checks for GSTIN, PAN, and CIN certificates.
- **Recharts Data Visualization**: Monthly trust score trajectory, radar benchmark breakdowns, and commercial deal volume analytics.

---

## 📁 Clean Directory Layout

```
src/
├── components/          # Reusable enterprise UI primitives, shells, headers, drawers
│   ├── app-header.jsx
│   ├── app-shell.jsx
│   ├── AppSidebar.jsx
│   ├── notification-drawer.jsx
│   ├── trust-gauge.jsx
│   ├── ui-bits.jsx
│   └── ui-kit.jsx
├── context/             # AuthContext (demo credentials, sessions) & ThemeContext
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── data/                # Typed static mock datasets & barrel exports
│   ├── auditLogs.js
│   ├── businesses.js
│   ├── dashboardData.js
│   ├── deals.js
│   ├── documents.js
│   ├── index.js
│   ├── kycData.js
│   ├── notifications.js
│   └── users.js
├── layouts/             # Dedicated workspace layouts & header dictionaries
│   ├── AdminLayout.jsx
│   ├── BusinessLayout.jsx
│   ├── DocumentationLayout.jsx
│   └── headerConfig.js
├── pages/
│   ├── admin/           # Compliance Operations Center (Queue, Businesses, Disputes, etc.)
│   ├── dashboard/       # Business Workspace (Overview, KYC, Trust, Deals, Directory, etc.)
│   ├── documentation/   # Interactive In-App Documentation Portal
│   ├── Landing.jsx      # Public landing page with 1-click credentials
│   ├── ProfilePage.jsx
│   └── KycSubmitPage.jsx
├── routes/              # Routing architecture and auth/role route guards
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   └── RoleRoute.jsx
└── utils/               # Storage manager (localStorage + events) & CSS mergers
    ├── storage.js
    └── utils.js
```

---

## 🌐 Production Deployment

Since TrustKYC is 100% static, it can be hosted on any static web server or CDN with standard Single-Page App (SPA) rewrite rules:

### Vercel (`vercel.json`)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify (`public/_redirects`)

```
/*    /index.html   200
```

# TRUSTKYC
