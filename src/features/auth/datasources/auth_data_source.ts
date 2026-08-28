import type { UserDto } from '../dtos/user_dto';

/**
 * Base contract for authentication data sources.
 * Concrete data sources (mock, supabase, ...) must implement every method.
 */
export abstract class AuthDataSource {
    /**
     * Logs a user in using their university id and password.
     * @param uniId - The user's university id.
     * @param password - The user's password.
     * @returns The logged in user as a UserDto.
     */
    abstract login(uniId: string, password: string): Promise<UserDto>;

    /**
     * Logs the currently authenticated user out.
     */
    abstract logout(): Promise<void>;

    /**
     * Gets the currently authenticated user, if any.
     * @returns The current user as a UserDto, or null if no one is logged in.
     */
    abstract getCurrentSession(): Promise<UserDto | null>;
}
