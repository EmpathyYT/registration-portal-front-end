import { ReservationsDataSource } from './reservations_data_source';
import type { ReservationDto } from '../dtos/reservation_dto';

/**
 * Supabase-backed implementation of ReservationsDataSource.
 * Not implemented yet.
 */
export class SupabaseReservationsDataSource extends ReservationsDataSource {
    async getTeamReservation(_teamId: number): Promise<ReservationDto | null> {
        throw new Error('Not implemented');
    }

    async bookPresentation(_teamId: number, _location: string, _time: string): Promise<ReservationDto> {
        throw new Error('Not implemented');
    }

    async updatePresentation(_teamId: number, _oldTime: string, _newLocation: string, _newTime: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async deletePresentation(_teamId: number, _reservationTime: string): Promise<void> {
        throw new Error('Not implemented');
    }
}
