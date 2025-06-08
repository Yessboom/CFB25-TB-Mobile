import { downloadRoster } from '@/api/download';
import { playerService } from '@/api/player';
import { Player } from '@/types/FullTypes';
import { useCallback, useEffect, useState } from 'react';

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
      const result = await playerService.updateBasicInfo(playerId, field, value);
      
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
      const result = await playerService.updateSkill(playerId, skillName, skillValue);
      
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

export function usePlayer(playerId: string) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayer = useCallback(async () => {
    if (!playerId) {
      setPlayer(null);
      setLoading(false);
      setError('No player ID provided');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching player with ID:', playerId);
      const result = await playerService.getPlayer(playerId); // Use the service
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch player');
        setPlayer(null);
        return;
      }
      
      console.log('📡 Player data received:', result.data);
      setPlayer(result.data || null);
    } catch (err) {
      console.error('❌ Player fetch error:', err);
      setError(err instanceof Error ? err.message : 'Network error');
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  const refetch = useCallback(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  return { 
    player, 
    loading, 
    error, 
    refetch 
  };
}

