/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft, X, MapPin, DollarSign, Tag, FileText, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { selectUser } from '@/lib/redux/slices/auth';
import {
  useMarketplaceListingsReadQuery,
  useMarketplaceListingsPartialUpdateMutation,
  useMarketplaceCategoriesListQuery,
  useMarketplaceCampusesListQuery,
  Listing
} from '@/lib/redux/api/openapi.generated';
import Header from '@/components/navigation/header';
import Image from 'next/image';

interface EditListingForm {
  title: string;
  description: string;
  price: string;
  category: string;
  campus: string;
  condition: string;
  location: string;
  tags: string[];
  is_negotiable: boolean;
  status: string;
}

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  const user = useSelector(selectUser);

  const { data: listing, isLoading: loadingListing } = useMarketplaceListingsReadQuery({ id: listingId });
  const { data: categories } = useMarketplaceCategoriesListQuery({});
  const { data: campuses } = useMarketplaceCampusesListQuery({});
  const [updateListing, { isLoading: isUpdating }] = useMarketplaceListingsPartialUpdateMutation();

  const [form, setForm] = useState<EditListingForm>({
    title: '',
    description: '',
    price: '',
    category: '',
    campus: '',
    condition: 'good',
    location: '',
    tags: [],
    is_negotiable: false,
    status: 'active'
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Partial<EditListingForm>>({});
  const [currentImages, setCurrentImages] = useState<Array<{id: string; url: string; isPrimary: boolean}>>([]);
  const [newImages, setNewImages] = useState<(File | string)[]>([]); // Support both File and URL string
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (listing) {
      // Check if user owns this listing
      const sellerId = typeof listing.seller === 'string'
        ? listing.seller
        : (listing.seller as any)?.id;

      if (sellerId !== user?.id) {
        router.push('/my-listings');
        return;
      }

      setForm({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price || '',
        category: listing.category?.id || '',
        campus: listing.campus?.id || '',
        condition: listing.condition || 'good',
        location: listing.location || '',
        // Tags are not included in ListingRead type, so initialize as empty array
        tags: [],
        is_negotiable: listing.is_negotiable || false,
        status: listing.status || 'active'
      });

      // Load current images
      if (listing.images && listing.images.length > 0) {
        setCurrentImages(
          listing.images.map((img: any) => ({
            id: img.id || '',
            url: img.image_url || '',
            isPrimary: img.is_primary || false
          }))
        );
      }
    }
  }, [listing, user, router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isUnder5MB = file.size <= 5 * 1024 * 1024;
      return isImage && isUnder5MB;
    });

    if (validFiles.length + currentImages.length + newImages.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    setNewImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...urls]);
  };

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;

    // Basic URL validation
    try {
      new URL(imageUrlInput);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    if (currentImages.length + newImages.length >= 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    setNewImages(prev => [...prev, imageUrlInput.trim()]);
    setImagePreviewUrls(prev => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const removeCurrentImage = (imageId: string) => {
    setCurrentImages(prev => prev.filter(img => img.id !== imageId));
  };

  const removeNewImage = (index: number) => {
    const imageToRemove = newImages[index];

    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      // Only revoke object URL if it's a File object
      if (typeof imageToRemove !== 'string') {
        URL.revokeObjectURL(prev[index]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const setPrimaryImage = (imageId: string, isNewImage: boolean) => {
    if (isNewImage) {
      // For new images, we'll handle this differently since they don't have IDs yet
      return;
    }
    setCurrentImages(prev =>
      prev.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }))
    );
  };

  const handleInputChange = (field: keyof EditListingForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim()) && form.tags.length < 5) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EditListingForm> = {};

    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.price.trim()) newErrors.price = 'Price is required';
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.campus) newErrors.campus = 'Campus is required';
    if (!form.condition) newErrors.condition = 'Condition is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Get placeholder image URLs for new images based on category
      const getPlaceholderImageUrl = (index: number) => {
        const categoryId = form.category;
        const category = categories?.results?.find(c => c.id === categoryId);
        const categoryName = category?.name?.toLowerCase() || '';

        // Category-specific Unsplash images
        const imageQueries: { [key: string]: string } = {
          'electronics': 'electronics,gadgets,technology',
          'textbooks': 'books,textbook,study',
          'furniture': 'furniture,dorm,room',
          'clothing': 'fashion,clothes,apparel',
          'sports': 'sports,equipment,fitness',
          'housing': 'apartment,room,housing',
          'vehicles': 'car,vehicle,transportation',
          'services': 'service,help,work'
        };

        const query = Object.keys(imageQueries).find(key => categoryName.includes(key)) || 'product';
        const searchQuery = imageQueries[query] || 'product,item,marketplace';

        return `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=800&q=80&${searchQuery}`;
      };

      // Combine current images and new images
      const allImages = [
        ...currentImages.map((img, index) => ({
          image_url: img.url,
          display_order: index,
          is_primary: img.isPrimary
        })),
        ...newImages.map((imageOrUrl, index) => ({
          // If it's a string (URL), use it directly; if it's a File, use placeholder
          image_url: typeof imageOrUrl === 'string' ? imageOrUrl : getPlaceholderImageUrl(currentImages.length + index),
          display_order: currentImages.length + index,
          is_primary: false
        }))
      ];

      // If there are images, make sure at least one is primary
      if (allImages.length > 0 && !allImages.some(img => img.is_primary)) {
        allImages[0].is_primary = true;
      }

      await updateListing({
        id: listingId,
        listing: {
          title: form.title,
          description: form.description,
          price: form.price,
          category_id: form.category,
          campus_id: form.campus,
          condition: form.condition as "new" | "like_new" | "good" | "fair" | "poor",
          location: form.location || undefined,
          is_negotiable: form.is_negotiable,
          status: form.status as "active" | "sold" | "expired" | "deleted",
          // Type assertion: API accepts tag_names and images even though Listing type doesn't include them
          tag_names: form.tags,
          images: allImages.length > 0 ? allImages : undefined
        } as Listing & { tag_names?: string[]; images?: Array<{image_url: string; display_order: number; is_primary: boolean}> }
      }).unwrap();

      router.push('/my-listings');
    } catch (error) {
      console.error('Failed to update listing:', error);
    }
  };

  if (loadingListing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
            <p className="text-gray-600">Update your marketplace listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter a descriptive title for your item"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your item in detail..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition *
                  </label>
                  <select
                    value={form.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.condition ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="negotiable"
                  type="checkbox"
                  checked={form.is_negotiable}
                  onChange={(e) => handleInputChange('is_negotiable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="negotiable" className="ml-2 block text-sm text-gray-900">
                  Price is negotiable
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2" />
              Images
            </h2>

            <div className="space-y-4">
              {/* Current Images */}
              {currentImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentImages.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={image.url}
                            alt={`Image ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          {image.isPrimary && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                            {!image.isPrimary && (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(image.id, false)}
                                className="bg-white text-gray-800 px-3 py-1 rounded text-xs hover:bg-gray-100"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeCurrentImage(image.id)}
                              className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {newImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Images (will be uploaded)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-green-200">
                          <Image
                            src={url}
                            alt={`New image ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            New
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {(currentImages.length + newImages.length) < 10 && (
                <div>
                  <label className="block mb-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload images or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB each (max {10 - currentImages.length - newImages.length} more)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Or paste an image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={addImageUrl}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">
                {currentImages.length + newImages.length}/10 images.
                {currentImages.length === 0 && newImages.length === 0 && ' Add at least one image to help buyers see your item.'}
              </p>
            </div>
          </div>

          {/* Category and Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Category & Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories?.results?.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campus *
                </label>
                <select
                  value={form.campus}
                  onChange={(e) => handleInputChange('campus', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.campus ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a campus</option>
                  {campuses?.results?.map(campus => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
                {errors.campus && <p className="text-red-500 text-sm mt-1">{errors.campus}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specific Location (Optional)
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Building name, room number, general area"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Tags (Optional)
            </h2>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {form.tags.length < 5 && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Add up to 5 tags to help buyers find your item. Tags should be relevant keywords.
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Listing Status
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="sold">Sold</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Active listings are visible to other users. Inactive listings are hidden but can be reactivated.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}