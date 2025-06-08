import { downloadRoster } from '@/api/download';
import { updatePlayerBasicInfo, updatePlayerSkill } from '@/api/player';
import { useCallback, useState } from 'react';

export function usePlayerUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBasicInfo = useCallback(async (
    playerId: string, 
    field: string,
    value: string | number | boolean
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updatePlayerBasicInfo(playerId, field, value);
      
      if (!result.success) {
        setError(result.error || 'Update failed');
        return null;
      }
      
      return result.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSkill = useCallback(async (
    playerId: string, 
    skillName: string,
    skillValue: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updatePlayerSkill(playerId, skillName, skillValue);
      
      if (!result.success) {
        setError(result.error || 'Skill update failed');
        return null;
      }
      
      return result.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateBasicInfo, updateSkill, loading, error };
}

export function useRosterDownload() {
  const [downloading, setDownloading] = useState(false);

  const download = useCallback(async (rosterId: string) => {
    setDownloading(true);
    
    try {
      const success = await downloadRoster(rosterId);
      return success;
    } finally {
      setDownloading(false);
    }
  }, []);

  return { download, downloading };
}