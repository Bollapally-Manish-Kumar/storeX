const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  accessMedia,
  deleteMedia
} = require('../controllers/mediaController');

router.post('/upload', uploadMedia);
router.post('/access', accessMedia);
router.post('/delete', deleteMedia);

module.exports = router;
