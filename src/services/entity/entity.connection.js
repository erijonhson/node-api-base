/**
 * Handle socket.io callbacks
 * This file is optional, use only when you need to handle response to socket 
 * events issued to the client (for example, push notifications)
 */

// const entityService = require('./entity.service');

module.exports = (socket, io) => {
  socket.on('somethingCallback', (data) => {
    console.log(data);
    // entityService.something(data);
  });

  socket.on('otherthingCallback', (data) => {
    console.log(data);
  });
};
