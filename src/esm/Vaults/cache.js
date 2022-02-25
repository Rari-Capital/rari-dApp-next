var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
class RariCache {
  constructor(timeouts) {
    this._raw = {};
    for (const key of Object.keys(timeouts))
      this._raw[key] = { value: null, lastUpdated: 0, timeout: timeouts[key] };
  }
  getOrUpdate(key, asyncMethod) {
    return __awaiter(this, void 0, void 0, function* () {
      var now = new Date().getTime() / 1000;
      if (
        this._raw[key].value == null ||
        now > this._raw[key].lastUpdated + this._raw[key].timeout
      ) {
        const self = this;
        if (this._raw[key].updating)
          return yield new Promise(function (resolve) {
            return __awaiter(this, void 0, void 0, function* () {
              if (typeof self._raw[key].onUpdate === "undefined")
                self._raw[key].onUpdate = [];
              self._raw[key].onUpdate.push(resolve);
            });
          });
        this._raw[key].updating = true;
        this._raw[key].value = yield asyncMethod();
        this._raw[key].lastUpdated = now;
        this._raw[key].updating = false;
        if (
          typeof this._raw[key].onUpdate !== "undefined" &&
          this._raw[key].onUpdate.length > 0
        ) {
          for (const onUpdate of this._raw[key].onUpdate)
            onUpdate(this._raw[key].value);
          this._raw[key].onUpdate = [];
        }
      }
      return this._raw[key].value;
    });
  }
  update(key, value) {
    var now = new Date().getTime() / 1000;
    this._raw[key].value = value;
    this._raw[key].lastUpdated = now;
    return this._raw[key].value;
  }
  clear(key) {
    this._raw[key].value = null;
    this._raw[key].lastUpdated = 0;
  }
}
export default RariCache;
