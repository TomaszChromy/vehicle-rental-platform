# 👤 System Użytkowników - Dokumentacja

## 📋 Przegląd

System użytkowników w platformie wynajmu pojazdów umożliwia:
- Rejestrację i logowanie użytkowników
- Zarządzanie profilami użytkowników
- Przeglądanie historii rezerwacji
- Różne role użytkowników (ADMIN, MANAGER, CLIENT)
- Bezpieczną autentykację z NextAuth.js

## 🏗️ Architektura

### Technologie

- **NextAuth.js** - Autentykacja i sesje
- **bcryptjs** - Hashowanie haseł
- **Prisma** - ORM do zarządzania użytkownikami
- **JWT** - Tokeny sesji
- **TypeScript** - Typy dla bezpieczeństwa

### Komponenty

#### 1. Autentykacja (`/api/auth/`)
- **[...nextauth]/route.ts** - Konfiguracja NextAuth
- **register/route.ts** - Endpoint rejestracji
- **Credentials Provider** - Logowanie email/hasło

#### 2. Strony użytkownika
- **signin/page.tsx** - Strona logowania
- **signup/page.tsx** - Strona rejestracji
- **profile/page.tsx** - Profil użytkownika
- **profile/bookings/page.tsx** - Historia rezerwacji

#### 3. Komponenty UI
- **Navbar.tsx** - Nawigacja z menu użytkownika
- **AuthProvider.tsx** - Provider NextAuth dla aplikacji

## 🔐 Bezpieczeństwo

### Hashowanie haseł

```typescript
// Rejestracja
const hashedPassword = await bcrypt.hash(password, 12)

// Logowanie
const isPasswordValid = await bcrypt.compare(password, user.password)
```

### Sesje JWT

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role
      token.firstName = user.firstName
      token.lastName = user.lastName
    }
    return token
  },
  async session({ session, token }) {
    session.user.id = token.sub!
    session.user.role = token.role as string
    return session
  }
}
```

### Walidacja

- **Email format** - Regex validation
- **Hasło** - Minimum 6 znaków
- **Autoryzacja** - Sprawdzanie ról użytkowników
- **CSRF Protection** - Wbudowane w NextAuth

## 👥 Role użytkowników

### CLIENT (Klient)
- Rejestracja i logowanie
- Tworzenie rezerwacji
- Przeglądanie własnych rezerwacji
- Edycja profilu

### MANAGER (Manager)
- Wszystkie uprawnienia CLIENT
- Zarządzanie pojazdami (w przyszłości)
- Przeglądanie wszystkich rezerwacji (w przyszłości)

### ADMIN (Administrator)
- Wszystkie uprawnienia MANAGER
- Dostęp do panelu administratora
- Zarządzanie użytkownikami
- Pełne uprawnienia systemu

## 🎯 Funkcjonalności

### Rejestracja użytkownika

```typescript
// POST /api/auth/register
{
  "firstName": "Jan",
  "lastName": "Kowalski", 
  "email": "jan@example.com",
  "phone": "+48123456789", // opcjonalne
  "password": "haslo123"
}
```

### Logowanie

```typescript
// Używa NextAuth signIn
await signIn('credentials', {
  email: 'jan@example.com',
  password: 'haslo123',
  redirect: false
})
```

### Profil użytkownika

- **Dane osobowe** - imię, nazwisko, email, telefon
- **Statystyki** - liczba rezerwacji, status konta
- **Historia** - ostatnie 3 rezerwacje
- **Szybkie akcje** - nowa rezerwacja, mapa pojazdów

### Historia rezerwacji

- **Filtrowanie** - według statusu rezerwacji
- **Szczegóły** - pojazd, daty, lokalizacje, ceny
- **Statusy** - PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED
- **Statystyki** - podsumowanie wszystkich rezerwacji

## 🔗 API Endpoints

### Autentykacja

```typescript
// Rejestracja
POST /api/auth/register
Body: { firstName, lastName, email, phone?, password }

// Logowanie (NextAuth)
POST /api/auth/signin
Body: { email, password }

// Wylogowanie (NextAuth)
POST /api/auth/signout
```

### Użytkownicy

```typescript
// Pobierz profil użytkownika
GET /api/users/[id]
Headers: { Authorization: "Bearer <token>" }

