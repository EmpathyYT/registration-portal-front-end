import type { ReservationEntity } from '../entities/reservation_entity';

export class ReservationDto {
    team_id: number;
    location: string;
    reservation_time: string;

    constructor(data: { team_id: number; location: string; reservation_time: string }) {
        this.team_id = data.team_id;
        this.location = data.location;
        this.reservation_time = data.reservation_time;
    }

    static fromEntity(entity: ReservationEntity): ReservationDto {
        return new ReservationDto({
            team_id: entity.team_id,
            location: entity.location,
            reservation_time: entity.reservation_time,
        });
    }

    toEntity(): ReservationEntity {
        return {
            team_id: this.team_id,
            location: this.location,
            reservation_time: this.reservation_time,
        };
    }
}
