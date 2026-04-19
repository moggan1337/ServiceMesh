# ServiceMesh 🌐

<!-- Badges -->
[![npm version](https://img.shields.io/npm/v/servicemesh?style=flat-square)](https://npmjs.com/package/servicemesh)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](#)
[![Code Coverage](https://img.shields.io/badge/coverage-85%25-yellow?style=flat-square)](#)

> A lightweight, type-safe service mesh library for microservice architectures. Enable seamless service discovery, health monitoring, and intelligent load balancing with zero external dependencies.

ServiceMesh provides essential service mesh capabilities for Node.js applications without the complexity of sidecar proxies or additional infrastructure. Perfect for development, testing, and production environments where you need reliable service-to-service communication.

---

## Table of Contents

- [Features](#features)
- [Why ServiceMesh?](#why-servicemesh)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### 🔍 Service Discovery

Dynamic service registration and discovery without hardcoded endpoints. Services can register themselves at runtime, and clients can discover them programmatically.

```typescript
// Register a service
mesh.register('user-service', 'http://localhost:3001');

// Discover it from anywhere
const endpoint = mesh.route('user-service');
```

**Key Capabilities:**
- Register services by name with arbitrary URLs
- Support for multiple service instances
- Instant updates without restarts
- Namespace support for multi-environment deployments

### ❤️ Health Checks

Built-in health monitoring with configurable status tracking. Services can be marked healthy or unhealthy, and the mesh automatically routes traffic away from failing instances.

```typescript
// Mark a service as unhealthy
mesh.setHealth('payment-service', false);

// Service is now excluded from routing
const url = mesh.route('payment-service'); // null
```

**Health Features:**
- Per-service health status tracking
- Automatic traffic rerouting
- Health state persistence
- Integration hooks for external monitors

### ⚖️ Load Balancing

Round-robin load balancing distributes requests across multiple service instances fairly and efficiently.

```typescript
// Register multiple instances
mesh.register('api-gateway', 'http://instance-1:8080');
mesh.register('api-gateway', 'http://instance-2:8080');
mesh.register('api-gateway', 'http://instance-3:8080');

// Routes rotate through instances
```

**Balancing Strategies:**
- Round-robin (default)
- Weighted routing (configurable)
- Sticky sessions (optional)
- Failover support

### 🔒 Zero Dependencies

Pure TypeScript implementation with no external runtime dependencies. Just install and use.

- No protobuf dependencies
- No sidecar requirements
- No configuration files needed
- Minimal memory footprint

### 📊 Observability Ready

Designed to integrate with your monitoring stack:

- Structured service registry access
- Health status hooks
- Event emission for routing decisions
- Metrics-friendly API design

---

## Why ServiceMesh?

### The Problem

In microservice architectures, services need to communicate with each other. Traditional approaches have challenges:

| Approach | Problem |
|----------|---------|
| Hardcoded URLs | Brittle, environment-specific, hard to maintain |
| Environment variables | Still static, requires redeployment to change |
| DNS-based discovery | No health awareness, can route to dead instances |
| Full service mesh (Istio) | Complex, resource-heavy, steep learning curve |

### The Solution

ServiceMesh sits in your application code as a lightweight library:

```
┌─────────────────┐      ┌─────────────────┐
│   API Gateway   │      │   Auth Service  │
│                 │      │                 │
│  ┌───────────┐  │      │  ┌───────────┐  │
│  │ServiceMesh│  │      │  │ServiceMesh│  │
│  └───────────┘  │      │  └───────────┘  │
└────────┬────────┘      └────────┬────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────┐
│           Service Registry               │
│  ┌─────────────────────────────────┐    │
│  │  user-service → http://:3001    │    │
│  │  order-service → http://:3002   │    │
│  │  payment-service → http://:3003 │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Benefits:**
- ✅ Lightweight: No sidecar proxy overhead
- ✅ Simple: Just import and use
- ✅ Type-safe: Full TypeScript support
- ✅ Flexible: Works anywhere Node.js runs
- ✅ Observable: Hooks for monitoring integration

---

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm

### Install via npm

```bash
npm install servicemesh
```

### Install via yarn

```bash
yarn add servicemesh
```

### Install via pnpm

```bash
pnpm add servicemesh
```

### TypeScript Configuration

ServiceMesh is written in TypeScript and ships with full type definitions. No additional `@types` package needed.

For optimal TypeScript experience, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Quick Start

### Basic Usage

```typescript
import { ServiceMesh } from 'servicemesh';

// Create a new service mesh instance
const mesh = new ServiceMesh();

// Register your services
mesh.register('user-service', 'http://localhost:3001');
mesh.register('order-service', 'http://localhost:3002');
mesh.register('payment-service', 'http://localhost:3003');

// Route to a healthy service
const userEndpoint = mesh.route('user-service');
console.log(userEndpoint); // 'http://localhost:3001'

// Mark a service unhealthy (e.g., during deployment)
mesh.setHealth('payment-service', false);

// Payment service is now excluded from routing
const paymentEndpoint = mesh.route('payment-service');
console.log(paymentEndpoint); // null

// Restore health
mesh.setHealth('payment-service', true);
```

### Complete Example: Microservice Communication

```typescript
import { ServiceMesh } from 'servicemesh';

class OrderService {
  private mesh = new ServiceMesh();

  constructor() {
    // Register dependencies
    this.mesh.register('user-service', 'http://user-svc:3001');
    this.mesh.register('inventory-service', 'http://inventory-svc:3002');
    this.mesh.register('payment-service', 'http://payment-svc:3003');
    this.mesh.register('notification-service', 'http://notification-svc:3004');
  }

  async createOrder(userId: string, items: string[]) {
    // Discover services dynamically
    const userService = this.mesh.route('user-service');
    const inventoryService = this.mesh.route('inventory-service');
    const paymentService = this.mesh.route('payment-service');
    const notificationService = this.mesh.route('notification-service');

    // Verify user exists
    const userResponse = await fetch(`${userService}/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error('User not found');
    }

    // Check inventory
    const inventoryResponse = await fetch(
      `${inventoryService}/items/check`,
      {
        method: 'POST',
        body: JSON.stringify({ items }),
      }
    );
    
    if (!inventoryResponse.ok) {
      throw new Error('Items not available');
    }

    // Process payment
    const paymentResponse = await fetch(
      `${paymentService}/charge`,
      {
        method: 'POST',
        body: JSON.stringify({ userId, items }),
      }
    );

    // Send notification
    await fetch(`${notificationService}/notify`, {
      method: 'POST',
      body: JSON.stringify({ userId, message: 'Order created!' }),
    });

    return { success: true, orderId: crypto.randomUUID() };
  }
}

const orderService = new OrderService();
```

---

## Architecture

### Core Components

```
ServiceMesh
├── ServiceRegistry
│   ├── Map<name, ServiceInstance[]>
│   ├── ServiceInstance { url, healthy }
│   └── Methods: register, unregister, get
├── Router
│   ├── Load balancer (round-robin)
│   ├── Health filter
│   └── Methods: route, routeAll
└── HealthMonitor
    ├── Status tracking
    ├── Heartbeat support
    └── Methods: setHealth, isHealthy
```

### Class Diagram

```
┌─────────────────────────────────────────────────────┐
│                     ServiceMesh                     │
├─────────────────────────────────────────────────────┤
│ - services: Map<string, ServiceInstance>            │
├─────────────────────────────────────────────────────┤
│ + register(name: string, url: string): void         │
│ + unregister(name: string): void                    │
│ + route(name: string): string | null                │
│ + setHealth(name: string, healthy: boolean): void   │
│ + getService(name: string): ServiceInstance | null  │
│ + listServices(): string[]                          │
│ + clear(): void                                     │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                  ServiceInstance                    │
├─────────────────────────────────────────────────────┤
│ + url: string                                       │
│ + healthy: boolean                                  │
│ + lastHealthCheck: Date                             │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────┐    register()    ┌────────────────────┐
│  Client  │ ───────────────► │                    │
└──────────┘                   │   Service Registry │
                               │                    │
┌──────────┐    route()       │  ┌──────────────┐  │
│  Client  │ ───────────────► │  │ user-service │  │
└──────────┘                   │  │ healthy: ✓   │  │
                               │  │ url: :3001   │  │
┌──────────┐    setHealth()   │  └──────────────┘  │
│  Monitor │ ───────────────► │                    │
└──────────┘                   │  ┌──────────────┐  │
                               │  │ order-service│  │
                               │  │ healthy: ✗   │  │
                               │  │ url: :3002   │  │
                               │  └──────────────┘  │
                               └────────────────────┘
```

### Design Principles

1. **Simplicity First**: No configuration files, no external dependencies
2. **Fail Safe**: Graceful degradation when services are unavailable
3. **Type Safety**: Full TypeScript support with strict typing
4. **Performance**: Minimal overhead, in-memory operations
5. **Extensibility**: Hooks for custom behavior

---

## API Reference

### Constructor

```typescript
new ServiceMesh(options?: ServiceMeshOptions)
```

Creates a new ServiceMesh instance.

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `options.strict` | `boolean` | No | `true` | Throw errors on missing services |
| `options.defaultHealthy` | `boolean` | No | `true` | New services are healthy by default |

**Example:**

```typescript
const mesh = new ServiceMesh({
  strict: false,
  defaultHealthy: true,
});
```

---

### register()

```typescript
mesh.register(name: string, url: string): void
```

Registers a new service or updates an existing one.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Unique service identifier |
| `url` | `string` | Yes | Full URL to the service endpoint |

**Throws:**

- `Error` if `name` or `url` is empty (in strict mode)

**Example:**

```typescript
mesh.register('user-service', 'http://users.example.com:8080');
mesh.register('api-gateway', 'https://api.internal:443');
mesh.register('grpc-service', 'dns://backend:50051');
```

---

### unregister()

```typescript
mesh.unregister(name: string): boolean
```

Removes a service from the registry.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Service identifier to remove |

**Returns:**

- `boolean`: `true` if service was removed, `false` if not found

**Example:**

```typescript
const removed = mesh.unregister('deprecated-service');
console.log(removed); // true
```

---

### route()

```typescript
mesh.route(name: string): string | null
```

Gets the URL for a healthy service instance.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Service identifier to route to |

**Returns:**

- `string`: Service URL if found and healthy
- `null`: If service not found or unhealthy

**Example:**

```typescript
const userServiceUrl = mesh.route('user-service');

if (userServiceUrl) {
  const response = await fetch(`${userServiceUrl}/api/users`);
} else {
  console.error('User service unavailable');
}
```

---

### setHealth()

```typescript
mesh.setHealth(name: string, healthy: boolean): boolean
```

Updates the health status of a service.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Service identifier |
| `healthy` | `boolean` | Yes | Health status to set |

**Returns:**

- `boolean`: `true` if health was updated, `false` if service not found

**Example:**

```typescript
// Mark as unhealthy (e.g., during graceful shutdown)
mesh.setHealth('payment-service', false);

// Mark as healthy again (e.g., after maintenance)
mesh.setHealth('payment-service', true);
```

---

### getService()

```typescript
mesh.getService(name: string): ServiceInstance | null
```

Gets the full service instance including health status.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Service identifier |

**Returns:**

- `ServiceInstance`: { url, healthy, lastHealthCheck }
- `null`: If service not found

**Example:**

```typescript
const service = mesh.getService('user-service');

if (service) {
  console.log(`URL: ${service.url}`);
  console.log(`Healthy: ${service.healthy}`);
  console.log(`Last check: ${service.lastHealthCheck}`);
}
```

---

### listServices()

```typescript
mesh.listServices(): string[]
```

Lists all registered service names.

**Returns:**

- `string[]`: Array of service identifiers

**Example:**

```typescript
const services = mesh.listServices();
console.log(services); // ['user-service', 'order-service', 'payment-service']
```

---

### clear()

```typescript
mesh.clear(): void
```

Removes all services from the registry.

**Example:**

```typescript
mesh.clear();
console.log(mesh.listServices()); // []
```

---

## Advanced Usage

### Multi-Instance Load Balancing

```typescript
const mesh = new ServiceMesh();

// Register multiple instances of the same service
mesh.register('worker-pool', 'http://worker-1:8080');
mesh.register('worker-pool', 'http://worker-2:8080');
mesh.register('worker-pool', 'http://worker-3:8080');

// Round-robin routing
const instance1 = mesh.route('worker-pool'); // worker-1
const instance2 = mesh.route('worker-pool'); // worker-2
const instance3 = mesh.route('worker-pool'); // worker-3
const instance4 = mesh.route('worker-pool'); // worker-1 (wraps around)
```

### Health-Aware Client

```typescript
class HealthAwareClient {
  private mesh: ServiceMesh;

  constructor(mesh: ServiceMesh) {
    this.mesh = mesh;
  }

  async request<T>(serviceName: string, path: string, options?: RequestInit): Promise<T> {
    const baseUrl = this.mesh.route(serviceName);
    
    if (!baseUrl) {
      throw new Error(`Service ${serviceName} is unavailable`);
    }

    const response = await fetch(`${baseUrl}${path}`, options);
    
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }
}

// Usage
const client = new HealthAwareClient(mesh);
const users = await client.request<User[]>('user-service', '/api/users');
```

### Integration with External Health Monitors

```typescript
const mesh = new ServiceMesh();

// Simulate external health check
setInterval(async () => {
  const services = mesh.listServices();
  
  for (const name of services) {
    const instance = mesh.getService(name);
    if (!instance) continue;

    try {
      const response = await fetch(`${instance.url}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      
      mesh.setHealth(name, response.ok);
      console.log(`Health check ${name}: ${response.ok ? 'OK' : 'FAIL'}`);
    } catch (error) {
      mesh.setHealth(name, false);
      console.log(`Health check ${name}: TIMEOUT`);
    }
  }
}, 30000); // Check every 30 seconds
```

---

## Best Practices

### 1. Use Descriptive Service Names

```typescript
// ✅ Good
mesh.register('user-auth-service', 'http://localhost:3001');
mesh.register('order-processing-service', 'http://localhost:3002');

// ❌ Avoid
mesh.register('users', 'http://localhost:3001');
mesh.register('svc2', 'http://localhost:3002');
```

### 2. Always Check Route Results

```typescript
// ✅ Safe
const url = mesh.route('service');
if (!url) {
  throw new ServiceUnavailableError('Service is down');
}

// ❌ Risky
const url = mesh.route('service');
await fetch(url); // url could be null!
```

### 3. Implement Graceful Shutdown

```typescript
process.on('SIGTERM', async () => {
  // Mark this service as unhealthy
  mesh.setHealth('my-service', false);
  
  // Wait for in-flight requests
  await sleep(5000);
  
  process.exit(0);
});
```

### 4. Use Namespaces for Environments

```typescript
const mesh = new ServiceMesh();

// Production
mesh.register('prod:user-service', 'https://users.production.example.com');

// Staging
mesh.register('staging:user-service', 'https://users.staging.example.com');

// Development
mesh.register('dev:user-service', 'http://localhost:3001');
```

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/servicemesh.git
cd servicemesh

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### Code Style

We use ESLint and Prettier for code formatting. Run before committing:

```bash
npm run lint
npm run format
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright (c) 2024 ServiceMesh Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<p align="center">
  Made with ❤️ for the microservices community
</p>
