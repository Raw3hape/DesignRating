export async function compressImage(file: File, maxWidth: number = 1200, maxHeight: number = 1200, quality: number = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        
        // Use better image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            
            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

export async function compressImages(files: File[]): Promise<File[]> {
  const compressionPromises = files.map(async (file) => {
    try {
      // Always compress images to ensure they're under size limit
      const compressed = await compressImage(file)
      
      // If still too large, compress more aggressively
      if (compressed.size > 2 * 1024 * 1024) { // 2MB
        return await compressImage(file, 800, 800, 0.6)
      }
      
      return compressed
    } catch (error) {
      console.error('Error compressing image:', error)
      // Try with more aggressive compression as fallback
      try {
        return await compressImage(file, 800, 800, 0.5)
      } catch {
        return file // Return original file if all compression fails
      }
    }
  })
  
  return Promise.all(compressionPromises)
}