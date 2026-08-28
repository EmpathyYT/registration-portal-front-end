import { ReservationsDataSource } from './reservations_data_source';
import { ReservationDto } from '../dtos/reservation_dto';
import type { ReservationEntity } from '../entities/reservation_entity';

/** The "Smart Campus App" team (id 1) starts out with a booked presentation slot. */
const MOCK_RESERVATIONS: ReservationEntity[] = [
    { team_id: 1, location: 'Auditorium A', reservation_time: '2026-09-10T10:00:00.000Z' },
];

/**
 * In-memory mock implementation of ReservationsDataSource.
 * A team has at most one reservation, and a (location, time) pair can only be booked once.
 */
export class MockReservationsDataSource extends ReservationsDataSource {
    private readonly reservations: ReservationEntity[] = MOCK_RESERVATIONS;

    private findConflict(location: string, time: string, excludingTeamId?: number): ReservationEntity | undefined {
        return this.reservations.find(
            (r) => r.location === location && r.reservation_time === time && r.team_id !== excludingTeamId
        );
    }

    async getTeamReservation(teamId: number): Promise<ReservationDto | null> {
        const reservation = this.reservations.find((r) => r.team_id === teamId);
        return reservation ? ReservationDto.fromEntity(reservation) : null;
    }

    async bookPresentation(teamId: number, location: string, time: string): Promise<ReservationDto> {
        if (this.reservations.some((r) => r.team_id === teamId)) {
            throw new Error('Team already has a reservation');
        }

        if (this.findConflict(location, time)) {
            throw new Error('That location is already booked at that time');
        }

        const reservation: ReservationEntity = { team_id: teamId, location, reservation_time: time };
        this.reservations.push(reservation);

        return ReservationDto.fromEntity(reservation);
    }

    async updatePresentation(teamId: number, oldTime: string, newLocation: string, newTime: string): Promise<void> {
        const reservation = this.reservations.find((r) => r.team_id === teamId);
        if (!reservation) {
            throw new Error('Reservation not found');
        }

        if (reservation.reservation_time !== oldTime) {
            throw new Error('Reservation time mismatch');
        }

        if (this.findConflict(newLocation, newTime, teamId)) {
            throw new Error('That location is already booked at that time');
        }

        reservation.location = newLocation;
        reservation.reservation_time = newTime;
    }

    async deletePresentation(teamId: number, reservationTime: string): Promise<void> {
        const index = this.reservations.findIndex(
            (r) => r.team_id === teamId && r.reservation_time === reservationTime
        );
        if (index === -1) {
            throw new Error('Reservation not found');
        }

        this.reservations.splice(index, 1);
    }
}
