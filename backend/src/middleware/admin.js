// backend/src/middleware/admin.js
function admin(req, res, next) {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin only' });
    }
    next();
  }
  
  module.exports = admin; // <<< ასევე პირდაპირ ფუნქცია
  