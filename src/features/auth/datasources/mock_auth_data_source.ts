import { AuthDataSource } from './auth_data_source';
import { UserDto } from '../dtos/user_dto';

const MOCK_PASSWORD = '12345678';

/**
 * In-memory mock implementation of AuthDataSource.
 * Keeps a single "session" in a module-level variable, logged out by default.
 * Any university id is accepted (logging in as "teacher1" gets a teacher session);
 * the only valid password is "12345678".
 */
export class MockAuthDataSource extends AuthDataSource {
    private currentUser: UserDto | null = null;

    async login(uniId: string, password: string): Promise<UserDto> {
        if (password !== MOCK_PASSWORD) {
            throw new Error('Invalid credentials');
        }

        this.currentUser = uniId === 'teacher1'
            ? new UserDto({
                id: 'teacher1',
                full_name: 'Dr. Rania Mahmoud',
                university_id: uniId,
                role: 'teacher',
            })
            : new UserDto({
                id: 'user1',
                full_name: 'Ammar Ahmad Sameed',
                university_id: uniId,
                role: 'student',
            });

        return this.currentUser;
    }

    async logout(): Promise<void> {
        this.currentUser = null;
    }

    async getCurrentSession(): Promise<UserDto | null> {
        return this.currentUser;
    }
}
