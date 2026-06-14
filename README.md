# Palmora Hotel Reservation System Demo

This repository contains a compact hotel reservation demo that is intentionally split into a frontend UI and a lightweight backend API. The runnable application lives under `palmora-demo/palmora-demo`, while this document serves as the top-level guide for grading, execution, and traceability.

The document is split into two complete parts:

1. Part 1: English
2. Part 2: Türkçe

---

# Part 1: English

## 1) Project Overview & Architecture

Palmora is a decoupled full-stack hotel reservation demo designed for classroom evaluation, local execution, and reproducible grading. The stack is intentionally simple, portable, and easy to inspect:

- Frontend: React built with Vite
- Backend: Single-file Node.js/Express server in `server.js`
- Database: Embedded local SQLite powered by `sql.js`

The backend does not depend on an external database service. Instead, `sql.js` loads SQLite in-process and persists a local `.sqlite` file beside the server. This design gives the demo zero-installation portability, no external database configuration, and predictable behavior in grading environments.

The architecture is intentionally decoupled:

- The React UI handles room search, booking submission, and user-facing status states.
- The Express API owns schema initialization, request validation, reservation logic, payment records, and error shaping.
- SQLite stores the hotel domain data locally and automatically.

This separation makes it easy to verify each layer independently while keeping the demo small enough for academic review.

## 2) Academic Traceability & Data Integrity

The database schema is created automatically on startup and consists of five relational tables:

| Table       | Purpose                                      | Key Notes                                                                                                                            |
| ----------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| HOTEL       | Stores hotel identity and location metadata  | Parent table for ROOM                                                                                                                |
| GUEST       | Stores guest profile and authentication data | Uses lowercase `email` and `UNIQUE COLLATE NOCASE` to keep the dictionary synchronized with API payloads and case-insensitive lookup |
| ROOM        | Stores room inventory and pricing            | Linked to HOTEL through `HotelID`                                                                                                    |
| RESERVATION | Stores booking lifecycle records             | Tracks dates, amount, and reservation status                                                                                         |
| PAYMENT     | Stores payment outcome records               | Linked to RESERVATION through `ReservationID`                                                                                        |

The schema is created automatically every time the server starts, which means the structure is always reproducible for evaluation. The `GUEST` table is especially important for traceability because the column is defined as lowercase `email`, and the backend normalizes login and signup payloads to the same field name and lowercase lookup path.

Three system exceptions are wired directly to the UI-visible API responses:

- `RoomNotAvailableException`: returned when a room is already reserved for overlapping dates
- `InvalidDateFormatException`: returned when the date window is invalid or the checkout date is not after the check-in date
- `PaymentGatewayTimeoutException`: returned when the payment stage is intentionally simulated or times out

The concurrency and integrity layer is designed to prevent double-booking bugs. Two checks work together:

1. Search-time exclusion with SQL `NOT EXISTS` inside `GET /api/rooms/search`, which hides rooms that already have overlapping active reservations.
2. Commit-time guard with `findReservationOverlap(roomId, checkInDate, checkOutDate)` inside `POST /api/bookings/confirm`, wrapped in a `BEGIN IMMEDIATE TRANSACTION` workflow.

That means the demo protects both the browsing phase and the booking confirmation phase. If another reservation overlaps the requested room and dates, the API rejects the booking instead of allowing duplicate occupancy.

## 3) Pre-Requisites & Installation

Requirements:

- Node.js v18 or newer
- npm
- A terminal

Installation steps:

1. Open a terminal.
2. Navigate to the application directory.
3. Install the dependencies.

```bash
cd "palmora-demo/palmora-demo"
npm install
```

This downloads the backend engine dependencies used by the demo, including Express and sql.js.

## 4) Execution Roadmap

Run the two components in separate terminal windows or tabs.

### Backend API

```bash
npm run server
```

The backend runs securely on port 3001 and exposes the REST API.

### Frontend Dev UI

```bash
npm run dev
```

The frontend runs on port 5173 and connects to the backend API.

## 5) RESTful WS Endpoint Map

