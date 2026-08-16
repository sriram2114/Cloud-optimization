# CloudCostX – Multi-Cloud FinOps Cost Management & Optimization Platform

**Tagline:** *Monitor. Optimize. Govern. Save.*

CloudCostX is a full-stack FinOps platform for multi-cloud cost management, optimization, governance, and reporting. It combines a React dashboard with a Spring Boot REST API backed by MySQL.

---

## Architecture

```
React/Vite Frontend (port 5173)
        ↓ Axios + JWT
Spring Boot REST API (port 8080)
        ↓ Spring Security
Service Layer (business logic)
        ↓ JPA
MySQL Database (port 3306)
```

### Technology Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router, Axios, Recharts, Lucide React |
| Backend | Java 21, Spring Boot 3.2, Spring Security, JWT, Spring Data JPA |
| Database | MySQL 8 |
| DevOps | Docker, Docker Compose, Maven |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Java 21
- Maven 3.9+
- MySQL 8 (or use Docker Compose)

### 1. Database Setup

```bash
# Create database (if not using Docker)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS cloudcostx;"
```

### 2. Environment Variables

Copy the example env file and configure:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_PASSWORD` | MySQL root password | (required) |
| `JWT_SECRET` | 256-bit JWT signing key | built-in dev key |
| `VITE_USE_API` | Connect frontend to backend | `false` (mock data) |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080/api` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:5173` |

### 3. Start Backend

```bash
export DB_PASSWORD=your_password
mvn spring-boot:run
```

Backend starts at `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### 4. Start Frontend

```bash
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

### 5. Connect Frontend to Backend

Set in `.env`:

```
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:8080/api
```

### Using Docker Compose

```bash
export DB_PASSWORD=cloudcostx123
docker-compose up --build
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cloudcostx.com | admin123 |
| Finance | finance@cloudcostx.com | finance123 |
| DevOps | devops@cloudcostx.com | devops123 |

---

## Frontend Pages

| Route | Feature |
|-------|---------|
| `/login` | Authentication with demo login |
| `/dashboard` | KPIs, charts, top cost drivers |
| `/cost-explorer` | Cost analysis with filters and CSV export |
| `/cloud-accounts` | AWS, Azure, GCP account management |
| `/resources` | Resource inventory with utilization metrics |
| `/budgets` | Budget CRUD with alert thresholds |
| `/optimization` | Right-sizing, RI, storage recommendations |
| `/storage` | Storage tier optimization |
| `/network` | Network traffic cost analysis |
| `/governance` | Policy compliance and violations |
| `/reports` | Report generation and CSV export |
| `/settings` | Profile, notifications, preferences |

---

## API Endpoints

### Authentication
- `POST /api/auth/login` – Login and receive JWT
- `POST /api/auth/register` – Register new user
- `GET /api/auth/me` – Current user profile

### Core APIs
- `GET /api/dashboard` – Dashboard KPIs and charts
- `GET /api/costs` – Cost explorer with filters
- `GET /api/costs/forecast` – Cost forecasting
- `GET /api/cloud-accounts` – Cloud account CRUD + sync
- `GET /api/resources` – Resource inventory
- `GET /api/budgets` – Budget management
- `GET /api/optimization/recommendations` – Optimization engine
- `GET /api/storage` – Storage optimization
- `GET /api/network` – Network analyzer
- `GET /api/governance/policies` – Governance policies
- `GET /api/governance/violations` – Policy violations
- `GET /api/reports/*` – Report generation
- `GET /api/kpis` – FinOps KPIs
- `GET /api/roi` – ROI calculation
- `GET /api/finops/summary` – FinOps lifecycle summary
- `GET /api/chargeback/*` – Chargeback/showback

---

## Database Schema

Core tables: `users`, `cloud_accounts`, `projects`, `cloud_resources`, `cost_records`, `budgets`, `cost_tags`, `optimization_recommendations`, `storage_usage`, `network_usage`, `governance_policies`, `policy_violations`, `alerts`, `notifications`

Relationships use JPA `@OneToMany` / `@ManyToOne` with proper foreign keys and indexes on frequently queried columns (`cost_date`, `provider`, `department`, `project_id`).

---

## FinOps Academic Unit Mapping

| Unit | Backend Features |
|------|-----------------|
| Unit 1 – Introduction | Cost components, ROI, FinOps lifecycle, budgets |
| Unit 2 – Monitoring & Reporting | Tags, cost allocation, KPIs, chargeback/showback, reports |
| Unit 3 – Compute & Storage | Right-sizing, storage tiers, autoscaling recommendations |
| Unit 4 – Network & Multi-Cloud | Egress/inter-region costs, multi-cloud comparison |
| Unit 5 – Governance & Automation | Policy scanning, tag compliance, alerts, Terraform prep |

---

## Future Integration Plan

### AWS / Azure / GCP
Cloud provider interfaces (`CloudCostProvider`) are implemented with mock data. Replace `AWSCloudCostProvider`, `AzureCloudCostProvider`, and `GCPCloudCostProvider` with actual SDK implementations:

- AWS Cost Explorer + CUR
- Azure Cost Management API
- Google Cloud Billing API

### Terraform
Governance service is designed for future Terraform integration:

```
Terraform → Cloud Resources → Tags → CloudCostX Governance Scan
```

Policy-as-code concepts are supported via the governance scan endpoint (`POST /api/governance/scan`).

---

## Project Structure

```
├── src/                          # React frontend
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Route pages
│   ├── services/api.js           # Axios API layer
│   ├── data/                     # Mock JSON data
│   ├── context/                  # Auth & Toast contexts
│   └── layouts/                  # App layout
├── src/main/java/com/cloudcostx/ # Spring Boot backend
│   ├── config/                   # Security, CORS, seed data
│   ├── controller/               # REST controllers
│   ├── service/                  # Business logic
│   ├── entity/                   # JPA entities
│   ├── repository/               # Data access
│   ├── dto/                      # Data transfer objects
│   └── security/                 # JWT authentication
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

---

## Running Tests

```bash
# Backend tests
mvn test

# Frontend lint
npm run lint
```

---

## License

Academic project – CloudCostX FinOps Platform 2026.
