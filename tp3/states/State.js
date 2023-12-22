class State {
    constructor(app) {
      this.app = app;
    }
  
    // Update method to be overridden by subclasses
    update() {
      // Update logic for each state goes here
    }
  }

export { State };