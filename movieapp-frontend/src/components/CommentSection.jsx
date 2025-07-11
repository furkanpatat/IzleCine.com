import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flag, MessageSquare, Send } from 'lucide-react';
import Comment from './Comment';
import axios from 'axios';
import LoginPromptModal from './LoginPromptModal';

const CommentSection = ({ movieId }) => {
    // Yorumlar başlangıçta boş olacak
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isAdmin] = useState(false); // This would come from user context in a real app
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Check if user is authenticated
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // Check if user is authenticated
        if (!isAuthenticated()) {
            setShowLoginModal(true);
            return;
        }

        // Kullanıcı bilgisi localStorage'dan alınır
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        if (!user || !token) {
            alert('Yorum yapmak için giriş yapmalısınız!');
            return;
        }
        // Backend'e gönderilecek veriyi logla
        console.log('Yorum POST verisi:', { userId: user.id || user._id, movieId, content: newComment });
        try {
            const response = await axios.post('/api/comments', {
                userId: user.id || user._id, // id veya _id olabilir
                movieId,
                content: newComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const comment = response.data.comment || {
                _id: Date.now().toString(),
                content: newComment,
                user: { username: user.username, profileImage: '/default-avatar.png' },
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                status: 'active'
            };
            setComments([comment, ...comments]);
            setNewComment('');
        } catch (err) {
            alert('Yorum eklenirken bir hata oluştu!');
        }
    };

    const handleVote = async (commentId, voteType) => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            setShowLoginModal(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/api/comments/${commentId}/vote`, {
                voteType
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the comment in the local state
            setComments(prevComments => 
                prevComments.map(comment => 
                    comment._id === commentId 
                        ? { ...comment, [voteType]: response.data[voteType] }
                        : comment
                )
            );
        } catch (error) {
            console.error('Vote error:', error);
        }
    };

    const handleReport = async (commentId) => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            setShowLoginModal(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/comments/${commentId}/report`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Yorum başarıyla rapor edildi!');
        } catch (error) {
            console.error('Report error:', error);
            alert('Rapor oluşturulurken bir hata oluştu!');
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleHide = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/comments/${commentId}/hide`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prevComments => 
                prevComments.map(comment => 
                    comment._id === commentId 
                        ? { ...comment, status: 'hidden' }
                        : comment
                )
            );
        } catch (error) {
            console.error('Hide error:', error);
        }
    };

    return (
        <div className="mt-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
                <MessageSquare className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Yorumlar
                </h2>
            </div>

            {/* Comment Input Form */}
            <form onSubmit={handleSubmitComment} className="mb-12">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Filim hakkında düşüncelerinizi paylaşın..."
                        className="w-full h-32 bg-gray-700/30 rounded-xl p-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all duration-200"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/20"
                        >
                            <Send className="w-4 h-4" />
                            <span>Yorum Yap</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">Henüz yorum yok</h3>
                        <p className="text-gray-500">İlk yorumu siz yapın!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <img
                                            src={comment.user.profileImage || '/default-avatar.png'}
                                            alt={comment.user.username}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{comment.user.username}</h3>
                                        <p className="text-sm text-gray-400">
                                            {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {comment.status === 'hidden' && (
                                        <span className="px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full">
                                            Gizli
                                        </span>
                                    )}
                                    {comment.status === 'reported' && (
                                        <span className="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                                            Rapor Edildi
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-700/30 rounded-xl p-4 mb-4">
                                <p className="text-gray-200 leading-relaxed text-lg">{comment.content}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleVote(comment._id, 'likes')}
                                        className="flex items-center text-gray-300 hover:text-green-400 transition-colors duration-200 group"
                                    >
                                        <div className="p-2 rounded-lg bg-gray-700/30 group-hover:bg-green-500/10 transition-colors duration-200">
                                            <ThumbsUp className="w-5 h-5" />
                                        </div>
                                        <span className="ml-2 font-medium">{comment.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => handleVote(comment._id, 'dislikes')}
                                        className="flex items-center text-gray-300 hover:text-red-400 transition-colors duration-200 group"
                                    >
                                        <div className="p-2 rounded-lg bg-gray-700/30 group-hover:bg-red-500/10 transition-colors duration-200">
                                            <ThumbsDown className="w-5 h-5" />
                                        </div>
                                        <span className="ml-2 font-medium">{comment.dislikes}</span>
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {!isAdmin && comment.status !== 'reported' && (
                                        <button
                                            onClick={() => handleReport(comment._id)}
                                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors duration-200 hover:bg-red-500/10 rounded-lg group"
                                        >
                                            <div className="p-1.5 rounded-lg bg-gray-700/30 group-hover:bg-red-500/10 transition-colors duration-200">
                                                <Flag className="w-4 h-4" />
                                            </div>
                                            <span className="ml-2">Raporla</span>
                                        </button>
                                    )}

                                    {isAdmin && (
                                        <>
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors duration-200 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <Flag className="w-4 h-4 mr-2" />
                                                <span>Sil</span>
                                            </button>
                                            <button
                                                onClick={() => handleHide(comment._id)}
                                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-200 hover:bg-yellow-500/10 rounded-lg"
                                            >
                                                <Flag className="w-4 h-4 mr-2" />
                                                <span>Gizle</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Login Modal */}
            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                actionType="yorum yapma"
            />
        </div>
    );
};

export default CommentSection; 