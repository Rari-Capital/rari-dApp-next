declare class RariCache {
  _raw: {};
  constructor(timeouts: any);
  getOrUpdate(key: any, asyncMethod: any): Promise<any>;
  update(key: any, value: any): any;
  clear(key: any): void;
}
export default RariCache;
