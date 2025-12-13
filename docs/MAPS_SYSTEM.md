# 🗺️ System Map i Lokalizacji - Dokumentacja

## 📋 Przegląd

System map i lokalizacji w platformie wynajmu pojazdów umożliwia:
- Wyświetlanie pojazdów na interaktywnej mapie Google Maps
- Wybór lokalizacji odbioru i zwrotu w formularzu rezerwacji
- Filtrowanie pojazdów według lokalizacji
- Wyświetlanie szczegółów punktów odbioru/zwrotu

## 🏗️ Architektura

### Komponenty

#### 1. `VehicleMap.tsx`
Główny komponent mapy z funkcjonalnościami:
- Wyświetlanie pojazdów jako markerów
- Info windows z szczegółami pojazdów
- Wybór lokalizacji (location picker mode)
- Responsywny design z legendą

#### 2. `LocationPicker.tsx`
Komponent wyboru lokalizacji z:
- Dropdown z dostępnymi lokalizacjami
- Szczegółami punktów (adres, godziny, telefon)
- Opcjonalną mapą
- Walidacją formularza

#### 3. `/app/map/page.tsx`
Strona z mapą wszystkich pojazdów:
- Filtry wyszukiwania
- Statystyki pojazdów
- Lista pojazdów pod mapą
- Integracja z systemem rezerwacji

### Lokalizacje

Predefiniowane punkty odbioru/zwrotu:

```typescript
const LOCATIONS = {
  'Warszawa Centrum': { lat: 52.2297, lng: 21.0122 },
  'Warszawa Lotnisko': { lat: 52.1657, lng: 20.9671 },
  'Kraków Centrum': { lat: 50.0647, lng: 19.9450 },
  'Gdańsk Centrum': { lat: 54.3520, lng: 18.6466 },
  'Wrocław Centrum': { lat: 51.1079, lng: 17.0385 },
  'Poznań Centrum': { lat: 52.4064, lng: 16.9252 }
}
```

## 🔧 Konfiguracja

### Google Maps API

1. **Uzyskanie klucza API:**
   ```bash
   # 1. Idź do https://console.cloud.google.com/
   # 2. Utwórz nowy projekt lub wybierz istniejący
   # 3. Włącz Maps JavaScript API
   # 4. Utwórz klucz API w sekcji "Credentials"
   ```

2. **Konfiguracja w .env.local:**
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
   ```

3. **Ograniczenia klucza API (zalecane):**
   - Ograniczenie do domeny aplikacji
   - Ograniczenie do Maps JavaScript API
   - Ustawienie limitów dziennych

### Instalacja pakietów

```bash
npm install @googlemaps/js-api-loader
```

## 🎨 Funkcjonalności

### Markery pojazdów

- **Kolor:** Zielony (dostępne) / Czerwony (niedostępne)
- **Ikony:** Różne dla samochodów, rowerów, hulajnóg
- **Info Windows:** Szczegóły pojazdu + przycisk rezerwacji

### Filtry mapy

- Wyszukiwanie po marce/modelu/lokalizacji
- Filtr typu pojazdu (samochód/rower/hulajnoga)
- Filtr dostępności
- Filtr lokalizacji

### Integracja z rezerwacją

- Przycisk "Zobacz na mapie" w sekcji VehicleTypes
- Automatyczne przekierowanie do rezerwacji z mapy
- Wybór lokalizacji w formularzu rezerwacji

## 📱 Responsywność

- **Desktop:** Pełna funkcjonalność z sidebar'em
- **Tablet:** Kompaktowy layout z ukrywanymi filtrami
- **Mobile:** Optymalizacja dotykowa, uproszczone kontrolki

## 🔗 Nawigacja

### Linki do mapy:
- Footer: "Mapa pojazdów"
- VehicleTypes: "Zobacz na mapie"
- Bezpośredni URL: `/map`

### Integracje:
- `/booking` - formularz z LocationPicker
- `/admin/vehicles` - zarządzanie lokalizacjami pojazdów

## 🎯 Przykłady użycia

### Podstawowe wyświetlanie mapy

```tsx
<VehicleMap 
  vehicles={vehicles}
  height="400px"
  showVehicles={true}
/>
```

### Wybór lokalizacji

```tsx
<LocationPicker
  selectedLocation={location}
  onLocationChange={setLocation}
  label="Miejsce odbioru"
  required={true}
  showMap={false}
/>
```

### Mapa z filtrowaniem

```tsx
<VehicleMap 
  vehicles={filteredVehicles}
  height="500px"
  showVehicles={true}
/>
```

## 🚀 Wydajność

### Optymalizacje:
- Lazy loading Google Maps API
- Debounced search w filtrach
- Memoizacja markerów
- Responsive images w info windows

### Fallback:
- Loading state podczas ładowania mapy
- Error state przy błędach API
- Graceful degradation bez klucza API

## 🔒 Bezpieczeństwo

- Klucz API tylko w zmiennych środowiskowych
- Ograniczenia domeny dla klucza API
- Walidacja danych wejściowych
- Sanityzacja HTML w info windows

## 📊 Metryki

System śledzi:
- Liczba wyświetleń mapy
- Kliknięcia w markery
- Konwersje z mapy do rezerwacji
- Popularne lokalizacje

## 🛠️ Rozwój

### Planowane funkcjonalności:
- Routing między lokalizacjami
- Geolokalizacja użytkownika
- Offline maps cache
- Real-time tracking pojazdów
- Street View integration

### Możliwe rozszerzenia:
- Integracja z systemami płatności
- Powiadomienia push o dostępności
- AR view dla znajdowania pojazdów
- Integracja z kalendarzem

## 🐛 Troubleshooting

### Częste problemy:

1. **Mapa się nie ładuje:**
   - Sprawdź klucz API w .env.local
   - Sprawdź ograniczenia klucza w Google Console
   - Sprawdź console browser'a pod kątem błędów

2. **Markery nie wyświetlają się:**
   - Sprawdź format danych pojazdów
   - Sprawdź współrzędne lokalizacji
   - Sprawdź filtry

3. **Info windows nie działają:**
   - Sprawdź event listeners
   - Sprawdź HTML content w info windows
   - Sprawdź CSS conflicts

### Debug mode:

```typescript
// Włącz debug w VehicleMap
const DEBUG = process.env.NODE_ENV === 'development'
if (DEBUG) console.log('Map data:', vehicles)
```

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź dokumentację Google Maps API
2. Sprawdź logi w konsoli przeglądarki
3. Sprawdź konfigurację w Google Cloud Console
4. Skontaktuj się z zespołem deweloperskim
