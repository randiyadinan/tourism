import React, { useState } from 'react';
import { 
  Star, 
  Check, 
  X, 
  Trash2, 
  MessageSquare } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import type { Review } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ManageReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => reviewService.getAllReviews());
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');

  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filtered = activeTab === 'all'
    ? reviews
    : reviews.filter(r => r.status === activeTab);

  const handleApprove = (id: string) => {
    const updated = reviewService.approveReview(id);
    setReviews(reviews.map(r => r.id === id ? updated : r));
  };

  const handleReject = (id: string) => {
    const updated = reviewService.rejectReview(id);
    setReviews(reviews.map(r => r.id === id ? updated : r));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete review permanently?')) {
      reviewService.deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyingReviewId && replyText.trim()) {
      const updated = reviewService.replyToReview(replyingReviewId, replyText, 'Dinesh Perera (Head of Experience)');
      setReviews(reviews.map(r => r.id === replyingReviewId ? updated : r));
      setReplyingReviewId(null);
      setReplyText('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Review Moderation Queue</h1>
          <p className="text-xs text-stone-500">Approve authentic guest reviews and publish official management replies.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pending' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          Pending Moderation ({reviews.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'approved' ? 'bg-[#0B3D2E] text-white shadow-sm' : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          Live / Approved ({reviews.filter(r => r.status === 'approved').length})
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div key={rev.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={rev.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                  alt={rev.authorName}
                  className="w-9 h-9 rounded-full object-cover border border-[#176B52]"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#062C22]">{rev.authorName}</h4>
                  <p className="text-[10px] text-stone-400">{rev.authorCountry} • {rev.tripType} • {rev.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-[#176B52]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : rev.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {rev.status}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <h5 className="font-bold text-[#062C22]">"{rev.title}"</h5>
              <p className="text-stone-600 leading-relaxed">{rev.content}</p>
            </div>

            {/* Existing management reply */}
            {rev.replyFromManagement && (
              <div className="bg-[#F8F7F2] p-3 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
                <span className="font-bold text-[#0B3D2E] block">Management Reply ({rev.replyFromManagement.responderName}):</span>
                <p>{rev.replyFromManagement.text}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(rev.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(rev.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
                <button
                  onClick={() => setReplyingReviewId(rev.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F8F7F2] hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#176B52]" />
                  <span>Reply</span>
                </button>
              </div>

              <button
                onClick={() => handleDelete(rev.id)}
                className="text-rose-600 hover:text-rose-800 p-1.5"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={!!replyingReviewId}
        onClose={() => setReplyingReviewId(null)}
        title="Post Official LankaVoyage Response"
        maxWidth="md"
      >
        <form onSubmit={handleSendReply} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Official Response Text</label>
            <textarea
              rows={4}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Dear guest, thank you so much for traveling with LankaVoyage..."
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl hover:bg-[#134E3F] transition-colors shadow-sm"
          >
            Publish Management Response
          </button>
        </form>
      </Modal>

    </div>
  );
};
