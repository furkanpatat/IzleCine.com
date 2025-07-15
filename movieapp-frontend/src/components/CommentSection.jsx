import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Flag, MessageSquare, Send } from 'lucide-react';
import Comment from './Comment';
import LoginPromptModal from './LoginPromptModal';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CommentSection = ({ movieId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isAdmin] = useState(false); // This would come from user context in a real app
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginAction, setLoginAction] = useState('');
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    // API base URL for production
    const API_BASE = process.env.REACT_APP_API_URL || '/api';

    // Yorumları backend'den çek
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get(`${API_BASE}/comments/${movieId}`, { headers });

                // Backend'den gelen yorumları frontend formatına çevir
                const formattedComments = response.data.map(comment => ({
                    _id: comment._id,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    likes: comment.likes || 0,
                    dislikes: comment.dislikes || 0,
                    userVote: comment.userVote || null,
                    status: comment.status || 'active',
                    user: {
                        username: comment.userId?.username || 'Anonim',
                        profileImage: comment.userId?.profileImage || '/default-avatar.png'
                    }
                }));

                setComments(formattedComments);
            } catch (err) {
                console.error('Yorumlar yüklenirken hata:', err);
                // Hata durumunda boş array bırak
                setComments([]);
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchComments();
        }
    }, [movieId, API_BASE]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // Kullanıcı bilgisi localStorage'dan alınır
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        if (!user || !token) {
            setLoginAction(t('Yorum yapmak'));
            setShowLoginModal(true);
            return;
        }
        // Backend'e gönderilecek veriyi logla
        console.log('Yorum POST verisi:', { userId: user.id || user._id, movieId, content: newComment });
        try {
            const response = await axios.post(`${API_BASE}/comments`, {
                userId: user.id || user._id, // id veya _id olabilir
                movieId,
                content: newComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Backend'den gelen yorumu frontend formatına çevir
            const newCommentObj = {
                _id: response.data.comment._id,
                content: response.data.comment.content,
                createdAt: response.data.comment.createdAt,
                likes: 0,
                dislikes: 0,
                userVote: null,
                status: 'active',
                user: {
                    username: response.data.comment.userId?.username || user.username,
                    profileImage: response.data.comment.userId?.profileImage || '/default-avatar.png'
                }
            };
            setComments([newCommentObj, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Yorum ekleme hatası:', err);
            alert(t('Yorum eklenirken bir hata oluştu!'));
        }
    };

    const handleVote = async (commentId, voteType) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        if (!user || !token) {
            setLoginAction(t('Oy vermek'));
            setShowLoginModal(true);
            return;
        }
        let endpoint = '';
        if (voteType === 'likes') endpoint = 'like';
        else if (voteType === 'dislikes') endpoint = 'dislike';
        else return;
        try {
            const response = await axios.post(`${API_BASE}/comments/${commentId}/${endpoint}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(prevComments => prevComments.map(comment =>
                comment._id === commentId
                    ? {
                        ...comment,
                        likes: response.data.likes,
                        dislikes: response.data.dislikes,
                        userVote: endpoint === 'like' ? 'like' : 'dislike'
                    }
                    : comment
            ));
        } catch (err) {
            console.error('Oy verme hatası:', err);
        }
    };

    const handleReport = async (commentId) => {
        // Check if user is authenticated
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');

        if (!user || !token) {
            setLoginAction(t('Yorum raporlamak'));
            setShowLoginModal(true);
            return;
        }

        try {
            await axios.post(`${API_BASE}/comments/${commentId}/report`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(t('Yorum başarıyla raporlandı!'));
        } catch (err) {
            alert(t('Raporlama sırasında bir hata oluştu!'));
        }
    };

    const handleDelete = (commentId) => {
        setComments(comments.filter(comment => comment._id !== commentId));
    };

    const handleHide = (commentId) => {
        setComments(comments.map(comment => {
            if (comment._id === commentId) {
                return {
                    ...comment,
                    status: 'hidden'
                };
            }
            return comment;
        }));
    };

    const handleContinueAsGuest = () => {
        setShowLoginModal(false);
        // User can continue browsing without authentication
    };

    return (
        <>
            <div className="mt-12 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-8">
                    <MessageSquare className="w-6 h-6 text-purple-500" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {t('Yorumlar')}
                    </h2>
                </div>

                {/* Comment Input Form */}
                <form onSubmit={handleSubmitComment} className="mb-12">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={t('Filim hakkında düşüncelerinizi paylaşın...')}
                            className="w-full h-32 bg-gray-700/30 rounded-xl p-4 text-gray-200 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all duration-200"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/20"
                            >
                                <Send className="w-4 h-4" />
                                <span>{t('Yorum Yap')}</span>
                            </button>
                        </div>
                    </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                    {loading ? (
                        <p className="text-center text-gray-300">{t('Yorumlar yükleniyor...')}</p>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-gray-300">{t('Henüz yorum yapılmamış.')}</p>
                    ) : (
                        comments.map(comment => (
                            <div
                                key={comment._id}
                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <img
                                                src={comment.user.profileImage}
                                                alt={comment.user.username}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/30 shadow-lg"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white text-lg">{comment.user.username}</h3>
                                            <p className="text-sm text-gray-300">
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
                                    {comment.status === 'reported' && (
                                        <span className="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                                            {t('Rapor Edildi')}
                                        </span>
                                    )}
                                </div>

                                <div className="bg-gray-700/30 rounded-xl p-4 mb-4">
                                    <p className="text-gray-200 leading-relaxed text-lg">{comment.content}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleVote(comment._id, 'likes')}
                                            className={`flex items-center text-gray-300 hover:text-green-400 transition-colors duration-200 group ${comment.userVote === 'like' ? 'text-green-400 font-bold' : ''}`}
                                        >
                                            <ThumbsUp className="w-4 h-4 mr-1" />
                                            <span>{t('Beğen')}</span>
                                            <span className="ml-1">{comment.likes || 0}</span>
                                        </button>
                                        <button
                                            onClick={() => handleVote(comment._id, 'dislikes')}
                                            className={`flex items-center text-gray-300 hover:text-red-400 transition-colors duration-200 group ${comment.userVote === 'dislike' ? 'text-red-400 font-bold' : ''}`}
                                        >
                                            <ThumbsDown className="w-4 h-4 mr-1" />
                                            <span>{t('Beğenme')}</span>
                                            <span className="ml-1">{comment.dislikes || 0}</span>
                                        </button>
                                        <button
                                            onClick={() => handleReport(comment._id)}
                                            className="flex items-center text-gray-300 hover:text-yellow-400 transition-colors duration-200 group"
                                        >
                                            <Flag className="w-4 h-4 mr-1" />
                                            <span>{t('Raporla')}</span>
                                        </button>
                                    </div>
                                    {isAdmin && (
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors duration-200 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <span>{t('Sil')}</span>
                                            </button>
                                            <button
                                                onClick={() => handleHide(comment._id)}
                                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-200 hover:bg-yellow-500/10 rounded-lg"
                                            >
                                                <span>{t('Gizle')}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                action={loginAction}
                onContinueAsGuest={handleContinueAsGuest}
            />
        </>
    );
};

export default CommentSection; 