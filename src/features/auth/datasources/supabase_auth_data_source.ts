import { AuthDataSource } from './auth_data_source';
import { UserDto } from '../dtos/user_dto';
import { supabase } from '../../../core/supabaseClient';

/**
 * Supabase-backed implementation of AuthDataSource.
 * Not implemented yet.
 */
export class SupabaseAuthDataSource extends AuthDataSource {
    emailBuilder(uniId: string): string {
        return `${uniId}@std.bau.edu.jo`;
    }

    async login(_uniId: string, _password: string): Promise<UserDto> {
        const { data: _ , error } = await supabase.auth.signInWithPassword({
            email: this.emailBuilder(_uniId),
            password: _password,
        });

        if (error) {
            throw new Error(`Login failed: ${error.message}`);
        }

        const currentSession = await this.getCurrentSession();

        if (!currentSession) {
            throw new Error('Login failed: Could not get current session');
        }

        return currentSession;

    }

    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(`Logout failed: ${error.message}`);
        }
    }

    async getCurrentSession(): Promise<UserDto | null> {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            throw new Error(`Failed to get current session: ${error.message}`);
        }

        if (!session || !session.user) {
            return null;
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, full_name, university_id, role')
            .eq('id', session.user.id)
            .single();

        if (userError) {
            throw new Error(`Failed to fetch user data: ${userError.message}`);
        }

        return new UserDto(userData);
    }
}
