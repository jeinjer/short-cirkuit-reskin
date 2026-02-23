import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';
import { getApiErrorMessage } from '../../utils/apiErrors';

export default function useProfileAvatar({ refreshUser }) {
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const loadProfileData = useCallback(async () => {
    try {
      const meRes = await api.get('/auth/me');
      setSelectedAvatar(meRes.data?.avatar || '');
    } catch {
      toast.error('No se pudo cargar tu perfil');
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const saveProfile = useCallback(async () => {
    try {
      setSavingProfile(true);
      await api.patch('/auth/me', { avatar: selectedAvatar || null });
      await refreshUser();
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo actualizar el perfil'));
    } finally {
      setSavingProfile(false);
    }
  }, [refreshUser, selectedAvatar]);

  const removeAvatar = useCallback(async () => {
    try {
      setSavingProfile(true);
      await api.patch('/auth/me', { avatar: null });
      setSelectedAvatar('');
      await refreshUser();
      toast.success('Avatar eliminado');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo eliminar el avatar'));
    } finally {
      setSavingProfile(false);
    }
  }, [refreshUser]);

  return {
    selectedAvatar,
    setSelectedAvatar,
    savingProfile,
    saveProfile,
    removeAvatar
  };
}
