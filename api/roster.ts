import {
  ApiResponse,
  CreateRosterForm,
  Roster,
  RosterListResponse,
  RosterResponse
} from '@/types/FullTypes'; // Adjust path to your types file

const API_BASE_URL = 'http://localhost:3000';

class RosterService {
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

  // GET /api/rosters - Get all user rosters
  async getUserRosters(): Promise<RosterListResponse> {
    const response = await this.makeRequest<{ rosters: Roster[] }>('/api/rosters');
    console.log('getUserRosters response:', response);
    return {
      success: response.success,
      error: response.error,
      rosters: response.data?.rosters
    };
  }

  // GET /api/rosters/templates - Get template rosters
  async getTemplateRosters(): Promise<{ success: boolean; templates?: Roster[]; error?: string }> {
    const response = await this.makeRequest<{ templates: Roster[] }>('/api/rosters/templates');
    return {
      success: response.success,
      error: response.error,
      templates: response.data?.templates
    };
  }

  // GET /api/rosters/[rosterId] - Get specific roster
  async getRoster(rosterId: string): Promise<RosterResponse> {
    const response = await this.makeRequest<{ roster: Roster }>(`/api/rosters/${rosterId}`);
    return {
      success: response.success,
      error: response.error,
      roster: response.data?.roster
    };
  }

  // POST /api/rosters/create - Create roster from template
  async createRosterFromTemplate(
    formData: CreateRosterForm
  ): Promise<ApiResponse<{ roster: { id: string; name: string; playerCount: number } }>> {
    return this.makeRequest<{ roster: { id: string; name: string; playerCount: number } }>(
      '/api/rosters/create',
      {
        method: 'POST',
        body: JSON.stringify(formData)
      }
    );
  }

  // PATCH /api/rosters/[rosterId] - Update roster name
  async updateRoster(
    rosterId: string, 
    name: string
  ): Promise<ApiResponse<{ roster: { id: string; name: string } }>> {
    return this.makeRequest<{ roster: { id: string; name: string } }>(
      `/api/rosters/${rosterId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ name })
      }
    );
  }

  // DELETE /api/rosters/[rosterId] - Delete roster
  async deleteRoster(rosterId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>(
      `/api/rosters/${rosterId}`,
      {
        method: 'DELETE'
      }
    );
  }
}

export const rosterService = new RosterService();