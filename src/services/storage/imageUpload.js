import axios from 'axios'

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const uploadImage = async (file, folder = 'products') => {
  // 1. Validation
  if (!file) {
    throw new Error('Aucun fichier sélectionné');
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Type de fichier non supporté. Utilisez JPG, PNG ou WEBP');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop lourd (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }

  // 2. Préparation
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  console.log('📤 Upload vers Cloudinary...', {
    nom: file.name,
    taille: `${(file.size / 1024).toFixed(2)}KB`,
    preset: UPLOAD_PRESET
  });

  try {
    // 3. Upload
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    })
    
    console.log('✅ Upload réussi!');
    
    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      width: response.data.width,
      height: response.data.height,
      format: response.data.format,
      size: response.data.bytes
    }
  } catch (error) {
    console.error('❌ Erreur upload:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error("Erreur d'authentification Cloudinary (upload preset invalide)");
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("Timeout: L'upload a pris trop de temps");
    } else {
      throw new Error(`Échec de l'upload: ${error.message}`);
    }
  }
}

export const uploadMultipleImages = async (files, folder = 'products') => {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadImage(files[i], folder);
      results.push(result);
    } catch (error) {
      errors.push({ file: files[i].name, error: error.message });
    }
  }
  
  if (errors.length > 0) {
    console.warn('⚠️ Certains uploads ont échoué:', errors);
  }
  
  return { results, errors };
}