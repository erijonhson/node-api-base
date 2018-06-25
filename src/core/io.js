const glob = require('glob');
const _ = require('lodash');
const jsonWebToken = require('./jsonWebToken');

module.exports = http => {
  const io = require('socket.io')(http);

  io.use((socket, next) => {
    jsonWebToken.authenticateSocket(socket.request).then(user => {
      socket.join(user.id);
      socket.join('global');
      next();
    }).catch(err => {
      next(err);
    });
  });

  io.on('connection', (socket) => {
    const connections = glob.sync(__dirname + '/../services/**/*connection.js', {});
    _.each(connections, (file) => {
      require(file)(socket, io);
    });
  });

  return io;
};
