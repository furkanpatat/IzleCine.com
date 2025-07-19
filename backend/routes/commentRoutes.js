const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        return auth(req, res, next);
    }
    next();
};

router.post('/', commentController.addComment); // /api/comments
router.post('/:id/report', auth, commentController.reportComment); // Yorumu raporla
router.get('/:movieId', optionalAuth, commentController.getCommentsByMovie); // /api/comments/:movieId
router.put('/:id', auth, commentController.updateComment); // Yorumu güncelle
router.delete('/:id', auth, commentController.deleteComment);
router.post('/:id/like', auth, (req, res) => commentController.voteComment({ ...req, params: { ...req.params, type: 'like' } }, res));
router.post('/:id/dislike', auth, (req, res) => commentController.voteComment({ ...req, params: { ...req.params, type: 'dislike' } }, res));
// Admin: Raporlanan yorumları getir
router.get('/admin/reportedComments', adminAuth, commentController.getReportedComments);
// Admin: Raporlanan yorumu sil
router.delete('/admin/:id', adminAuth, commentController.adminDeleteComment);

module.exports = router; 