The following table maps the active routes exposed by the demo server.

| Method | Route                        | Purpose                                                  | Expected Request Shape                                                                                                                                    | Expected Response                                             |
| ------ | ---------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| GET    | `/api/health`                | Health check for the demo backend                        | No body                                                                                                                                                   | `{ "status": "ok", "database": "palmora-demo.sqlite" }`       |
| GET    | `/api/room-images/:slug.svg` | Serves decorative room artwork as SVG                    | Route parameter `slug` such as `ocean-view`, `garden-view`, or `suites`                                                                                   | SVG image stream                                              |
| POST   | `/api/auth/signup`           | Creates a guest account                                  | JSON body with `fullName` or `Full Name`, `email`, `password`, optional phone and address fields                                                          | 201 response with user profile and session token              |
| POST   | `/api/auth/login`            | Authenticates a guest                                    | JSON body with `username` or `email`, plus `password`                                                                                                     | Session token and guest profile                               |
| GET    | `/api/rooms/search`          | Searches available rooms in Famagusta or a selected city | Query parameters: `location`, `checkInDate`, `checkOutDate`, `guestCount`, `type`                                                                         | Array of matching room objects                                |
| POST   | `/api/bookings/confirm`      | Confirms a reservation and creates payment rows          | JSON body with `GuestID`, `RoomID`, `checkInDate`, `checkOutDate`, `totalAmount`, `paymentMethod`; optional `simulateGatewayTimeout` or `simulateTimeout` | 201 booking confirmation, or one of the documented exceptions |

Example search query:

```text
/api/rooms/search?location=Famagusta&checkInDate=2026-05-20&checkOutDate=2026-05-24&guestCount=2&type=All
```

Example booking body:

```json
{
  "GuestID": 1,
  "RoomID": 1,
  "checkInDate": "2026-05-20",
  "checkOutDate": "2026-05-24",
  "totalAmount": 880,
  "paymentMethod": "Credit/ Debit Card"
}
```

## 6) Evaluator / Grading Demo Step

Use the steps below to demonstrate the system in a grading session.

1. Start the backend with `npm run server` and the frontend with `npm run dev`.
2. Open the UI and search for rooms in Famagusta using the default dates or the query:

```text
location=Famagusta
checkInDate=2026-05-20
checkOutDate=2026-05-24
guestCount=2
type=All
```

3. Select one of the returned rooms, then submit a confirmed booking. The demo uses the local guest record with `GuestID = 1`.
4. To force `RoomNotAvailableException`, attempt a second booking for the same room with overlapping dates, for example `2026-05-22` to `2026-05-26`, or repeat the same room and date window immediately after the first confirmed reservation.
5. If needed, demonstrate `PaymentGatewayTimeoutException` by sending a booking request with `simulateGatewayTimeout: true` or a payment method value containing the word `timeout`.

The key grading point is that the room search result, the booking confirmation, and the overlap rejection all come from the same integrated data flow.

---

# Part 2: Türkçe

## 1) Proje Genel Bakış ve Mimari

Palmora, sınıf değerlendirmesi, yerel çalıştırma ve tekrarlanabilir notlandırma için tasarlanmış ayrık bir tam yığın otel rezervasyon demosudur. Teknoloji yığını özellikle sade, taşınabilir ve denetlenebilir tutulmuştur:

- Ön yüz: Vite ile oluşturulmuş React
- Arka uç: `server.js` içinde yer alan tek dosyalı Node.js/Express sunucusu
- Veritabanı: `sql.js` ile çalışan gömülü yerel SQLite

Arka uç harici bir veritabanı hizmetine bağımlı değildir. Bunun yerine, `sql.js`, SQLite motorunu süreç içinde yükler ve sunucunun yanında yerel bir `.sqlite` dosyasına yazar. Bu yaklaşım, sıfır ek kurulum, harici veritabanı yapılandırması gerektirmeme ve notlandırma ortamlarında öngörülebilir davranış sağlar.

Mimari bilinçli olarak ayrıştırılmıştır:

