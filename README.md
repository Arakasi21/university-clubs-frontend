<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://astanait.edu.kz/">
    <img src="https://static.tildacdn.pro/tild3764-6633-4663-b138-303730646233/aitu-logo__2.png" alt="Logo" height="80">
  </a>
  <h3 align="center">AITU UCMS Frontend</h3>
  <p align="center">
    This is  the frontend part of the University Clubs Management System (UCMS) at AITU.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#backend-microservices">Backend Microservices</a></li>
    <li><a href="#protofiles">Protofiles</a></li>
    <li><a href="#technologies-used">Technologies Used</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation">Installation</a></li>
      <li><a href="#configuration">Configuration</a></li>
    </ul>
    <li><a href="#running-the-service">Running the Service</a></li>
    <li><a href="#deploy-on-vercel">Deploy on Vercel</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

This is the frontend part of the University Clubs Management System (UCMS) at AITU. The UCMS is a system that allows students to create and join clubs, create and attend events, and communicate with other students. The UCMS is a distributed system that consists of several microservices. This repository contains the frontend part of the UCMS.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Backend MICROSERVICES -->
## Backend Microservices

* [API Gateway][api-gateway-url]
* [User Service][user-service-url]
* [Club Service][club-service-url]
* [Posts Service][posts-service-url]
* [Comments Service][comments-service-url]
* [Notification Service][notification-service-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- TECHNOLOGIES USED -->
## Technologies Used

* [![Next.js][nextjs-shield]][nextjs-url]
* [![React][react-shield]][react-url]
* [![TypeScript][typescript-shield]][typescript-url]
* [![Zustand][zustand-shield]][zustand-url]
* [![Shadcn][shadcn-shield]][shadcn-url]
* [![Tailwind][tailwind-shield]][tailwind-url]
* [![Vercel][vercel-shield]][vercel-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* npm or yarn
* Node.js
* backend services running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Arakasi21/university-clubs-frontend.git
   cd university-clubs-frontend
   npm install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Configuration

The configuration is done using environment variables. The following environment variables are required:

Create .env file:
```bash
touch .env
```

#### Example Configuration Snippet

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- RUNNING THE SERVICE -->
## Running the Service

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[aitu-url]: https://astanait.edu.kz/
[aitu-ucms-url]: https://www.ucms.space/

<!-- Other Microservices -->
[api-gateway-url]: https://github.com/ARUMANDESU/university-clubs-backend
[user-service-url]: https://github.com/ARUMANDESU/uniclubs-user-service
[club-service-url]: https://github.com/ARUMANDESU/uniclubs-club-service
[posts-service-url]: https://github.com/ARUMANDESU/uniclubs-posts-service
[comments-service-url]: https://github.com/ARUMANDESU/uniclubs-comments-service
[notification-service-url]: https://github.com/ARUMANDESU/uniclubs-notification-service
[protofiles-url]: https://github.com/ARUMANDESU/uniclubs-protos

[nextjs-shield]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white
[nextjs-url]: https://nextjs.org/

[react-shield]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white
[react-url]: https://reactjs.org/

[typescript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/

[zustand-shield]: https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[zustand-url]: https://zustand.surge.sh/

[shadcn-shield]: https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white
[shadcn-url]: https://shadcn.com/

[tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com/

[vercel-shield]:   https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[vercel-url]: https://vercel.com/

