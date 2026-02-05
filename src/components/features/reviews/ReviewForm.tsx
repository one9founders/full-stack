'use client';

import { useState, useEffect } from 'react';
import { HugeiconsIcon, StarIcon, Edit01Icon } from '@/components/ui/icons';
import { reviewsAPI } from '@/lib/api/apiClient';
import { getCurrentUser } from '@/lib/actions/auth';
import { showSuccess, showError } from '@/lib/utils/sweetAlert';
import posthog from 'posthog-js';

interface ReviewFormProps {
  toolId: number;
  toolName: string;
  onReviewAdded: () => void;
}

export default function ReviewForm({ toolId, toolName, onReviewAdded }: ReviewFormProps) {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const reviewData: Record<string, unknown> = {
        tool: toolId,
        user_name: user?.name || 'Anonymous',
        user_email: user?.email || '',
        rating: formData.rating,
        title: formData.title || `Review by ${user?.name || 'Anonymous'}`,
        comment: formData.comment || '' // Make comment optional
      };

      await reviewsAPI.create(reviewData);

      // Capture review submission event
      posthog.capture('review_submitted', {
        tool_id: toolId,
        tool_name: toolName,
        rating: formData.rating,
        has_comment: !!formData.comment,
        reviewer_name: user?.name || 'Anonymous',
      });

      await showSuccess('Success!', 'Review submitted successfully!');
      setFormData({
        rating: 5,
        title: '',
        comment: ''
      });
      onReviewAdded();
    } catch (error) {
      posthog.captureException(error);
      await showError('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="rounded-lg p-6 bg-[var(--gray-900)] border border-[var(--gray-800)]">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <HugeiconsIcon icon={Edit01Icon} size={24} />
        Write a Review for {toolName}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Rating *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className={`${star <= formData.rating ? 'text-yellow-400' : 'text-[var(--gray-600)]'}`}
              >
                <HugeiconsIcon 
                  icon={StarIcon}
                  size={24}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Great tool for..."
            className="w-full px-3 py-2 rounded-lg bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Review (Optional)</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            placeholder="Share your experience with this tool..."
            className="w-full px-3 py-2 rounded-lg resize-vertical bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 bg-[var(--brand-primary)] text-white"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
