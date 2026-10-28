import type { User } from '@supabase/supabase-js'

// Fails closed: when ADMIN_USER_ID is not configured, nobody is an admin.
export function isAdmin(user: User | null | undefined): boolean {
    const adminUserId = process.env.ADMIN_USER_ID
    return !!user && !!adminUserId && user.id === adminUserId
}
