<div align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
  <h1>StormGate Client-Server</h1>
  <p>
    A secure and scalable authentication system built with NestJS, featuring JWT authentication, OTP verification, and password reset functionality.
  </p>
  
  <!-- Badges -->
  <p align="center">
    <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank">
      <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NestJS Version" />
    </a>
    <a href="https://github.com/thathsarabandara/stormgate-client-server/blob/main/LICENSE" target="_blank">
      <img src="https://img.shields.io/github/license/thathsarabandara/stormgate-client-server" alt="License" />
    </a>
    <a href="https://nodejs.org/" target="_blank">
      <img src="https://img.shields.io/node/v/@nestjs/core" alt="Node.js Version" />
    </a>
    <a href="https://discord.gg/G7Qnnhy" target="_blank">
      <img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" alt="Discord" />
    </a>
  </p>
</div>

## ✨ Features

- 🔐 JWT-based authentication
- 📱 OTP verification for secure logins
- 🔄 Password reset functionality
- 🛡️ Role-based access control (RBAC)
- 📝 User profile management
- 🧪 Comprehensive test coverage
- 🚀 Built with NestJS for scalability

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or yarn
- PostgreSQL (or your preferred database)
- Redis (for caching and rate limiting)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thathsarabandara/stormgate-client-server.git
   cd stormgate-client-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Run database migrations:
   ```bash
   npm run typeorm migration:run
   ```

5. Start the development server:
   ```bash
   # development
   npm run start:dev

   # watch mode
   npm run start:dev

   # production mode
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:3000/api`
- JSON API Spec: `http://localhost:3000/api-json`

## 🏗 Project Structure

```
src/
├── auth/               # Authentication module
│   ├── dto/           # Data transfer objects
│   ├── guards/        # Authentication guards
│   └── strategies/    # Passport strategies
├── users/             # Users module
│   ├── entities/      # TypeORM entities
│   └── dto/           # User DTOs
├── app.module.ts      # Root application module
└── main.ts            # Application entry file
```

## 📝 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/request-password-reset` - Request password reset
- `POST /auth/reset-password` - Reset password

### Users

- `GET /users/me` - Get current user profile (protected)
- `PATCH /users/me` - Update user profile (protected)

## 🧪 Testing

```bash
# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🛡 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [Passport](https://www.passportjs.org/) - Authentication middleware for Node.js
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).