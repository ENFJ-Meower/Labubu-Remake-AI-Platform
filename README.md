# 🚀 Labubu Remake AI Platform

<div align="center">

![Labubu AI Platform](https://img.shields.io/badge/Labubu-AI%20Platform-blue?style=for-the-badge&logo=robot)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

*Your Ultimate AI Creation and Collaboration Platform*

[![User Guide](https://img.shields.io/badge/User%20Guide-Read%20Now-orange?style=for-the-badge&logo=book)](USER_GUIDE.md)
[![Get Started](https://img.shields.io/badge/Get%20Started-Now-green?style=for-the-badge&logo=rocket)](https://labubu-ai-platform.com)

</div>

---

## 📖 Table of Contents

- [🌟 Project Overview](#-project-overview)
- [🎯 Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Development Setup](#-development-setup)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 Documentation](#-documentation)
- [📞 Support](#-support)

---

## 🌟 Project Overview

**Labubu Remake AI Platform** is a comprehensive AI-powered creation and collaboration ecosystem built with modern microservices architecture. The platform enables users to create, deploy, and monetize AI agents through an intuitive visual workflow editor.

### 🎨 Core Capabilities

- **🤖 AI Agent Studio** - Visual drag-and-drop workflow editor for creating AI agents
- **🎨 Multi-Modal AI Integration** - LLM, STT, TTS, Image Generation, and more
- **👥 Creative Community** - Social platform for creators to share and collaborate
- **🛒 Digital Marketplace** - Buy, sell, and trade AI agents and digital assets
- **🚀 Enterprise Ready** - Scalable microservices architecture with Kubernetes

---

## 🎯 Key Features

### 🧠 AI Agent Studio
- **Visual Workflow Editor** - Intuitive drag-and-drop interface
- **Node-Based Design** - Connect AI services with visual nodes
- **Real-time Testing** - Test workflows with sample data
- **Template Library** - Pre-built templates for common use cases
- **Deployment Tools** - One-click deployment to production

### 🤖 AI Services Integration
- **LLM (Large Language Models)** - Text generation and processing
- **STT (Speech-to-Text)** - Audio transcription services
- **TTS (Text-to-Speech)** - Speech synthesis capabilities
- **Image Processing** - Text-to-Image and Image-to-Text conversion
- **Workflow Engine** - Custom DAG execution engine

### 👥 Community Features
- **Portfolio Showcase** - Display AI creations and projects
- **Collaboration Tools** - Team-based workflow development
- **Creative Challenges** - Themed competitions and contests
- **Learning Resources** - Tutorials and best practices

### 🛒 Marketplace
- **AI Agent Store** - Buy and sell custom AI agents
- **Template Marketplace** - Professional workflow templates
- **Digital Asset Trading** - Art, models, and tools
- **Commission System** - Custom project requests

---

## 🏗️ System Architecture

### 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Vue.js    │  │   React     │  │   Mobile    │            │
│  │   Frontend  │  │   Admin     │  │     App     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Nginx     │  │   JWT Auth  │  │   Rate      │            │
│  │   Gateway   │  │   Service   │  │   Limiting  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    Microservices Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Auth      │  │   User      │  │   Workflow  │            │
│  │  Service    │  │  Service    │  │   Engine    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    LLM      │  │    STT      │  │    TTS      │            │
│  │  Service    │  │  Service    │  │  Service    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Image     │  │  Text2Pic   │  │  Pic2Text   │            │
│  │  Service    │  │  Service    │  │  Service    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ PostgreSQL  │  │    Redis    │  │   MinIO     │            │
│  │  Database   │  │    Cache    │  │   Storage   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### 🔧 Technology Stack

#### Frontend
- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite for fast development
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **State Management**: Vue 3 reactive system
- **Internationalization**: Vue I18n

#### Backend Microservices
- **API Gateway**: Nginx with JWT authentication
- **Auth Service**: Java Spring Boot
- **AI Services**: Go microservices
- **Workflow Engine**: Custom DAG execution engine
- **Database**: PostgreSQL for persistent data
- **Cache**: Redis for session and data caching

#### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Service Mesh**: Istio (optional)
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

---

## 🚀 Quick Start

### Prerequisites

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Kubernetes** 1.24+ (for production)
- **Node.js** 16+ (for development)
- **Java** 11+ (for backend development)
- **Go** 1.19+ (for microservices)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/labubu-ai-platform.git
cd labubu-ai-platform
```

### 2. Environment Setup

```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Edit configuration files
nano .env
nano backend/.env
```

### 3. Start Development Environment

```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start individual services
docker-compose up -d postgres redis
docker-compose up -d backend
docker-compose up -d frontend
```

### 4. Access the Platform

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8080
- **Admin Dashboard**: http://localhost:3002
- **API Documentation**: http://localhost:8080/swagger-ui

---

## 📁 Project Structure

```
labubu-ai-platform/
├── frontend/                    # Vue.js frontend application
│   ├── src/
│   │   ├── components/         # Vue components
│   │   │   ├── AIAgent.vue    # AI workflow editor
│   │   │   ├── Home.vue       # Landing page
│   │   │   ├── Login.vue      # Authentication
│   │   │   └── ...
│   │   ├── assets/            # Static assets
│   │   ├── config/            # Configuration files
│   │   ├── i18n/              # Internationalization
│   │   └── utils/             # Utility functions
│   ├── public/                # Public assets
│   ├── package.json           # Dependencies
│   └── vite.config.js         # Build configuration
│
├── backend/                    # Backend microservices
│   ├── login/                 # Authentication service
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── login/
│   │   │           ├── controller/
│   │   │           ├── service/
│   │   │           ├── entity/
│   │   │           └── ...
│   │   └── resources/
│   │       └── application.yml
│   │
│   ├── microservice-LLM/      # Large Language Model service
│   ├── microservice-STT/      # Speech-to-Text service
│   ├── microservice-TTS/      # Text-to-Speech service
│   ├── microservice-text2pic/ # Text-to-Image service
│   ├── microservice-pic2text/ # Image-to-Text service
│   ├── scheduler/             # Workflow scheduler
│   ├── ingress/               # API gateway
│   └── dependency/            # Service dependencies
│
├── kubernetes/                 # Kubernetes deployment files
│   ├── frontend/
│   ├── backend/
│   ├── database/
│   └── monitoring/
│
├── docs/                      # Documentation
│   ├── api/                   # API documentation
│   ├── deployment/            # Deployment guides
│   └── development/           # Development guides
│
├── scripts/                   # Utility scripts
├── tests/                     # Test suites
├── docker-compose.yml         # Development environment
├── .env.example              # Environment variables template
└── README.md                 # This file
```

---

## 🔧 Development Setup

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Backend Development

```bash
cd backend/login/main

# Install dependencies (if using Maven)
mvn install

# Run the application
mvn spring-boot:run

# Or using Gradle
./gradlew bootRun
```

### Microservices Development

```bash
# LLM Service
cd backend/microservice-LLM
go mod tidy
go run main.go

# STT Service
cd backend/microservice-STT
go mod tidy
go run main.go

# TTS Service
cd backend/microservice-TTS
go mod tidy
go run main.go
```

### Database Setup

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Run migrations
cd backend/login/main
mvn flyway:migrate

# Or manually
psql -h localhost -U labubu -d labubu_platform
```

---

## 📦 Deployment

### Docker Deployment

```bash
# Build all images
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale llm-service=3
```

### Kubernetes Deployment

```bash
# Apply namespace
kubectl apply -f kubernetes/namespace.yaml

# Deploy database
kubectl apply -f kubernetes/database/

# Deploy backend services
kubectl apply -f kubernetes/backend/

# Deploy frontend
kubectl apply -f kubernetes/frontend/

# Deploy ingress
kubectl apply -f kubernetes/ingress/
```

### Production Configuration

```bash
# Set production environment
export NODE_ENV=production
export KUBECONFIG=/path/to/production/kubeconfig

# Deploy with Helm (if using Helm charts)
helm install labubu-platform ./helm-charts/labubu-platform
```

---

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

### Development Workflow

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/labubu-ai-platform.git
   cd labubu-ai-platform
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow coding standards
   - Add tests for new features
   - Update documentation

4. **Commit Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Standards

- **Frontend**: ESLint + Prettier
- **Backend**: Go fmt, Java Google Style
- **Documentation**: Markdown with consistent formatting
- **Tests**: Minimum 80% coverage

### Commit Message Format

```
type(scope): description

feat(auth): add OAuth2 authentication
fix(api): resolve CORS issue
docs(readme): update installation guide
style(frontend): format code with prettier
refactor(backend): restructure service layer
test(workflow): add unit tests for workflow engine
```

---

## 📄 Documentation

### 📚 Documentation Structure

- **[User Guide](USER_GUIDE.md)** - Complete user documentation
- **[API Reference](docs/api/)** - REST API documentation
- **[Development Guide](docs/development/)** - Developer documentation
- **[Deployment Guide](docs/deployment/)** - Deployment instructions
- **[Architecture Guide](docs/architecture/)** - System architecture details

### 🔍 Quick Links

- [Getting Started](USER_GUIDE.md#-quick-start)
- [API Documentation](docs/api/README.md)
- [Development Setup](docs/development/setup.md)
- [Deployment Guide](docs/deployment/kubernetes.md)
- [Troubleshooting](docs/troubleshooting.md)

---

## 📞 Support

### 🆘 Getting Help

- **📖 Documentation**: [User Guide](USER_GUIDE.md)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/your-org/labubu-ai-platform/issues)
- **💬 Community**: [Discord Server](https://discord.gg/labubu-ai)
- **📧 Email**: support@labubu-ai-platform.com

### 🔗 Useful Links

- **🌐 Website**: [https://labubu-ai-platform.com](https://labubu-ai-platform.com)
- **📚 Documentation**: [https://docs.labubu-ai-platform.com](https://docs.labubu-ai-platform.com)
- **🐙 GitHub**: [https://github.com/your-org/labubu-ai-platform](https://github.com/your-org/labubu-ai-platform)
- **📖 Wiki**: [https://github.com/your-org/labubu-ai-platform/wiki](https://github.com/your-org/labubu-ai-platform/wiki)

### 📊 Project Status

![GitHub release (latest by date)](https://img.shields.io/github/v/release/your-org/labubu-ai-platform)
![GitHub issues](https://img.shields.io/github/issues/your-org/labubu-ai-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-org/labubu-ai-platform)
![GitHub contributors](https://img.shields.io/github/contributors/your-org/labubu-ai-platform)
![GitHub stars](https://img.shields.io/github/stars/your-org/labubu-ai-platform)

---

<div align="center">

## 🚀 Ready to Get Started?

*Join thousands of creators who are already building amazing AI-powered applications*

[![Get Started Now](https://img.shields.io/badge/Get%20Started%20Now-Start%20Building-orange?style=for-the-badge&logo=rocket)](https://labubu-ai-platform.com)
[![Read User Guide](https://img.shields.io/badge/Read%20User%20Guide-Learn%20More-blue?style=for-the-badge&logo=book)](USER_GUIDE.md)

---

*© 2024 Labubu AI Platform. All rights reserved.*

*Built with ❤️ for the AI community*

</div> 