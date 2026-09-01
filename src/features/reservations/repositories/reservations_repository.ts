import type { ReservationsDataSource } from '../datasources/reservations_data_source';
import type { ReservationDto } from '../dtos/reservation_dto';
import { SupabaseReservationsDataSource } from '../datasources/supabase_reservations_data_source';

/**
 * Repository for reservations, delegating to an injected ReservationsDataSource.
 */
export class ReservationsRepository {
    private readonly dataSource: ReservationsDataSource;

    constructor(dataSource: ReservationsDataSource) {
        this.dataSource = dataSource;
    }

    getTeamReservation(teamId: number): Promise<ReservationDto | null> {
        return this.dataSource.getTeamReservation(teamId);
    }

    bookPresentation(teamId: number, location: string, time: string): Promise<ReservationDto> {
        return this.dataSource.bookPresentation(teamId, location, time);
    }

    updatePresentation(teamId: number, oldTime: string, newLocation: string, newTime: string): Promise<void> {
        return this.dataSource.updatePresentation(teamId, oldTime, newLocation, newTime);
    }

    deletePresentation(teamId: number, reservationTime: string): Promise<void> {
        return this.dataSource.deletePresentation(teamId, reservationTime);
    }
}

export const reservationsRepository = new ReservationsRepository(new SupabaseReservationsDataSource());