- React arayüzü oda arama, rezervasyon gönderimi ve kullanıcıya dönük durum akışlarını yönetir.
- Express API, şema başlatma, istek doğrulama, rezervasyon mantığı, ödeme kayıtları ve hata biçimlendirmesinden sorumludur.
- SQLite, otel alan verisini yerelde ve otomatik biçimde saklar.

Bu ayrım, her katmanı tek tek doğrulamayı kolaylaştırır ve aynı zamanda demoyu akademik inceleme için yeterince küçük tutar.

## 2) Akademik İzlenebilirlik ve Veri Bütünlüğü

Veritabanı şeması sunucu başlangıcında otomatik olarak oluşturulur ve beş ilişkisel tablodan oluşur:

| Tablo       | Amaç                                                | Temel Notlar                                                                                             |
| ----------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| HOTEL       | Otel kimliği ve konum bilgisini saklar              | ROOM için üst tablodur                                                                                   |
| GUEST       | Misafir profili ve kimlik doğrulama verisini saklar | Veri sözlüğü ile API yükünü senkron tutmak için küçük harfli `email` ve `UNIQUE COLLATE NOCASE` kullanır |
| ROOM        | Oda envanteri ve fiyat bilgisini saklar             | `HotelID` üzerinden HOTEL’e bağlanır                                                                     |
| RESERVATION | Rezervasyon yaşam döngüsü kayıtlarını saklar        | Tarih, tutar ve durum bilgisini izler                                                                    |
| PAYMENT     | Ödeme sonucu kayıtlarını saklar                     | `ReservationID` üzerinden RESERVATION’a bağlanır                                                         |

Şema her sunucu başlangıcında otomatik olarak kurulduğu için yapı değerlendirme ortamında her zaman yeniden üretilebilir. `GUEST` tablosu özellikle izlenebilirlik açısından önemlidir; çünkü sütun küçük harfli `email` olarak tanımlanmıştır ve arka uç giriş/üyelik isteklerinde aynı alan adını ve küçük harfli arama yolunu kullanır.

Üç sistem istisnası doğrudan kullanıcı arayüzüne yansıyan API cevaplarına bağlanmıştır:

- `RoomNotAvailableException`: oda çakışan tarihlerde zaten rezerve edilmişse döner
- `InvalidDateFormatException`: tarih aralığı geçersizse veya çıkış tarihi giriş tarihinden sonra değilse döner
- `PaymentGatewayTimeoutException`: ödeme aşaması özellikle simüle edildiğinde ya da zaman aşımına uğradığında döner

Eşzamanlılık ve bütünlük katmanı, çift rezervasyon hatalarını önlemek için tasarlanmıştır. İki kontrol birlikte çalışır:

1. `GET /api/rooms/search` içinde yer alan SQL `NOT EXISTS` filtresi, aktif ve çakışan rezervasyona sahip odaları arama sonucundan gizler.
2. `POST /api/bookings/confirm` içinde yer alan `findReservationOverlap(roomId, checkInDate, checkOutDate)` kontrolü, `BEGIN IMMEDIATE TRANSACTION` akışı içinde çalışır.

Böylece demo hem arama aşamasında hem de rezervasyon onayı aşamasında koruma sağlar. Aynı oda ve tarih aralığı için çakışan başka bir rezervasyon varsa API, çift doluluk oluşmasına izin vermez.

## 3) Gereksinimler ve Kurulum

Gereksinimler:

- Node.js v18 veya daha yeni bir sürüm
- npm
- Bir terminal

Kurulum adımları:

1. Bir terminal açın.
2. Uygulama dizinine geçin.
3. Bağımlılıkları yükleyin.

```bash
cd "palmora-demo/palmora-demo"
npm install
```

Bu komut, Express ve sql.js dahil olmak üzere demoda kullanılan arka uç motor bağımlılıklarını indirir.

## 4) Çalıştırma Yol Haritası

İki bileşeni ayrı terminal pencerelerinde veya sekmelerinde çalıştırın.

### Arka Uç API

```bash
npm run server
```

Arka uç güvenli biçimde 3001 portunda çalışır ve REST API’yi sunar.

