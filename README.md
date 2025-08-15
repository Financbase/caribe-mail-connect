# Caribe Mail Connect

A comprehensive mail and package management system designed for the Caribbean region, with a focus on Puerto Rico's unique postal and logistics needs.

## 🚀 Features

### Core Functionality
- **📦 Package Tracking**: Real-time tracking of packages and mail
- **📮 Virtual Mailbox**: Digital mail management and forwarding
- **👥 Customer Portal**: Self-service portal for customers
- **📱 Mobile App**: iOS and Android applications
- **🏢 Multi-location Support**: Manage multiple service locations
- **💳 Billing & Invoicing**: Automated billing and payment processing

### Advanced Features
- **🗺️ Route Optimization**: Efficient delivery route planning
- **📊 Analytics & Reporting**: Comprehensive business intelligence
- **🔌 Integration APIs**: Connect with external services
- **✅ Compliance Tools**: USPS and local regulation compliance
- **🔄 Backup & Recovery**: Automated data protection
- **📈 Performance Monitoring**: Real-time system monitoring

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **UI Framework**: Tailwind CSS + shadcn/ui + Caribbean Design System
- **Testing**: Vitest + Playwright + Storybook
- **Deployment**: Cloudflare Pages
- **Analytics**: Privacy-focused analytics with GDPR compliance

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Financbase/caribe-mail-connect.git
cd caribe-mail-connect

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```
### Environment Setup

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_NOTIFICATIONS=true
VITE_FEATURE_VIRTUAL_MAILBOX=true
VITE_FEATURE_CUSTOMER_PORTAL=true

# Optional: Monitoring (Sentry)
VITE_SENTRY_DSN=
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier

# Storybook
npm run storybook    # Start Storybook
npm run build-storybook # Build Storybook
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── compound/       # Complex compound components
│   ├── feedback/       # User feedback components
│   └── a11y/           # Accessibility components
├── pages/              # Application pages
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # Global styles
└── tests/              # Test files

docs/                   # Documentation
supabase/              # Database schema and functions
scripts/               # Build and deployment scripts
```

## 📚 Documentation

- [Development Guide](docs/DEVELOPMENT_GUIDE.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Component Documentation](docs/COMPONENT_DOCUMENTATION.md)
- [Security Policy](SECURITY.md)

## 🚀 Deployment

The application is deployed on Cloudflare Pages with automatic deployments from the main branch.

```bash
# Build for production
npm run build

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm run test`)
6. Run linting (`npm run lint`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## 🔒 Security

Security is a top priority. Please see our [Security Policy](SECURITY.md) for reporting vulnerabilities and security practices.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/Financbase/caribe-mail-connect/issues)

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/) and custom Caribbean Design System
- Backend powered by [Supabase](https://supabase.com/)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)

---

**Caribe Mail Connect** - Connecting the Caribbean through efficient mail and package management. 🌴📦
