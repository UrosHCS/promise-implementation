class Prom {
  constructor(executor) {
    console.log("--- Custom promise ---");
    this.state = "pending";
    this.value = undefined;
    this.error = undefined;
    this.observers = [];

    setTimeout(() => this.execute(executor), 0);
  }

  execute(executor) {
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  then(onFulfillment, onRejection) {
    if (this.state === "fulfilled") {
      try {
        if (typeof onFulfillment === "function") {
          return Prom.resolve(onFulfillment(this.value));
        } else {
          return Prom.resolve(this.value);
        }
      } catch (e) {
        onRejection(e);
      }
    }

    const promise = new Prom((resolve, reject) => {});
    observer.promise = promise;

    this.observers.push({
      onFulfillment,
      onRejection,
      promise,
    });

    return promise;
  }

  resolve(value) {
    if (this.state !== "pending") {
      return this.value;
    }

    if (value && typeof value.then === "function") {
      value.then(this.performResolve);
      return this.value;
    }

    return this.performResolve(value);
  }

  performResolve(value) {
    this.value = value;

    try {
      // call all functions passed with then()
      let observer;
      for (observer of this.observers) {
        let result;
        if (typeof observer.onFulfillment === "function") {
          result = observer.onFulfillment(this.value);
        }
        observer.promise.resolve(result);
      }
    } catch (error) {
      console.log("Caught error while resolving");
      if (typeof observer.onRejection === "function") {
        observer.onRejection(error);
      } else {
        this.reject(error);
      }
    }

    this.state = "fulfilled";

    return this.value;
  }

  reject(error) {
    this.state = "rejected";
    throw error;
  }

  catch(onRejection) {
    return this.then(undefined, onRejection);
  }

  static all(iterable) {
    //
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }
}

exports.Prom = Prom;
