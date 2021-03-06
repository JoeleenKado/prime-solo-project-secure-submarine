const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
  //this route should return all secrets
  console.log('in /api/secrets GET route');
  console.log('Is User logged in?', req.isAuthenticated());
  console.log('req.user:', req.user);
  
  let userClearance = req.user.clearance_level;
  let queryText = `SELECT * FROM "secret" WHERE "secrecy_level" <= $1;`
  
  // pool.query(`SELECT * FROM "secret" WHERE "secrecy_level" <= ${userClearance};`)
  pool.query(queryText, [userClearance]).then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
