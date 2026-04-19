# ServiceMesh 🌐

**Service Discovery** - Register, route, health checks.

## Features

- **📝 Registry** - Service registration
- **🔍 Discovery** - Find services
- **⚖️ Load Balancing** - Round-robin
- **❤️ Health Checks** - Monitor health

## Installation

```bash
npm install servicemesh
```

## Usage

```typescript
import { ServiceMesh } from 'servicemesh';

const mesh = new ServiceMesh();

// Register
mesh.register('users', 'http://users-svc:3000');
mesh.register('orders', 'http://orders-svc:3001');

// Route
const url = mesh.route('users');
console.log(url); // 'http://users-svc:3000'

// Health
mesh.setHealth('users', false);
```

## License

MIT
