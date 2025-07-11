# Lavendair

A modern air quality monitoring dashboard built with React and Vite. Monitor environmental sensors in real-time, visualize air quality data, and manage sensor networks with an intuitive web interface.

## Features

- **Real-time Air Quality Monitoring** - Track PM1.0, PM2.5, and PM10 particulate matter levels
- **Interactive Data Visualization** - Beautiful charts and graphs using Recharts
- **Multi-sensor Management** - Monitor multiple air quality sensors from a centralized dashboard
- **Historical Data Analysis** - View trends over 24 hours, 7 days, or 30 days
- **PurpleAir Integration** - Connect to PurpleAir sensor network via API
- **Firebase Authentication** - Secure user authentication and admin panel
- **Data Export** - Export sensor data in various formats
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Admin Panel** - Administrative controls for user and sensor management
- **Contact System** - Built-in contact form with EmailJS integration

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for authentication)
- PurpleAir API key (optional, for real sensor data)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lavendair
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   
   # Development Login (Optional)
   VITE_DEV_EMAIL=dev@lavendair.com
   VITE_DEV_PASSWORD=dev123
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Configuration

### Firebase Setup

For detailed Firebase configuration instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

### PurpleAir API Integration

1. Get your PurpleAir API key from [PurpleAir](https://www2.purpleair.com/)
2. Configure the API key in the Settings page of the application
3. Add your sensor IDs to connect real sensors

## Usage

### Authentication

- **Admin Login**: Use Firebase admin credentials
- **Development Login**: Click "🛠️ Dev" button (no Firebase required)
- **Regular Users**: Create account or use existing Firebase users

### Dashboard Features

- **Sensor Overview**: View all connected sensors and their status
- **Real-time Data**: Monitor current air quality readings
- **Historical Charts**: Analyze trends over different time periods
- **AQI Color Coding**: Visual indicators for air quality levels
  - Green: Good (0-12 μg/m³)
  - Yellow: Moderate (13-35 μg/m³)
  - Orange: Unhealthy for Sensitive Groups (36-55 μg/m³)
  - Red: Unhealthy (56+ μg/m³)

### Sensor Management

- Add, edit, and delete sensors
- Configure sensor locations and calibration factors
- View individual sensor data with detailed charts
- Monitor sensor connectivity status

### Data Export

- Export historical data in CSV format
- Schedule automated exports
- Integration with Eagle.io platform

## Technology Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Email Service**: EmailJS

## Project Structure

```
lavendair/
├── public/
│   └── images/          # Logo and static images
├── src/
│   ├── components/      # Reusable React components
│   │   ├── AdminPanel.jsx
│   │   ├── Contact.jsx
│   │   └── Navbar.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/           # Main application pages
│   │   ├── Dashboard.jsx
│   │   ├── Sensors.jsx
│   │   ├── Exports.jsx
│   │   ├── Settings.jsx
│   │   └── Login.jsx
│   ├── services/        # API and external services
│   │   ├── purpleAirService.js
│   │   └── exportService.js
│   └── config/          # Configuration files
│       └── firebase.js
├── .env.example         # Environment variables template
├── FIREBASE_SETUP.md    # Firebase setup guide
└── README.md           # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Mock Data

The application includes realistic mock data for development and testing:
- Simulated sensor readings with daily/weekly patterns
- Rush hour pollution spikes
- Weekend vs weekday variations
- Seasonal trends

### Adding New Sensors

1. Navigate to the Sensors page
2. Click "Add Sensor"
3. Fill in sensor details:
   - Name and location
   - PurpleAir sensor ID (if using real sensors)
   - Calibration factor
   - Description

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment:
- Firebase configuration
- PurpleAir API credentials
- EmailJS service configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is copyrighted. All rights reserved.

## Support

For support and questions:
- Check the [Firebase Setup Guide](./FIREBASE_SETUP.md)
- Review the troubleshooting section in the Firebase setup
- Open an issue on GitHub

## Roadmap

- [ ] Real-time notifications for air quality alerts
- [ ] Mobile app development
- [ ] Advanced analytics and ML predictions
- [ ] Integration with more sensor networks
- [ ] Weather data correlation
- [ ] Public API for data access

---

**Lavendair** - Making air quality data accessible and actionable for everyone.
