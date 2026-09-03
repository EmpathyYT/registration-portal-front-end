import { ReservationsDataSource } from './reservations_data_source';
import { ReservationDto } from '../dtos/reservation_dto';
import { supabase } from '../../../core/supabaseClient';

/**
 * Supabase-backed implementation of ReservationsDataSource.
 * Not implemented yet.
 */
export class SupabaseReservationsDataSource extends ReservationsDataSource {
    async getTeamReservation(_teamId: number): Promise<ReservationDto | null> {
        const {data, error} = await supabase
            .from('reservations')
            .select('*')
            .eq('team_id', _teamId)
            .single();

        if (error) {
            console.error('Error fetching reservation:', error);
            return null;
        }

        if (!data) {
            return null;
        }

        return new ReservationDto(data);
    }

    async bookPresentation(_teamId: number, _location: string, _time: string): Promise<ReservationDto> {
        const { data, error } = await supabase
            .from('reservations')
            .insert({
                team_id: _teamId,
                location: _location,
                reservation_time: _time,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to book presentation: ${error.message}`);
        }

        return new ReservationDto(data);
    }

    async updatePresentation(_teamId: number, _oldTime: string, _newLocation: string, _newTime: string): Promise<void> {
        const { error } = await supabase
            .from('reservations')
            .update({
                location: _newLocation,
                reservation_time: _newTime,
            })
            .eq('team_id', _teamId)
            .eq('reservation_time', _oldTime);

        if (error) {
            throw new Error(`Failed to update presentation: ${error.message}`);
        }
    }

    async deletePresentation(_teamId: number, _reservationTime: string): Promise<void> {
        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('team_id', _teamId)
            .eq('reservation_time', _reservationTime);

        if (error) {
            throw new Error(`Failed to delete presentation: ${error.message}`);
        }
    }
}
