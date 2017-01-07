const ScreepsWebpackPlugin = require('screeps-webpack-plugin');

module.exports = class ScreepsPlugin extends ScreepsWebpackPlugin {
  constructor(options = {handlers: {}}){
    super(options);
  }

  registerHandlers(compilation){
    super.registerHandlers(compilation);
    for(let event of Object.keys(this.options.handlers)){
      compilation.plugin(event, this.options.handlers[event]);
    }
  }
};
