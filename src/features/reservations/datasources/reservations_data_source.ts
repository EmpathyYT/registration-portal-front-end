import type { ReservationDto } from '../dtos/reservation_dto';

/**
 * Base contract for reservations data sources.
 * Concrete data sources (mock, supabase, ...) must implement every method.
 */
export abstract class ReservationsDataSource {
    /**
     * Gets a team's presentation reservation, if any (a team has at most one).
     * @param teamId - The id of the team.
     * @returns The team's reservation, or null if it hasn't booked one.
     */
    abstract getTeamReservation(teamId: number): Promise<ReservationDto | null>;

    /**
     * Books a presentation slot for a team.
     * @param teamId - The id of the team.
     * @param location - The location to book.
     * @param time - The reservation time.
     * @returns The newly created reservation.
     */
    abstract bookPresentation(teamId: number, location: string, time: string): Promise<ReservationDto>;

    /**
     * Updates a team's existing presentation reservation.
     * @param teamId - The id of the team.
     * @param oldTime - The reservation's current time, used to identify it.
     * @param newLocation - The new location.
     * @param newTime - The new reservation time.
     */
    abstract updatePresentation(teamId: number, oldTime: string, newLocation: string, newTime: string): Promise<void>;

    /**
     * Deletes a team's presentation reservation.
     * @param teamId - The id of the team.
     * @param reservationTime - The reservation's time, used to identify it.
     */
    abstract deletePresentation(teamId: number, reservationTime: string): Promise<void>;
}
