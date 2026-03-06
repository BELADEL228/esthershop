import React, { useState, useEffect } from 'react'
import { SettingsContext } from './SettingsContext'
import { settingsApi } from '../services/api/settings'

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    try {
      const data = await settingsApi.get()
      setSettings(data || {
        site_name: 'Esther Shop',
        site_email: 'esthernabede08@gmail.com',
        site_phone: '+228 90 00 00 00',
        site_address: 'Lomé, Togo',
        shipping_cost: 2000,
        free_shipping_threshold: 25000,
        tax_rate: 18
      })
    } catch (error) {
      console.error('❌ Erreur chargement settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      const updated = await settingsApi.update(newSettings)
      setSettings(updated)
      return { success: true }
    } catch (error) {
      console.error('❌ Erreur mise à jour settings:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const value = {
    settings,
    loading,
    updateSettings,
    refreshSettings: loadSettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}