# Lavendair - Developer Documentation

Internal development documentation for the Lavendair air quality monitoring platform. This React/Vite application provides real-time sensor data visualization and management capabilities.

## Architecture Overview

- **Frontend Framework**: React 19 with Vite build system
- **State Management**: React Context API for authentication, local state for components
- **Data Layer**: Mock data generation with PurpleAir API integration
- **Authentication**: Firebase Auth with development bypass
- **Styling**: Tailwind CSS with responsive design patterns
- **Charts**: Recharts library for data visualization
- **Routing**: React Router DOM with protected routes

## Development Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn package manager
- Git for version control
- Firebase project (for production auth)
- Code editor with ESLint support

### Local Development

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd lavendair
   npm install
   ```

2. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   
   **Development mode**: Use the dev bypass (no Firebase required)
   ```env
   # Development Login
   VITE_DEV_EMAIL=dev@lavendair.com
   VITE_DEV_PASSWORD=dev123
   ```
   
   **Production mode**: Configure Firebase
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=project-id
   # ... other Firebase config
   ```

3. **Start development server**
   ```bash
   npm run dev
   # Server runs on http://localhost:5173
   ```

### Development Workflow

- Use the "Dev" login button for quick access during development
- Mock data is generated automatically for all sensor readings
- Hot reload is enabled for all React components
- ESLint runs automatically on save

## Code Architecture

### Authentication System

- **AuthContext**: Centralized auth state management
- **Development Bypass**: Quick login without Firebase for development
- **Protected Routes**: Route guards in App.jsx
- **Firebase Integration**: Production authentication via Firebase Auth

### Data Management

- **Mock Data Generation**: Realistic sensor data with time-based patterns
- **PurpleAir Service**: API integration for real sensor data
- **State Management**: Local component state with React hooks
- **Data Patterns**: Rush hour spikes, weekend variations, seasonal trends

### Component Structure

#### Pages
- `Dashboard.jsx`: Main data visualization with Recharts
- `Sensors.jsx`: Sensor CRUD operations and individual data views
- `Settings.jsx`: Configuration management
- `Login.jsx`: Authentication interface
- `Exports.jsx`: Data export functionality

#### Components
- `Navbar.jsx`: Navigation with auth state
- `AdminPanel.jsx`: Administrative controls
- `Contact.jsx`: EmailJS integration

#### Services
- `purpleAirService.js`: External API integration
- `exportService.js`: Data export utilities

### Key Technical Features

- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Chart Visualization**: Recharts with custom styling
- **Date Handling**: date-fns for time manipulation
- **HTTP Client**: Axios with interceptors
- **Icon System**: Lucide React icons

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

## Development Guidelines

### Build Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Production build with optimization
- `npm run preview` - Test production build locally
- `npm run lint` - ESLint code quality checks

### Code Standards

- **React Patterns**: Functional components with hooks
- **State Management**: useState/useEffect for local state, Context for global
- **Styling**: Tailwind utility classes, responsive design patterns
- **File Organization**: Feature-based structure in src/
- **Naming**: PascalCase for components, camelCase for functions/variables

### Mock Data Implementation

```javascript
// generateMockData function creates realistic patterns
const generateMockData = (days, metric) => {
  // Time-based pollution patterns
  // Rush hour spikes (7-9 AM, 5-7 PM)
  // Weekend vs weekday variations
  // Seasonal baseline adjustments
};
```

### Adding New Features

1. **New Pages**: Add to `src/pages/` and update routing in `App.jsx`
2. **Components**: Create in `src/components/` with proper prop types
3. **Services**: Add API integrations to `src/services/`
4. **State**: Use Context for global state, local state for component-specific data

### Testing Approach

- Manual testing with mock data
- Development login bypass for quick iteration
- Responsive design testing across breakpoints
- Chart functionality with different data ranges

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run preview
```

### Environment Configuration

**Production Environment Variables:**
```env
# Firebase (Required for production auth)
VITE_FIREBASE_API_KEY=prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=prod-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prod-project-id

# Optional integrations
VITE_PURPLEAIR_API_KEY=api_key
VITE_EMAILJS_SERVICE_ID=service_id
```

### Deployment Options

1. **Firebase Hosting**
   ```bash
   firebase deploy
   ```

2. **Static Hosting** (Vercel, Netlify)
   - Build command: `npm run build`
   - Output directory: `dist`

## Contributing

### Development Workflow

1. **Setup development environment**
   ```bash
   git checkout -b feature/feature-name
   npm install
   npm run dev
   ```

2. **Code standards**
   - Follow existing component patterns
   - Use Tailwind for styling
   - Implement responsive design
   - Add proper error handling

3. **Testing checklist**
   - Test with mock data
   - Verify responsive design
   - Check authentication flows
   - Validate chart functionality

4. **Submit changes**
   ```bash
   git commit -m "feat: add new feature"
   git push origin feature/feature-name
   # Create pull request
   ```

## Technical Notes

### Known Issues

- Mock data generation can be CPU intensive for large date ranges
- Chart re-rendering may cause brief loading states
- Firebase auth state persistence requires page refresh in some cases

### Performance Considerations

- Recharts lazy loading for large datasets
- Debounced API calls in PurpleAir service
- Memoized components for chart rendering
- Tailwind CSS purging for smaller bundle size

## Development Roadmap

### Immediate (Current Sprint)
- [ ] Optimize chart rendering performance
- [ ] Add unit tests for core components
- [ ] Improve error boundary implementation

### Short Term
- [ ] WebSocket integration for real-time data
- [ ] Advanced data filtering and aggregation
- [ ] Component library documentation
- [ ] API rate limiting implementation

### Long Term
- [ ] PWA capabilities
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant architecture
- [ ] GraphQL API layer

## License

This project is copyrighted. All rights reserved.

---

**Internal Development Documentation** - Lavendair Platform
