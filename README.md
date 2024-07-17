# BTIX Protocol Demo

## Overview

The BTIX Protocol Demo is a Node.js application that demonstrates the integration with Sympla and Protocol APIs using node-fetch for HTTP requests.

## Prerequisites

Before you begin, ensure you have the following installed on your local development environment:

- Node.js (v14.x or higher)
- npm (Node Package Manager)
- Git (optional, for cloning the repository)

## Installation

1. Clone the repository from GitHub:

```bash
git clone https://github.com/seu-usuario/btix-protocol-demo.git
```

_Alternatively, download the ZIP file and extract it._

2. Navigate into the project directory:

```bash
cd btix-protocol-demo
```

3. Install dependencies using npm:

```bash
npm install
```

## Configuration

1. Create a .env file in the root of the project:

```plaintext
SYMPLA_API_URL=https://api.sympla.com.br
SYMPLA_API_KEY=your_sympla_api_key_here

PROTOCOL_API_URL=https://api.protocol.com.br
PROTOCOL_API_KEY=your_protocol_api_key_here
```

Replace your_sympla_api_key_here and your_protocol_api_key_here with your actual API keys obtained from Sympla and Protocol.

2. Save and close the .env file. Ensure it is not committed to version control for security reasons by adding it to your .gitignore file:

```bash
.env
```

## Usage

To run the BTIX Protocol Demo, follow these steps:

1.Start the application:

```bash
node src/index.js
```

2. The application will fetch events from Sympla, check for new events using the Protocol API, and simulate ticket creation.

3. View the output in the console to see the results of the API calls.

## Troubleshooting

- Environment Variables: Double-check that your .env file is correctly configured with valid API URLs and keys.
- Dependencies: Ensure all dependencies are installed by running npm install in the project root.

## Contributing

Contributions are welcome! If you find any issues or would like to suggest improvements, please fork the repository and create a pull request.

# License

This project is licensed under the [MIT License](LICENSE) - see the [License](LICENSE) file for details.
