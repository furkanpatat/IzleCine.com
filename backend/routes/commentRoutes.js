const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        return auth(req, res, next);
    }
    next();
};

router.post('/', commentController.addComment); // /api/comments
router.get('/:movieId', optionalAuth, commentController.getCommentsByMovie); // /api/comments/:movieId
router.delete('/:id', auth, commentController.deleteComment);
router.post('/:id/like', auth, (req, res) => commentController.voteComment({ ...req, params: { ...req.params, type: 'like' } }, res));
router.post('/:id/dislike', auth, (req, res) => commentController.voteComment({ ...req, params: { ...req.params, type: 'dislike' } }, res));

module.exports = router; 