### Ön Yüz Geliştirme Arayüzü

```bash
npm run dev
```

Ön yüz 5173 portunda çalışır ve arka uç API’ye bağlanır.

## 5) RESTful WS Uç Nokta Haritası

Aşağıdaki tablo, demo sunucusunun sunduğu aktif rotaları eşler.

| Yöntem | Rota                         | Amaç                                                | Beklenen İstek Yapısı                                                                                                                                                         | Beklenen Yanıt                                            |
| ------ | ---------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| GET    | `/api/health`                | Demo arka ucunun sağlık kontrolü                    | Gövde yok                                                                                                                                                                     | `{ "status": "ok", "database": "palmora-demo.sqlite" }`   |
| GET    | `/api/room-images/:slug.svg` | Dekoratif oda görselini SVG olarak sunar            | `ocean-view`, `garden-view` veya `suites` gibi bir `slug` rota parametresi                                                                                                    | SVG görüntü akışı                                         |
| POST   | `/api/auth/signup`           | Misafir hesabı oluşturur                            | `fullName` veya `Full Name`, `email`, `password`, isteğe bağlı telefon ve adres alanları içeren JSON gövde                                                                    | Kullanıcı profili ve oturum belirteci içeren 201 yanıtı   |
| POST   | `/api/auth/login`            | Misafiri doğrular                                   | `username` veya `email` ile birlikte `password` içeren JSON gövde                                                                                                             | Oturum belirteci ve misafir profili                       |
| GET    | `/api/rooms/search`          | Famagusta ya da seçilen şehirde uygun oda arar      | `location`, `checkInDate`, `checkOutDate`, `guestCount`, `type` sorgu parametreleri                                                                                           | Eşleşen oda nesneleri dizisi                              |
| POST   | `/api/bookings/confirm`      | Rezervasyonu onaylar ve ödeme kayıtlarını oluşturur | `GuestID`, `RoomID`, `checkInDate`, `checkOutDate`, `totalAmount`, `paymentMethod` alanlarını içeren JSON gövde; isteğe bağlı `simulateGatewayTimeout` veya `simulateTimeout` | 201 rezervasyon onayı ya da belgelenen istisnalardan biri |

Örnek arama sorgusu:

```text
/api/rooms/search?location=Famagusta&checkInDate=2026-05-20&checkOutDate=2026-05-24&guestCount=2&type=All
```

Örnek rezervasyon gövdesi:

```json
{
  "GuestID": 1,
  "RoomID": 1,
  "checkInDate": "2026-05-20",
  "checkOutDate": "2026-05-24",
  "totalAmount": 880,
  "paymentMethod": "Credit/ Debit Card"
}
```

## 6) Değerlendirici / Notlandırma Demo Adımı

Notlandırma oturumunda sistemi göstermek için aşağıdaki adımları kullanın.

1. `npm run server` ile arka ucu, `npm run dev` ile ön yüzü başlatın.
2. Arayüzü açın ve Famagusta için varsayılan tarihlerle veya şu sorguyla oda arayın:

```text
location=Famagusta
checkInDate=2026-05-20
checkOutDate=2026-05-24
guestCount=2
type=All
```

3. Dönen odalardan birini seçin ve onaylı bir rezervasyon gönderin. Demo, `GuestID = 1` olan yerel misafir kaydını kullanır.
4. `RoomNotAvailableException` üretmek için aynı oda için çakışan tarihlerle ikinci bir rezervasyon deneyin. Örneğin `2026-05-22` ile `2026-05-26` arasını kullanabilir veya ilk onaylı rezervasyondan hemen sonra aynı oda ve tarih aralığını tekrar gönderebilirsiniz.
5. Gerekirse `PaymentGatewayTimeoutException` göstermek için isteğe `simulateGatewayTimeout: true` ekleyin ya da içinde `timeout` kelimesi geçen bir ödeme yöntemi değeri gönderin.

Temel değerlendirme noktası; oda arama sonucu, rezervasyon onayı ve çakışma reddinin aynı entegre veri akışından gelmesidir.
