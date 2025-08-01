'use client'

import { useRef } from 'react'
import { X, Upload } from 'lucide-react'

interface ImageUploadProps {
  images: File[]
  setImages: (images: File[]) => void
  maxImages: number
}

export function ImageUpload({ images, setImages, maxImages }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length + images.length > maxImages) {
      alert(`Можно загрузить максимум ${maxImages} изображений`)
      return
    }

    setImages([...images, ...validFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length + images.length > maxImages) {
      alert(`Можно загрузить максимум ${maxImages} изображений`)
      return
    }

    setImages([...images, ...validFiles])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Загрузите дизайнерские работы
        </h3>
        <p className="text-gray-600 mb-4">
          Перетащите изображения сюда или нажмите для выбора
        </p>
        <p className="text-sm text-gray-500">
          Поддерживаются JPG, PNG, GIF. Максимум {maxImages} файлов.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Работа ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {image.name.length > 15 ? `${image.name.substring(0, 15)}...` : image.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          {images.length} из {maxImages} изображений загружено
        </div>
      )}
    </div>
  )
}