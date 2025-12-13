# 🗺️ Konfiguracja Google Maps API

## ⚠️ **WAŻNE: KLUCZ API NIE JEST SKONFIGUROWANY**

Obecnie aplikacja używa placeholder'a `"YOUR_GOOGLE_MAPS_API_KEY_HERE"` zamiast prawdziwego klucza Google Maps API. Aby mapa działała poprawnie, musisz skonfigurować klucz API.

## 🔧 **INSTRUKCJA KONFIGURACJI**

### **Krok 1: Utwórz projekt w Google Cloud Console**

1. **Przejdź do Google Cloud Console**
   - Otwórz: https://console.cloud.google.com/
   - Zaloguj się na swoje konto Google

2. **Utwórz nowy projekt**
   - Kliknij na dropdown z nazwą projektu (góra strony)
   - Kliknij "New Project"
   - Nazwa projektu: `VehicleRent Maps`
   - Kliknij "Create"

### **Krok 2: Włącz wymagane API**

1. **Przejdź do API & Services > Library**
   - W menu bocznym: "APIs & Services" → "Library"

2. **Włącz Maps JavaScript API**
   - Wyszukaj: "Maps JavaScript API"
   - Kliknij na wynik
   - Kliknij "Enable"

3. **Włącz Places API (opcjonalne)**
   - Wyszukaj: "Places API"
   - Kliknij na wynik
   - Kliknij "Enable"

### **Krok 3: Utwórz klucz API**

1. **Przejdź do Credentials**
   - W menu bocznym: "APIs & Services" → "Credentials"

2. **Utwórz klucz API**
   - Kliknij "+ CREATE CREDENTIALS"
   - Wybierz "API key"
   - Skopiuj wygenerowany klucz

3. **Skonfiguruj ograniczenia (WAŻNE!)**
   - Kliknij na nazwę klucza aby go edytować
   - W sekcji "Application restrictions":
     - Wybierz "HTTP referrers (web sites)"
     - Dodaj: `http://localhost:3000/*`
     - Dodaj: `https://yourdomain.com/*` (dla produkcji)
   - W sekcji "API restrictions":
     - Wybierz "Restrict key"
     - Zaznacz: "Maps JavaScript API"
     - Zaznacz: "Places API" (jeśli włączone)
   - Kliknij "Save"

### **Krok 4: Zaktualizuj plik .env.local**

1. **Otwórz plik .env.local**
   ```bash
   # W katalogu vehicle-rental-platform
   code .env.local
   ```

2. **Zastąp placeholder swoim kluczem**
   ```env
   # Przed:
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_HERE"
   
   # Po:
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyC4R6AN7SmxxdKVQjfVR2C_jMZCrom28C8"
   ```

3. **Zapisz plik**

### **Krok 5: Restart aplikacji**

```bash
# Zatrzymaj serwer (Ctrl+C)
# Uruchom ponownie
npm run dev
```

## 🧪 **TESTOWANIE**

### **Sprawdź czy mapa działa:**

1. **Przejdź do strony mapy**
   - URL: http://localhost:3000/map
   - Powinna załadować się mapa Google

2. **Sprawdź markery pojazdów**
   - Powinny być widoczne markery na mapie
   - Kliknij na marker - powinno otworzyć się info window

3. **Sprawdź filtry**
   - Użyj filtrów typu pojazdu
   - Sprawdź wyszukiwanie

### **Sprawdź konsolę przeglądarki:**

- **Brak błędów**: Mapa działa poprawnie
- **Błąd "InvalidKeyMapError"**: Klucz API jest nieprawidłowy
- **Błąd "RefererNotAllowedMapError"**: Ograniczenia domeny są źle skonfigurowane

## 💰 **KOSZTY I LIMITY**

### **Darmowy limit Google Maps:**

- **$200 miesięcznie** w kredytach
- **28,500 map loads** miesięcznie (za darmo)
- **100,000 geocoding requests** miesięcznie

### **Koszty po przekroczeniu:**

- **Maps JavaScript API**: $7 za 1,000 map loads
- **Places API**: $17 za 1,000 requests

### **Optymalizacja kosztów:**

1. **Ograniczenia API** - Tylko potrzebne API
2. **Ograniczenia domeny** - Tylko twoje domeny
3. **Monitoring użycia** - Google Cloud Console
4. **Caching** - Aplikacja już używa cache'owania

## 🔒 **BEZPIECZEŃSTWO**

### **Najlepsze praktyki:**

1. **Nigdy nie commituj klucza do Git**
   ```bash
   # .env.local jest już w .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Używaj ograniczeń domeny**
   - Tylko twoje domeny mogą używać klucza
   - Zapobiega nadużyciom

3. **Monitoruj użycie**
   - Sprawdzaj statystyki w Google Cloud Console
   - Ustaw alerty budżetowe

4. **Różne klucze dla środowisk**
   - Development: ograniczony do localhost
   - Production: ograniczony do domeny produkcyjnej

## 🚨 **ROZWIĄZYWANIE PROBLEMÓW**

### **Mapa się nie ładuje:**

1. **Sprawdź klucz API**
   - Czy jest poprawnie skopiowany?
   - Czy nie ma spacji na początku/końcu?

2. **Sprawdź ograniczenia**
   - Czy domena jest dodana do ograniczeń?
   - Czy API są włączone?

3. **Sprawdź konsolę**
   - F12 → Console
   - Szukaj błędów związanych z Google Maps

### **Błędy w konsoli:**

```javascript
// Błąd: InvalidKeyMapError
// Rozwiązanie: Sprawdź czy klucz API jest poprawny

// Błąd: RefererNotAllowedMapError  
// Rozwiązanie: Dodaj domenę do ograniczeń

// Błąd: ApiNotActivatedMapError
// Rozwiązanie: Włącz Maps JavaScript API
```

### **Markery się nie wyświetlają:**

1. **Sprawdź dane pojazdów**
   - Czy baza danych zawiera pojazdy?
   - Czy pojazdy mają współrzędne?

2. **Sprawdź API endpoint**
   - URL: http://localhost:3000/api/vehicles
   - Powinien zwrócić listę pojazdów

## 📞 **WSPARCIE**

### **Oficjalne zasoby:**

- **Dokumentacja**: https://developers.google.com/maps/documentation
- **Przykłady kodu**: https://developers.google.com/maps/documentation/javascript/examples
- **Stack Overflow**: Tag `google-maps-api-3`

### **Przydatne linki:**

- **Google Cloud Console**: https://console.cloud.google.com/
- **API Dashboard**: https://console.cloud.google.com/apis/dashboard
- **Billing**: https://console.cloud.google.com/billing

## ✅ **CHECKLIST KONFIGURACJI**

- [ ] Utworzony projekt w Google Cloud Console
- [ ] Włączone Maps JavaScript API
- [ ] Włączone Places API (opcjonalne)
- [ ] Utworzony klucz API
- [ ] Skonfigurowane ograniczenia domeny
- [ ] Skonfigurowane ograniczenia API
- [ ] Zaktualizowany plik .env.local
- [ ] Restart aplikacji
- [ ] Przetestowana mapa na /map
- [ ] Sprawdzona konsola przeglądarki
- [ ] Ustawione alerty budżetowe

---

**Po skonfigurowaniu klucza API, mapa będzie w pełni funkcjonalna!** 🗺️
