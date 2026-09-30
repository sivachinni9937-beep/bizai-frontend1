# BizAI Command Center - Frontend

> **Executive Web Interface for the AI-Powered Enterprise Business Management Platform**

---

## 1. Overview

**BizAI Command Center Frontend** is a modern, high-performance enterprise user interface built with **React 19**, **Vite**, and **Tailwind CSS**. It provides unified control across all 5 core modules:

1. **Procurement & Sourcing**: Supplier CRUD, RFQs, multi-factor AI quotation comparison matrix, and purchase orders.
2. **Payment Recovery**: Receivables dashboard, 6-bucket aging distribution, automated reminder cascades, and AI cash flow forecasts.
3. **Supply Chain Risk**: Warehouse telemetry, safety stock surveillance, price anomaly detection, and ranked backup suppliers.
4. **AI Agent Observability**: Agent registry, token cost tracking in INR, and human-in-the-loop approval gates.
5. **Climate & Business Continuity**: Meteorological threat radar, BIA critical processes, and ISO 22301 draft recovery plans.

---

## 2. Technology Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with custom liquid glass luxury dark/light theme
- **Visualizations**: Recharts (radar charts, aging bar charts, financial area charts)
- **Icons**: Lucide React
- **Validation**: Zod runtime schema validation

---

## 3. Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured.

### Development Server
```bash
npm run dev
```
Accessible at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
The compiled static assets will be in `dist/`.
