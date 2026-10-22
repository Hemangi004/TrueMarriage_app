import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Eye, Calendar, UserCheck, RefreshCw } from 'lucide-react';
import { getAdminBlogsApi, createAdminBlogApi } from '../../services/apiService';

export const AdminBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Guide');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminBlogsApi();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await createAdminBlogApi({ title, category });
      if (res.success) {
        setShowModal(false);
        setTitle('');
        fetchBlogs();
      }
    } catch (err) {
      alert('Failed to publish post');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Blogs & Articles Governance</h1>
            <p className="text-xs text-slate-500">Publish content articles, manage guides, and track blog readerships</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#F01472] hover:bg-pink-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
          <button
            onClick={fetchBlogs}
            className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#F01472] font-bold text-xs rounded-xl flex items-center gap-2 border border-pink-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Blogs List */}
      <div className="space-y-3">
        {blogs.map((b) => (
          <div key={b.id} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                  {b.category}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${b.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {b.status}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{b.title}</h3>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-slate-400" /> {b.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {b.publishedAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl shrink-0 self-start sm:self-auto">
              <Eye className="w-4 h-4 text-purple-600" />
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">READS</span>
                <span className="font-black text-slate-900 text-sm">{b.views?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 max-w-md w-full border border-pink-100 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-slate-900">Publish New Blog Article</h3>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Article Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Secrets to Finding Your Perfect Match"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-pink-500 outline-none bg-white"
              >
                <option value="Guide">Guide</option>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Relationships">Relationships</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#F01472] hover:bg-pink-600 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
