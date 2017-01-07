const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const {post} = require('request');
const {watch} = require('chokidar');
const {transformFileSync} = require('babel-core');
const webpack = require('webpack');
const ScreepsPlugin = require('./screeps-plugin');

class ModuleManager extends EventEmitter {
  constructor (config) {
    super();

    this.config = config;
    this.sourceDir = config.src;
    let webpackConfig = config.webpackConfig;
    let handlers = {};
    handlers[ScreepsPlugin.BEFORE_COMMIT] = this.handleBeforeCommit.bind(this);
    handlers[ScreepsPlugin.AFTER_COMMIT]= this.handleAfterCommit.bind(this);
    this.screepsPlugin = new ScreepsPlugin({
        email: config.username,
        password: config.password,
        handlers
    });
    webpackConfig.plugins.push(this.screepsPlugin);
    this.compiler = webpack(webpackConfig);

    this.compiler.watch({}, (err, stats) => {
      //TODO: Handle errors here
      if(err){
        this.emit('error', err);
      }
    });
  }

  handleBeforeCommit(branch, modules) {
    //console.log(this);
    this.emit('change');
  }

  handleAfterCommit(body) {
    this.emit('upload');
  }
}

module.exports = ModuleManager;
