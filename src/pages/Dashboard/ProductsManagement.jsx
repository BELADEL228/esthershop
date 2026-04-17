import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { productsApi } from '../../services/api/products'
import { uploadImage } from '../../services/storage/imageUpload'
import { useAuth } from '../../hooks/useAuth'
import { usePrice } from '../../hooks/usePrice'
import { PencilIcon, TrashIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const productSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().min(0, 'Le prix doit être positif'),
  category: z.string().min(1, 'La catégorie est requise'),
  stock: z.number().min(0, 'Le stock doit être positif'),
  images: z.array(z.string()).optional()
})

export const ProductsManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { isAdmin } = useAuth()
  const formatPrice = usePrice()

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      images: []
    }
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getAll({}, true)
      setProducts(data)
    } catch (error) {
      toast.error(`Erreur lors du chargement des produits: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = files.map(file => uploadImage(file))
      const uploadedImages = await Promise.all(uploadPromises)
      const imageUrls = uploadedImages.map(img => img.url)
      
      setValue('images', imageUrls)
      toast.success('Images uploadées avec succès')
    } catch (error) {
      toast.error(`Erreur lors de l'upload des images: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error('Accès non autorisé')
      return
    }

    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, data)
        toast.success('Produit mis à jour avec succès')
      } else {
        await productsApi.create(data)
        toast.success('Produit créé avec succès')
      }
      
      reset()
      setEditingProduct(null)
      loadProducts()
    } catch (error) {
      toast.error(`Erreur lors de la sauvegarde: ${error.message}`)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    reset({
      ...product,
      price: product.price,
      stock: product.stock
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver ce produit ?')) return

    try {
      await productsApi.delete(id)
      toast.success('Produit désactivé avec succès')
      loadProducts()
    } catch (error) {
      toast.error(`Erreur lors de la désactivation: ${error.message}`)
    }
  }

  const handleRestore = async (id) => {
    if (!confirm('Réactiver ce produit ?')) return

    try {
      await productsApi.update(id, { active: true })
      toast.success('Produit réactivé avec succès')
      loadProducts()
    } catch (error) {
      toast.error(`Erreur lors de la réactivation: ${error.message}`)
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Accès non autorisé</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Vous n'avez pas les droits d'administrateur</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Produits</h1>
        <button
          onClick={() => {
            setEditingProduct(null)
            reset({
              name: '',
              description: '',
              price: 0,
              category: '',
              stock: 0,
              images: []
            })
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau Produit
        </button>
      </div>

      {/* Formulaire d'ajout/édition */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom du produit
            </label>
            <input
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prix
              </label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catégorie
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="accessoires">Accessoires</option>
              <option value="vetements">Vêtements</option>
              <option value="chaussures">Chaussures</option>
              <option value="beaute">Beauté</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {uploading && <p className="text-primary-600 text-sm mt-1">Upload en cours...</p>}
            {editingProduct?.images?.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {editingProduct.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`preview-${idx}`} className="h-16 w-16 object-cover rounded border border-gray-200 dark:border-gray-600" />
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={uploading}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-300"
            >
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </button>
            
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null)
                  reset({})
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste des produits */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className={`${!product.active ? 'bg-gray-100 dark:bg-gray-700/50' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {formatPrice(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!product.active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500 text-white">
                        Désactivé
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-white">
                        Actif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      title="Modifier"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    {product.active ? (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 dark:hover:text-red-400 mr-3"
                        title="Désactiver"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(product.id)}
                        className="text-green-600 hover:text-green-700 dark:hover:text-green-400"
                        title="Réactiver"
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}