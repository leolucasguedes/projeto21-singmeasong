<p align="center">
  <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg"
    width="180px" height="180px" >
</p>
<h1 align="center">
  SingMeASong
</h1>
<div align="center">

  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/React-316192?style=for-the-badge&logo=react&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  
</div>

<br/>

# Description

SingMeASong simulates an API and Front for anonymous music recommendation. The more people like a recommendation, the more likely it is to be recommended to others.

</br>

## Features

-   Post a music
-   Vote musics
-   Get random and top rated music
-   Test the application

</br>

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

(BACK)

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`PORT = number #recommended:5000`

(FRONT)

`REACT_APP_API_BASE_URL = http://`

</br>

#

## Tests

- All tests:
```bash
  npm run test
```
- Cypress tests:
```bash
  npm run dev:test
```
- Integrations tests:
```bash
  npm run test:int
```
- Unit tests:
```bash
  npm run test:unit
```

#

## Run Locally

Clone the project

```bash
  git clone https://github.com/leolucasguedes/projeto21-singmeasong
```

Go to the project directory

```bash
  cd projeto21-singmeasong/
```

Install dependencies

```bash
  npm install
```

Create database

```bash
  npx prisma migrate reset
```

Start the server

```bash
  npm run start
```

</br>

## Lessons Learned

In this project I learned a lot about how to test an API and a front-end with Jest, Cypress and Supertest.

</br>

## Authors

-   [@leolucasguedes](https://www.github.com/leolucasguedes)

<br/>

#

<a  href="mailto:contato.leonardo.lucas0611@gmail.com" target="_blank"><img src="https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg"></a>