// Aktualizuj profil
PUT /api/users/[id]
Body: { firstName, lastName, phone }
```

### Rezerwacje

```typescript
// Pobierz rezerwacje użytkownika
GET /api/bookings?userId=<id>&limit=<number>
Headers: { Authorization: "Bearer <token>" }
```

## 🎨 Interfejs użytkownika

### Navbar

- **Niezalogowany** - Zaloguj się, Zarejestruj się
- **Zalogowany** - Avatar, menu dropdown z:
  - Mój profil
  - Moje rezerwacje
  - Ustawienia
  - Panel Admin (tylko ADMIN)
  - Wyloguj się

### Strona logowania

- **Formularz** - Email, hasło
- **Funkcje** - Pokaż/ukryj hasło, zapamiętaj mnie
- **Linki** - Rejestracja, zapomniałeś hasła
- **Konta testowe** - Lista dostępnych kont demo

### Strona rejestracji

- **Formularz** - Imię, nazwisko, email, telefon, hasło, potwierdź hasło
- **Walidacja** - Real-time validation
- **Regulamin** - Checkbox z linkami do regulaminu i polityki prywatności

### Profil użytkownika

- **Sekcje**:
  - Informacje osobiste (edytowalne)
  - Ostatnie rezerwacje (3 najnowsze)
  - Statystyki konta
  - Szybkie akcje

### Historia rezerwacji

- **Filtry** - Status rezerwacji
- **Lista** - Szczegółowe karty rezerwacji
- **Statystyki** - Podsumowanie na dole strony

## 🔧 Konfiguracja

### Zmienne środowiskowe

```env
# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Database (Prisma)
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

### Konta testowe

```typescript
// Admin
email: admin@vehiclerent.pl
password: admin123

// Manager  
email: manager@vehiclerent.pl
password: manager123

// Klient
email: jan.kowalski@example.com
password: user123
```

## 📱 Responsywność

- **Desktop** - Pełne menu dropdown w navbar
- **Mobile** - Hamburger menu z pełną nawigacją
- **Tablet** - Adaptacyjny layout formularzy

## 🚀 Wydajność

### Optymalizacje

- **Lazy loading** - Komponenty ładowane na żądanie
- **Memoization** - React.memo dla komponentów
- **Session caching** - NextAuth cache sesji
- **Database indexing** - Indeksy na email i ID

### Monitoring

- **Error boundaries** - Obsługa błędów React
- **Loading states** - Wskaźniki ładowania
- **Error messages** - Przyjazne komunikaty błędów

## 🔄 Integracje

### Z systemem rezerwacji

- **Automatyczne tworzenie** - Użytkownicy tymczasowi w booking
- **Historia** - Powiązanie rezerwacji z użytkownikami
- **Autoryzacja** - Sprawdzanie uprawnień do rezerwacji

### Z panelem admin

- **Role-based access** - Dostęp według ról
- **User management** - Zarządzanie użytkownikami (w przyszłości)

## 🛠️ Rozwój

### Planowane funkcjonalności

- **Resetowanie hasła** - Email z linkiem resetującym
- **Weryfikacja email** - Potwierdzenie adresu email
- **OAuth providers** - Google, Facebook login
- **2FA** - Dwuskładnikowa autentykacja
- **User preferences** - Ustawienia użytkownika

### Możliwe rozszerzenia

- **Social login** - Logowanie przez media społecznościowe
- **Profile pictures** - Zdjęcia profilowe użytkowników
- **Notifications** - System powiadomień
- **Activity log** - Historia aktywności użytkownika

## 🐛 Troubleshooting

### Częste problemy

1. **Błąd logowania:**
   - Sprawdź NEXTAUTH_SECRET w .env.local
   - Sprawdź format hasła w bazie danych
   - Sprawdź konfigurację Prisma

2. **Sesja nie działa:**
   - Sprawdź NEXTAUTH_URL
   - Sprawdź AuthProvider w layout.tsx
   - Sprawdź cookies w przeglądarce

3. **Błędy rejestracji:**
   - Sprawdź walidację email
   - Sprawdź długość hasła
   - Sprawdź unikalne constrainty w bazie

### Debug mode

```typescript
// Włącz debug w NextAuth
debug: process.env.NODE_ENV === 'development'

// Logi w konsoli
console.log('Session:', session)
console.log('User:', user)
```

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Sprawdź logi serwera Next.js
3. Sprawdź konfigurację NextAuth
4. Sprawdź połączenie z bazą danych
5. Skontaktuj się z zespołem deweloperskim
