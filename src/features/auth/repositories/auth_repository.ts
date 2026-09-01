import type { AuthDataSource } from '../datasources/auth_data_source';
import { SupabaseAuthDataSource } from '../datasources/supabase_auth_data_source';
import type { UserDto } from '../dtos/user_dto';

/**
 * Repository for authentication, delegating to an injected AuthDataSource.
 */
export class AuthRepository {
    private readonly dataSource: AuthDataSource;

    constructor(dataSource: AuthDataSource) {
        this.dataSource = dataSource;
    }

    login(uniId: string, password: string): Promise<UserDto> {
        return this.dataSource.login(uniId, password);
    }

    logout(): Promise<void> {
        return this.dataSource.logout();
    }

    getCurrentSession(): Promise<UserDto | null> {
        return this.dataSource.getCurrentSession();
    }
}

export const authRepository = new AuthRepository(new SupabaseAuthDataSource());
