### Readme is a WIP

## Q-wallet (or some other random name actually)

A sample (really lite) fintech wallet. Built this project to play around with some concepts like TDD, Inversion of control and some other design patterns.

Will be splitting this readme into two sections by assumed reason for being here.

-   If you are reading this cos you are looking to use this API with a client service(mobile/front end) go here ->
-   If you are just looking around. Please remember to give a star if you think it's worth it. Start here ->

Some basic folder structure

```
-- config (project wide configurations)
-- tests (all tests are here)
-- src
---- controllers ( web controllers - they decide what happens with api requests )
---- services ( core logic )
---- repository ( Data access layer (or sort of). Used typeorm's custom repositories )
---- migrations ( database migrations )
```

Thinking of spinning this up?

1. Clone the repo
2. Install dependencies
3. Run database migrations
    - make sure you have a database ready (locally or remotely)
    - create a .env file and fill it with the variables mentioned in env.sample
    - run migration command `npm run typeorm -- migration:run`
4. Start server or dev server with `npm run start` or `npm run start:dev`

API Documentation
Documentation is still a WIP and can be found here: https://documenter.getpostman.com/view/11384363/Uz5GpGGp
