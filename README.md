# TechStudyFinder

**TechStudyFinder** is a progressive web application designed to help young people discover Informatics study programs that align with their **interests, hobbies, and personality**.

Many young people, especially **FINTA** (women, lesbian, inter, non-binary, trans, and agender individuals), never consider studying Informatics because they assume it’s only about programming or math. This project aims to change that by showing how diverse and creative IT can be and how it connects to things people already care about.

**Disclaimer:**
This application is not intended to provide professional career or psychological advice. It’s meant for general informational purposes only and shouldn’t replace guidance from qualified professionals.

---

## Project Overview

The app helps users explore how their personal interests can relate to Informatics and related study programs.
It’s meant to **inspire** and **guide**, not test technical skills. Both bachelor's and master's programmes are included in the application. The user may filter for their desired degree.

**Planned user flow:**

1. Users enter their interests, hobbies, or personal values.
2. The system suggests Informatics study programs that fit those inputs.

---

## Documentation

- [API Endpoint Documentation](docs/endpoints.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Continuous Integration](docs/continuous-integration.md)
- [Continuous Deployment](docs/continuous-deployment.md)
- [Server Setup (Production)](docs/server-setup.md)
- [License](LICENSE)
- [Question Documentation](docs/questions.md)
- [Database Schema](docs/database_schema.md)

---

## Getting Started

Run the application locally with the following steps:

1. **Install requirements**
   Run the following commands to ensure that you run the correct Node.js version.
   `nvm install 20`
   `nvm use 20`
2. **Clone the repository**
   ```bash
   git clone https://github.com/noadjamila/TechStudyFinder.git
   cd TechStudyFinder
   ```
3. **Install dependencies**
   ```bash
   # Install root dependencies (concurrently, husky, etc.)
   npm install
   # Install backend dependencies (Express, ts-node, etc.)
   npm install --workspace server
   # Install frontend dependencies (React, etc.)
   npm install --workspace client
   ```
4. **Start the frontend and backend**
   ```bash
   npm run dev
   ```

---

## Initialize the Database

To set up and populate the database, follow these steps:

1. **Configure your environment variables**
   Ensure your `.env` file contains the correct database connection details (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

2. **Store the XML files** with the data under `server/db/xml`.

3. **Initialize the database**
   Run the following command to create all necessary tables and populate them with your XML and RIASEC data:

```bash
cd server
npx ts-node db/scripts/init_data.ts
```

After completing these steps, the database will be fully initialized and ready for use.

**To update the data**, simply replace the XML files with new ones and run the `init_data.ts` script again. The table values will be overwritten with the new ones and the RIASEC values will be added again. If there are new areas of study in the data, you will receive a warning via the terminal that the table contains NULL values. You will then have to add the RIASEC values manually. See [here](docs/riasec-mapping.md) for an explanation of how to determine the RIASEC types.

## Tech Stack

**Frontend**: React (Progressive Web App)
For further documentation, see the [client README](client/README.md).

**Backend**: Node.js (REST API)

**Matching Logic**: To be defined (algorithm for mapping interests to programs)

> The project is currently in the **concept and prototyping phase**.
> The final architecture and algorithm will be determined as the system evolves.

---

## Automated maintenance

This project uses GitHub Dependabot to automatically keep dependencies up to date.
Dependabot regularly monitors the following areas:

- Node.js dependencies in the root directory
- Client (React): `/client`
- Server (Express/TS): `/server`
- GitHub Actions workflows

New versions automatically generate pull requests, which should be reviewed before merging.
The configuration is located in `.github/dependabot.yml`.

---

## Purpose

- Make Informatics more **approachable and inclusive**.
- Encourage **FINTA youth** to see themselves in IT fields.
- Combine **technology, psychology, and design** to support informed, confident study choices.

---

## Contributing

Contributions, ideas, and feedback are very welcome. Make sure to look at the Contributing Guidelines first!

---

## Contributors

A team of students at HTW Berlin.

Special thanks to Gesellschaft für Informatik e.V. (GI) for collaboration and feedback.

---

## License

This project is currently under the MIT license.
