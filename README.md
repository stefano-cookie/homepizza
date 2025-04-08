# HomePizza - Dashboard amministrativa per bot Telegram

HomePizza è un'applicazione full-stack che permette a utenti autenticati di accedere a una dashboard web dalla quale è possibile interagire con un chatbot Telegram. Attraverso la dashboard, gli amministratori possono:

- Visualizzare i messaggi ricevuti dal bot Telegram in tempo reale
- Inviare risposte ai messaggi direttamente dalla dashboard
- Gestire tutte le conversazioni in modo centralizzato

## Screenshot

![Dashboard HomePizza](/screenshots/dashboard.png)
(Inserisci screenshot quando disponibili)

## Tecnologie Utilizzate 🔧

- **Backend**: Laravel 12
- **Frontend**: React con Inertia.js + TailwindCSS
- **Database**: SQLite (configurabile anche per MySQL/PostgreSQL)
- **API**: Telegram Bot API (via irazasyed/telegram-bot-sdk)
- **Real-time**: Laravel Echo + Pusher

## Architettura del Sistema 🏗️

L'applicazione è strutturata secondo il seguente schema:

1. **Sistema di Autenticazione**: 
   - Implementato con Laravel Breeze e Sanctum
   - Protezione dell'accesso alla dashboard amministrativa
   - Sistema di login/registrazione per amministratori

2. **Bot Telegram**: 
   - Riceve messaggi dagli utenti su Telegram
   - Invia le risposte fornite dalla dashboard
   - Webhook configurato per ricevere aggiornamenti in tempo reale

3. **Database**: 
   - Memorizza utenti, chat e messaggi
   - Persistenza dei dati delle conversazioni
   - Tracciamento degli utenti Telegram

4. **API REST**: 
   - Consente alla dashboard di comunicare con il backend
   - Endpoint per ottenere chat, messaggi e inviare risposte
   - Protezione CSRF e autenticazione Sanctum

5. **Dashboard React**: 
   - Interfaccia utente reattiva e moderna
   - Visualizzazione delle chat e dei messaggi
   - Aggiornamenti in tempo reale tramite WebSockets

## Struttura del Database 🗄️

L'applicazione utilizza tre tabelle principali:

1. **users**: Gestisce gli utenti dell'applicazione (amministratori del bot)
2. **telegram_chats**: Memorizza le informazioni sulle chat Telegram
3. **telegram_messages**: Archivia tutti i messaggi scambiati, sia in entrata che in uscita

## Requisiti di Sistema 📋

- PHP >= 8.2
- Composer
- Node.js e npm
- SQLite, MySQL o PostgreSQL
- Account Telegram e bot creato via [BotFather](https://t.me/BotFather)
- Account Pusher per WebSockets (gratuito per sviluppo)

## Installazione 🚀

1. **Clonare il repository**
   ```bash
   git clone https://github.com/tuonome/homepizza.git
   cd homepizza
   ```

2. **Installare le dipendenze PHP**
   ```bash
   composer install
   ```

3. **Configurare le variabili d'ambiente**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configurare il database in .env**
   ```
   DB_CONNECTION=sqlite
   # Oppure configura MySQL/PostgreSQL se preferisci
   ```

5. **Configurare Telegram**
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```

6. **Configurare Pusher per i WebSockets in .env**
   ```
   BROADCAST_DRIVER=pusher
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_APP_KEY=your_pusher_app_key
   PUSHER_APP_SECRET=your_pusher_app_secret
   PUSHER_APP_CLUSTER=eu
   ```

7. **Creare il database (se si utilizza SQLite)**
   ```bash
   touch database/database.sqlite
   ```

8. **Eseguire le migrazioni**
   ```bash
   php artisan migrate
   ```

9. **Installare le dipendenze JavaScript**
   ```bash
   npm install
   ```

10. **Compilare gli asset**
    ```bash
    npm run build
    ```

## Configurazione del Bot Telegram 🤖

1. Creare un nuovo bot su Telegram usando [BotFather](https://t.me/BotFather)
2. Ottenere il token del bot e aggiungerlo al file `.env`
3. Configurare il webhook per il bot (richiede un URL pubblicamente accessibile):
   ```bash
   https://api.telegram.org/bot{TOKEN}/setWebhook?url={URL_PUBBLICO}/api/telegram/webhook
   ```

Per test in locale, è possibile utilizzare [ngrok](https://ngrok.com/) per creare un tunnel temporaneo:
```bash
ngrok http 8000
```

## Avvio dell'applicazione 🏃‍♂️

1. **Avvio del server di sviluppo**
   ```bash
   php artisan serve
   ```

2. **In una finestra di terminale separata, avviare il frontend (se in modalità sviluppo)**
   ```bash
   npm run dev
   ```

3. **Accedere all'applicazione**
   Visita `http://localhost:8000` nel tuo browser

4. **Registra un account amministratore**
   Clicca "Nuovo Admin" nella pagina iniziale per creare un account

## Utilizzo 📱

1. Accedi alla dashboard con le tue credenziali
2. Sulla sinistra vedrai la lista delle chat attive con utenti Telegram
3. Seleziona una chat per visualizzare i messaggi nella sezione centrale
4. Utilizza il campo di input in basso per inviare risposte agli utenti

## Struttura del progetto 📁

```
homepizza/
├── app/                        # Logica dell'applicazione
│   ├── Events/                 # Eventi (per WebSockets)
│   ├── Http/
│   │   ├── Controllers/        # Controller dell'applicazione
│   │   ├── Middleware/         # Middleware personalizzati
│   ├── Models/                 # Modelli Eloquent
├── config/                     # File di configurazione
├── database/                   # Migrazioni e seeder
├── public/                     # File pubblici 
├── resources/                  # Asset frontend
│   ├── css/                    # Stili CSS/Tailwind
│   ├── js/                     # Componenti React
│   │   ├── Components/         # Componenti riutilizzabili
│   │   ├── Layouts/            # Layout dell'applicazione
│   │   ├── Pages/              # Pagine React per Inertia.js
├── routes/                     # Definizioni delle rotte
└── storage/                    # File di storage
```

## Funzionalità WebSockets 📡

L'applicazione utilizza Pusher per fornire aggiornamenti in tempo reale alla dashboard quando arrivano nuovi messaggi. Questo è implementato tramite:

1. Un evento Laravel (`NewTelegramMessage`) che viene trasmesso quando arriva un nuovo messaggio
2. Un canale privato per ogni chat (`chat.{id}`)
3. Sottoscrizione lato client tramite Laravel Echo

## Contribuire 🤝

Le contribuzioni sono benvenute! Per favore, segui questi passaggi:

1. Forka il repository
2. Crea un branch per la tua feature (`git checkout -b feature/amazing-feature`)
3. Committa i tuoi cambiamenti (`git commit -m 'Add some amazing feature'`)
4. Pusha al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## License 📄

Questo progetto è rilasciato sotto la Licenza MIT - vedi il file LICENSE per i dettagli.

## Contatti 📨

Nome - [La tua email] - Email

Link al progetto: [https://github.com/tuonome/homepizza](https://github.com/tuonome/homepizza)