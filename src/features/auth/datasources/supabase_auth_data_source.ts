import { AuthDataSource } from './auth_data_source';
import type { UserDto } from '../dtos/user_dto';

/**
 * Supabase-backed implementation of AuthDataSource.
 * Not implemented yet.
 */
export class SupabaseAuthDataSource extends AuthDataSource {
    async login(_uniId: string, _password: string): Promise<UserDto> {
        throw new Error('Not implemented');
    }

    async logout(): Promise<void> {
        throw new Error('Not implemented');
    }

    async getCurrentSession(): Promise<UserDto | null> {
        throw new Error('Not implemented');
    }
}
