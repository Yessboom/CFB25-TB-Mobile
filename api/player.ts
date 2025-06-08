import { ApiResponse, Player } from '@/types/FullTypes';

const API_BASE_URL = 'http://localhost:3000';

class PlayerService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Important for session cookies
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // GET /api/player/[playerId] - Get specific player
  async getPlayer(playerId: string): Promise<ApiResponse<Player>> {
    console.log('🔍 NOW Fetching player with ID:', playerId);
    const response = await this.makeRequest<{ player: Player }>(`/api/players/${playerId}`);
    
    return {
      success: response.success,
      error: response.error,
      data: response.data?.player
    };
  }

  // PATCH /api/player/[playerId]/basicInfo - Update player basic info
  async updateBasicInfo(
    playerId: string, 
    field: string, 
    value: string | number | boolean
  ): Promise<ApiResponse<Player>> {
    console.log(`📝 Updating player ${playerId} basic info:`, { field, value });
    
    const response = await this.makeRequest<{ player: Player }>(
      `/api/players/${playerId}/basicInfoUpdate`,
      {
        method: 'PATCH',
        body: JSON.stringify({ field, value })
      }
    );

    return {
      success: response.success,
      error: response.error,
      data: response.data?.player
    };
  }

  // PATCH /api/player/[playerId]/skillsUpdate - Update player skill
  async updateSkill(
    playerId: string, 
    skillName: string, 
    skillValue: number
  ): Promise<ApiResponse<Player>> {
    console.log(`🎯 Updating player ${playerId} skill:`, { skillName, skillValue });
    
    const response = await this.makeRequest<{ player: Player }>(
      `/api/players/${playerId}/skillsUpdate`,
      {
        method: 'PATCH',
        body: JSON.stringify({ skillName, skillValue })
      }
    );

    return {
      success: response.success,
      error: response.error,
      data: response.data?.player
    };
  }

}

export const playerService = new PlayerService();

// Export individual functions for backward compatibility
export const getPlayerById = (playerId: string) => playerService.getPlayer(playerId);
export const updatePlayerBasicInfo = (playerId: string, field: string, value: string | number | boolean) => 
  playerService.updateBasicInfo(playerId, field, value);
export const updatePlayerSkill = (playerId: string, skillName: string, skillValue: number) => 
  playerService.updateSkill(playerId, skillName, skillValue);