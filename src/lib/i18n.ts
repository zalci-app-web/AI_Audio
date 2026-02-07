import { headers, cookies } from 'next/headers'
import { dictionaries, type Locale } from './dictionaries' // Import from shared file

export { dictionaries, type Locale }

export async function getDictionary() {
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('NEXT_LOCALE')

    if (localeCookie?.value === 'ja' || localeCookie?.value === 'en') {
        return dictionaries[localeCookie.value as Locale]
    }

    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') || 'en'
    const locale: Locale = acceptLanguage.startsWith('ja') ? 'ja' : 'en'
    return dictionaries[locale] // Return plain object, not a promise
}
