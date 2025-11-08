/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { BookOpen, Download, Star, Search, Eye, Plus } from 'lucide-react';
import {
  useGetSafetyStudyMaterialsQuery,
  usePostSafetyStudyMaterialsMutation,
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';

interface StudyMaterialForm {
  title: string;
  description: string;
  course_code: string;
  course_name: string;
  material_type: 'notes' | 'study_guide' | 'practice_exam' | 'syllabus' | 'other';
  file_url: string;
}

export default function StudyMaterialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState<StudyMaterialForm>({
    title: '',
    description: '',
    course_code: '',
    course_name: '',
    material_type: 'notes',
    file_url: ''
  });

  const { data: materialsData, isLoading } = useGetSafetyStudyMaterialsQuery({
    search: searchQuery.trim() || undefined,
  });

  const [uploadMaterial] = usePostSafetyStudyMaterialsMutation();

  const materials = materialsData?.results || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleUploadFormChange = (field: keyof StudyMaterialForm, value: any) => {
    setUploadForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.title.trim() || !uploadForm.course_code.trim()) return;

    try {
      await uploadMaterial({
        studyMaterial: {
          title: uploadForm.title,
          description: uploadForm.description || undefined,
          course_code: uploadForm.course_code,
          course_name: uploadForm.course_name || undefined,
          material_type: uploadForm.material_type,
          file_url: uploadForm.file_url || undefined,
        }
      }).unwrap();

      setUploadForm({
        title: '',
        description: '',
        course_code: '',
        course_name: '',
        material_type: 'notes',
        file_url: ''
      });
      setShowUploadForm(false);
    } catch (error) {
      console.error('Failed to upload material:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'notes': return '📝';
      case 'study_guide': return '📚';
      case 'practice_exam': return '📋';
      case 'syllabus': return '📄';
      default: return '📄';
    }
  };

  const getMaterialTypeColor = (type: string) => {
    switch (type) {
      case 'notes': return 'bg-blue-100 text-blue-800';
      case 'study_guide': return 'bg-green-100 text-green-800';
      case 'practice_exam': return 'bg-red-100 text-red-800';
      case 'syllabus': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <BookOpen className="h-6 w-6 mr-2" />
              Study Materials
            </h1>
            <p className="text-gray-600">Share and access academic resources</p>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Material
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by course, title, or keywords..."
              />
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div key={material.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMaterialTypeIcon(material.material_type || '')}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMaterialTypeColor(material.material_type || '')}`}>
                      {material.material_type?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {material.title}
                </h3>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="font-medium text-blue-600">{material.course_code}</span>
                </div>

                {material.course_name && (
                  <p className="text-sm text-gray-600 mt-1">{material.course_name}</p>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {material.description && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {material.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{material.download_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>{material.rating || 0}</span>
                    </div>
                  </div>

                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    <Download className="h-4 w-4 inline mr-1" />
                    Download
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <span>{formatTimeAgo(material.created_at || '')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {materials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No study materials found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or be the first to upload materials
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload First Material
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Study Material</h3>
                <p className="text-sm text-gray-600">Share your academic resources with fellow students</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => handleUploadFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Calculus I Final Exam Notes"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.course_code}
                      onChange={(e) => handleUploadFormChange('course_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., MATH 101"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={uploadForm.course_name}
                      onChange={(e) => handleUploadFormChange('course_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Calculus I"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Type
                    </label>
                    <select
                      value={uploadForm.material_type}
                      onChange={(e) => handleUploadFormChange('material_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="notes">Notes</option>
                      <option value="study_guide">Study Guide</option>
                      <option value="practice_exam">Practice Exam</option>
                      <option value="syllabus">Syllabus</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File URL
                  </label>
                  <input
                    type="url"
                    value={uploadForm.file_url}
                    onChange={(e) => handleUploadFormChange('file_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => handleUploadFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the content and what makes it useful..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md shadow-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadForm.title.trim() || !uploadForm.course_code.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
