export class ServiceMesh {
  private services = new Map<string, { url: string; healthy: boolean }>();
  register(name: string, url: string) { this.services.set(name, { url, healthy: true }); }
  unregister(name: string) { this.services.delete(name); }
  route(name: string) { const s = this.services.get(name); return s?.healthy ? s.url : null; }
  setHealth(name: string, healthy: boolean) { const s = this.services.get(name); if (s) s.healthy = healthy; }
}
export default ServiceMesh;
