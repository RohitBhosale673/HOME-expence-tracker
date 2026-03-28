'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import type { ProgressPhoto } from '@/lib/types';
import { getProgressPhotos, addProgressPhoto, deleteProgressPhoto, updateProgressPhoto } from '@/lib/local-db';
import {
  Camera,
  Upload,
  X,
  ZoomIn,
  Calendar,
  Trash2,
  Edit,
} from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function EditModal({ isOpen, onClose, title, children }: EditModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-slate-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<ProgressPhoto | null>(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProgressPhotos();
      setPhotos([...data].sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()));
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Url = reader.result as string;
          await addProgressPhoto({
            image_url: base64Url,
            description: '',
          });
          fetchPhotos();
          setIsUploading(false);
        };
        reader.onerror = () => {
          alert('Upload failed. Please try again.');
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading:', error);
        alert('Upload failed. Please try again.');
        setIsUploading(false);
      }
    }
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this photo?')) {
      await deleteProgressPhoto(id);
      fetchPhotos();
    }
  };

  const handleEdit = (photo: ProgressPhoto) => {
    setEditingPhoto(photo);
    setDescription(photo.description || '');
    setShowEditModal(true);
  };

  const handleUpdateDescription = async () => {
    if (editingPhoto) {
      await updateProgressPhoto(editingPhoto.id, { description });
      setShowEditModal(false);
      setEditingPhoto(null);
      fetchPhotos();
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Site Gallery</h1>
          <p className="text-slate-500">Visual progress of your construction project</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <Button onClick={handleUpload} loading={isUploading}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group">
            <div className="relative aspect-[4/3] overflow-hidden" onClick={() => setSelectedPhoto(photo)}>
              <img src={photo.image_url} alt={photo.description || 'Progress photo'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-700 line-clamp-2">{photo.description || 'No description'}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(photo.uploaded_at)}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(photo); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {photos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No photos yet</h3>
            <p className="text-slate-500 mb-4">Start documenting your construction progress</p>
            <Button onClick={handleUpload}><Upload className="w-4 h-4 mr-2" />Upload First Photo</Button>
          </CardContent>
        </Card>
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" onClick={() => setSelectedPhoto(null)}>
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.image_url} alt={selectedPhoto.description || 'Progress photo'} className="w-full max-h-[70vh] object-contain rounded-lg" />
            <div className="mt-4 text-white">
              <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedPhoto.uploaded_at)}
              </div>
              <p className="text-lg">{selectedPhoto.description || 'No description'}</p>
            </div>
          </div>
        </div>
      )}

      <EditModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Photo Description">
        <div className="space-y-4">
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Add a description..." />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleUpdateDescription}>Update</Button>
          </div>
        </div>
      </EditModal>
    </div>
  );
}
