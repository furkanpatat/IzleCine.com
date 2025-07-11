const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/', commentController.addComment); // /api/comments
router.get('/:movieId', commentController.getCommentsByMovie); // /api/comments/:movieId
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router; 