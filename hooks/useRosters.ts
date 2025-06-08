// hooks/useRosters.ts
import { rosterService } from '@/api/roster';
import { CreateRosterForm, Roster } from '@/types/FullTypes';
import { useEffect, useState } from 'react';

export const useRosters = () => {
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRosters = async () => {
    setLoading(true);
    setError(null);
    
    const response = await rosterService.getUserRosters();
    
    if (response.success && response.rosters) {
      setRosters(response.rosters);
    } else {
      setError(response.error || 'Failed to fetch rosters');
    }
    
    setLoading(false);
  };

  const createRoster = async (templateId: string, rosterName: string) => {
    console.log('🔄 Creating roster with:', { templateId, rosterName }); // Add debug log
    
    const formData: CreateRosterForm = { templateId, rosterName };
    const response = await rosterService.createRosterFromTemplate(formData);
    
    console.log('📡 Create roster response:', response); // Add debug log
    
    if (response.success) {
      // Refresh the rosters list
      await fetchRosters();
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to create roster');
    }
  };

  const updateRoster = async (rosterId: string, name: string) => {
    const response = await rosterService.updateRoster(rosterId, name);
    
    if (response.success) {
      // Update the roster in state
      setRosters(prev => prev.map(roster => 
        roster.rosterId === rosterId ? { ...roster, name } : roster
      ));
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to update roster');
    }
  };

  const deleteRoster = async (rosterId: string) => {
    const response = await rosterService.deleteRoster(rosterId);
    console.log("deleteRoster response in useRosters.ts", response);
    
    if (response.success) {
        console.log("deleteRoster in useRosters.ts");
      // Remove the roster from state
      setRosters(prev => prev.filter(roster => roster.rosterId !== rosterId));
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to delete roster');
    }
  };

  useEffect(() => {
    fetchRosters();
  }, []);

  return {
    rosters,
    loading,
    error,
    fetchRosters,
    createRoster,
    updateRoster,
    deleteRoster
  };
};

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Roster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    
    const response = await rosterService.getTemplateRosters();
    
    if (response.success && response.templates) {
      setTemplates(response.templates);
    } else {
      setError(response.error || 'Failed to fetch templates');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    fetchTemplates
  };
};

export const useRoster = (rosterId: string | null) => {
  const [roster, setRoster] = useState<Roster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoster = async () => {
      if (!rosterId) {
        setError('No roster ID provided');
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching roster with ID:', rosterId); // Add debug log
      setLoading(true);
      setError(null);

      try {
        const response = await rosterService.getRoster(rosterId);
        console.log('📡 Roster API response:', response); // Add debug log
        
        if (response.success && response.roster) {
          setRoster(response.roster);
        } else {
          setError(response.error || 'Failed to fetch roster');
        }
      } catch (err) {
        console.error('❌ Roster fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch roster');
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [rosterId]);

  return { roster, loading, error };
};