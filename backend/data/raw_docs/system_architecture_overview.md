System Architecture Overview
1. Philosophy & High-Level Design
The system uses a microservices architecture. This model is chosen for high scalability, fault isolation (if one service fails, others remain operational), and the ability for teams to develop, deploy, and scale their services independently.

All services are containerized using Docker and orchestrated in our production environment via Kubernetes (K8s).

2. Core Services
This is not an exhaustive list, but covers the primary services in our ecosystem.

API Gateway:

Description: The single entry point for all external client (web/mobile) traffic. It routes external HTTP requests to the appropriate internal services.

Responsibilities: Request/response transformation, rate limiting, and authenticating requests by public key before forwarding.

Auth Service:

Description: Handles all user authentication and authorization.

Responsibilities: User registration, login (password hashing), password reset, and the generation/validation of JSON Web Tokens (JWTs).

Database: PostgreSQL (Chosen for its relational integrity for user data, roles, and permissions).

Billing Service:

Description: Manages all payment and subscription-related logic.

Responsibilities: Creating subscriptions, managing payment workflows (integrates with Stripe), generating invoices, and handling subscription lifecycle events (e.g., trial.ended).

Database: MongoDB (A NoSQL database chosen for its flexible schema, which is ideal for storing varied invoice and subscription plan structures).

Notification Service:

Description: Manages all asynchronous, non-blocking communication to users.

Responsibilities: Sending transactional emails (e.g., "Welcome," "Password Reset"), push notifications, and in-app alerts. It consumes events from other services.

Database: Redis (for queueing messages).

3. Communication Patterns
Services communicate using two primary patterns:

1. Synchronous (REST + gRPC):

REST: Used for client-to-gateway communication and for simple, internal request/response actions.

gRPC: Used for high-performance, low-latency, internal service-to-service communication where strong contracts are needed (e.g., the API Gateway calling the Auth Service).

2. Asynchronous (Event Bus - RabbitMQ):

Description: To decouple services, we use an event bus. Services publish events (e.g., UserCreated) without knowing which services will consume them.

Example: When a user signs up, the Auth Service publishes a user.created event. The Billing Service (to create a trial) and Notification Service (to send a welcome email) both subscribe to and react to this event.

4. Deployment & Infrastructure (DevOps)
Containerization: All services are built as Docker images.

Orchestration: We use Kubernetes (K8s) to manage, scale, and deploy our containerized services in the cloud (AWS EKS).

CI/CD: We use GitHub Actions. When a PR is merged to main, it automatically triggers a build of the new Docker image, pushes it to our container registry (ECR), and then deplDetails of the Kubernetes deployment to roll out the new version.

Monitoring: We use a stack of Prometheus (for metrics), Grafana (for dashboards), and Loki (for log aggregation).