import { ApiResponse, Player } from '@/types/FullTypes';

const API_BASE_URL = 'http://localhost:3000';

// Player Basic Info Update
export async function updatePlayerBasicInfo(
  playerId: string, 
  field: string, 
  value: string | number | boolean
): Promise<ApiResponse<Player>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/player/${playerId}/basicInfo`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.player,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Player Skills Update
export async function updatePlayerSkill(
  playerId: string, 
  skillName: string, 
  skillValue: number
): Promise<ApiResponse<Player>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/player/${playerId}/skills`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillName, skillValue }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.player,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}