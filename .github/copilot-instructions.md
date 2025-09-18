
# Copilot Agent Instructions for OctoCAT Supply Chain Management

## Project Overview

This is a TypeScript-based supply chain management demo with a modular architecture:
- **Backend**: Express.js REST API (`api/`), with models, routes, and OpenAPI docs
- **Frontend**: React 18+ app (`frontend/`), styled with Tailwind CSS, built with Vite
- **DevOps**: Docker/Docker Compose for containerization, VS Code tasks for builds

See [docs/architecture.md](../docs/architecture.md) for diagrams and rationale.

## Key Workflows

- **Build all**: `npm run build` (or VS Code task: Build All)
- **Build API only**: `npm run build --workspace=api` (or VS Code task: Build API)
- **Build Frontend only**: `npm run build --workspace=frontend` (or VS Code task: Build Frontend)
- **Run dev mode**: `npm run dev` (starts both API and frontend with hot reload)
- **Run tests (API)**: `npm run test:api`
- **Lint frontend**: `npm run lint`
- **Docker Compose**: `docker-compose up --build` (runs both API and frontend in containers)

## Project Structure & Conventions

- **API**
	- Source: `api/src/`
	- Models: `api/src/models/` (one file per entity, e.g., `product.ts`)
	- Routes: `api/src/routes/` (REST endpoints, one file per entity)
	- Tests: colocated as `*.test.ts` in `routes/`
	- OpenAPI: `api/api-swagger.json` (auto-generated)
- **Frontend**
	- Source: `frontend/src/`
	- Components: `frontend/src/components/` (domain grouped, e.g., `entity/product/`)
	- Context: `frontend/src/context/` (React context for auth, etc.)
	- API config: `frontend/src/api/config.ts`
	- Tests: `frontend/src/components/__tests__/`
- **Docs**: Architecture, build, and deployment guides in `docs/`
- **Infra**: Deployment scripts in `infra/`

## Patterns & Integration

- **Entity relationships** follow the ERD in `docs/architecture.md` (see `api/models/` for implementation)
- **API/Frontend communication**: REST calls, see `frontend/src/api/config.ts`
- **Testing**: API uses Vitest, tests colocated with routes; frontend uses standard React testing patterns
- **Containerization**: Both API and frontend have Dockerfiles; use `docker-compose.yml` for orchestration

## Examples

- To add a new entity:
	1. Create model in `api/src/models/`
	2. Add REST route in `api/src/routes/`
	3. Update ERD if needed (`docs/architecture.md`)
	4. Add frontend component in `frontend/src/components/entity/`

## References

- [docs/architecture.md](../docs/architecture.md): System diagrams, ERD, component flows
- [docs/build.md](../docs/build.md): Build/run/test details

---
Keep instructions concise and up-to-date. Update this file if project structure or workflows change.