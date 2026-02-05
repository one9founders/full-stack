'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submissionAPI } from '@/lib/api/apiClient';
import { showSuccess, showError } from '@/lib/utils/sweetAlert';
import posthog from 'posthog-js';

export default function SubmitToolPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    submitter_email: '',
    submitter_name: '',
    logo_url: '',
    short_description: '',
    pricing_info: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.website || !formData.submitter_email || !formData.submitter_name) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const submissionData: Record<string, unknown> = { ...formData };

      await submissionAPI.submit(submissionData);

      // Capture tool submission event
      posthog.capture('tool_submitted', {
        tool_name: formData.name,
        tool_website: formData.website,
        submitter_email: formData.submitter_email,
        submitter_name: formData.submitter_name,
        has_pricing_info: !!formData.pricing_info,
        has_logo: !!formData.logo_url,
      });

      await showSuccess('Success!', 'Tool submitted successfully! It will be reviewed and added to the directory.');
      setFormData({
        name: '',
        description: '',
        website: '',
        submitter_email: '',
        submitter_name: '',
        logo_url: '',
        short_description: '',
        pricing_info: ''
      });
    } catch (error) {
      posthog.captureException(error);
      await showError('Error', 'Failed to submit tool. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-[var(--gray-black)] border-b border-[var(--gray-800)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8" draggable={false} />
          </Link>
          <Link href="/" className="text-[var(--gray-400)] hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Submit an AI Tool
          </h1>
          <p className="text-xl text-[var(--gray-300)] mb-12">
            Help fellow founders discover amazing AI tools by submitting your recommendations
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg p-8 bg-[var(--gray-900)] border border-[var(--gray-800)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tool Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Tool Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., ChatGPT, Midjourney, Notion AI"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label htmlFor="short_description" className="block text-sm font-medium text-white mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  placeholder="Brief one-liner about the tool"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this tool does and how it helps founders/startups..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-vertical bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
                <p className="text-sm text-[var(--gray-400)] mt-1">
                  Be specific about the tool's features and benefits for startups
                </p>
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-white mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
              </div>

              {/* Logo URL */}
              <div>
                <label htmlFor="logo_url" className="block text-sm font-medium text-white mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  id="logo_url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>

              {/* Pricing Info */}
              <div>
                <label htmlFor="pricing_info" className="block text-sm font-medium text-white mb-2">
                  Pricing Information
                </label>
                <textarea
                  id="pricing_info"
                  name="pricing_info"
                  value={formData.pricing_info}
                  onChange={handleChange}
                  placeholder="e.g., Free tier available, Paid plans start at $10/month"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-vertical bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>

              {/* Submitter Name */}
              <div>
                <label htmlFor="submitter_name" className="block text-sm font-medium text-white mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="submitter_name"
                  name="submitter_name"
                  value={formData.submitter_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
              </div>

              {/* Submitter Email */}
              <div>
                <label htmlFor="submitter_email" className="block text-sm font-medium text-white mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="submitter_email"
                  name="submitter_email"
                  value={formData.submitter_email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white ${
                    loading ? 'bg-[var(--gray-700)]' : 'bg-[var(--brand-primary)]'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Tool'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg ${messageType === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Submission Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">What We're Looking For</h3>
              <ul className="space-y-3 text-[var(--gray-300)]">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  AI-powered tools that solve real business problems
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Tools specifically useful for startups and founders
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Clear, detailed descriptions of functionality
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Active, maintained tools with good reputation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Please Avoid</h3>
              <ul className="space-y-3 text-[var(--gray-300)]">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Duplicate submissions of existing tools
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Tools that are no longer active or maintained
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Vague or marketing-heavy descriptions
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  Tools without clear AI/automation features
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Help Build the Directory</h2>
          <p className="text-xl text-[var(--gray-300)] mb-8">
            Every submission helps fellow founders discover tools that can accelerate their growth. 
            Your contribution makes a difference in the startup community.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/admin" className="btn-secondary">
              View Admin Panel
            </Link>
            <Link href="/" className="btn-primary">
              Explore Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[var(--gray-black)] border-t border-[var(--gray-800)]">
        <div className="max-w-7xl mx-auto text-center text-[var(--gray-400)]">
          <p>&copy; 2024 One9Founders. Built for founders, by founders.</p>
        </div>
      </footer>
    </div>
  );
}
