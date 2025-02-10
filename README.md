# CI/CD Notes Application
The application is hosted on [Render](https://render.com/) cloud. 
The on production, application uses Postgres database hosted on [Neon](https://neon.tech/).

See live at [CICD Notes](https://cicd-notes.onrender.com/)

## CI/CD

See the Github Actions [workflow](.github/workflows/pipeline.yml).

The workflow has only a single job which consists of four steps: three test jobs and a final deploy job.
The test jobs are executed on push and merge to main branch, while the deploy job is executed only on merge to main

### Tests
These jobs are executed in parallel.
Each job will lint and test different parts of the code. 

#### Client
Installs client dependencies, lints the code and finally runs the client-only tests.

#### Server
This step is similiar to client step, but only on the server side. 
The job has an additional service: postgres database in a container. 
The connection string to this database is given as an environment variable.

#### End-to-End
End-to-end tests require the server and the client to be running. 
This job also uses the postgres database container service.

### Deploy
This final job waits for the test jobs to complete. 
If one of the test jobs fails, this job is not executed.

#### Render deploy hook
Triggers deploy to render with a single HTTP-request. 
The deploy url is a Github secret. 
On the Render side, the new version of the app is brought up only if the health check passes. 
The health test is route on the server [side](./server/src/router/index.js), which checks the database connectivity.

## Used technology
<ul>
  <li>Containers</li>
  <li>React</li>
  <li>Node</li>
  <li>Express</li>
  <li>Postgres</li>
  <li>
    Testing
    <ul>
      <li><a href="https://jestjs.io/">Jest</a></li>
      <li><a href="https://www.npmjs.com/package/supertest">SuperTest</a></li>
      <li><a href="https://www.cypress.io/">Cypress</a></li>
      <li><a href="https://testing-library.com/docs/react-testing-library/intro/">React testing library</a></li>
    </ul>
  </li>
</ul>
