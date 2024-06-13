# Email Service Core

## Overview

Email Service Core is a robust and scalable email service designed to handle fetching email from Gmail and Outlook, syncing into Elastisearch database within applications. This project includes configuration, deployment scripts, and source code to set up the email service.

## Features

- Fetcing emails through various providers
- Manage email into Elastisearch
- Scalable architecture using Docker
- Configurable via environment variables

## Table of Contents

- Installation
- Usage
- Configuration
- Development
- Testing
- Deployment
- Contributing
- License

### Installation

#### Prerequisites

- Node.js v18 or higher
- Docker
- Docker Compose

#### Steps

1. Clone the repository:

` git clone https://github.com/nehaverma1997/email-service-core.git`

`cd email-service-core`

2. Install dependencies:

` npm install `

### Usage

#### Running Locally

To run the service locally, use:

` npm start `

#### Running with Docker

To run the service using Docker, use:

` docker-compose up `

### Configuration

Configuration is managed through environment variables. Create a .env file in the project root and configure the necessary variables:

> OUTLOOK_CLIENT_ID

> OUTLOOK_CLIENT_SECRET

> OUTLOOK_REDIRECT_URI

> GOOGLE_CLIENT_ID

> GOOGLE_CLIENT_SECRET

> GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

> ELASTICSEARCH_HOST

> ELASTICSEARCH_USERNAME

> ELASTICSEARCH_PASSWORD

> ELASTICSEARCH_CLOUD_ID

> SESSION_SECRET



### Development

Source files are located in the src directory. The project follows a standard structure with the main application entry point in src/app.js.

#### Scripts

- `npm start`: Start the application

### Testing

Tests are located in the test directory. To run tests, use:

` npm test `

### Deployment

For deployment, Docker is used. Ensure that you have Docker installed and use the following command to deploy:

` docker-compose up --build `

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

#### Steps

1. Fork the repository
2. Create a new branch (git checkout -b feature-branch)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature-branch)
5. Open a pull request

### License
This project is licensed under the ISC License.