### Readme is a WIP

## Q-wallet (or some other random name actually)

A sample (really lite) fintech wallet. Built this project to play around with some concepts like TDD, Inversion of control and some other design patterns. Also to solve some problems that might come up while building a fintech wallet -- discussed some of those here

Will be splitting this readme into two sections by assumed reason for being here.

-   If you are reading this cos you are looking to use this API with a client service(mobile/front end) go here [->](#some-basic-folder-structure)
-   If you are just looking around. Please remember to give a star if you think it's worth it. Start here [->](#api-documentation)

#### Some basic folder structure

```
-- config (project wide configurations)
-- tests (all tests are here)
-- src
---- controllers ( web controllers - they decide what happens with api requests )
---- services ( core logic )
---- repository ( Data access layer (or sort of). Used typeorm's custom repositories )
---- migrations ( database migrations )
```

#### Thinking of spinning this up?

1. Clone the repo
2. Install dependencies
3. Run database migrations
    - make sure you have a database ready (locally or remotely)
    - create a .env file and fill it with the variables mentioned in env.sample
    - run migration command `npm run typeorm -- migration:run`
4. Start server or dev server with `npm run start` or `npm run start:dev`

#### Some things I had to (consider/think about) -- some interesting

1. Atomicity in some actions such as transfers; when making interwallet fund transfers, you do not want a situation where a user is debited but the other user is not credited probably because of some error while attempting to credit. Used database transactions to solve this problem i.e if there is failure while perfoming any db query in the transaction, perform a rollback of all queries already performed in the transaction.

2. Concurrency problems while performing account balance actions; say two requests are made at the same time to credit an account, we need to perform two steps to credit the account: 1. fetch the current balance and 2. update the balance with the credit amount. Remeber we said two requests are trying to do this at the same time, so imaging this:
   i. request 1 get the current balance which is 100
   ii. request 2 also gets the current balance which is 100
   iii. request 1 then updates the balance by adding 100 to give 200
   iV. request 2 too, using the previously gotten balance updates the balance to 200 😱

Now we have a problem since, two requests to credit an account which had 100 with 100 should leave the account with 300.
This is solved using a persimistic lock in the database. This tells the database, at the point of fethcing the account balance to not allow any requests on that row until the transaction is committed

3. Where should caching happen? Data access layer or Service layer? I have not implemented this yet so I'll leave the question without my answer
4. Where do tests go? In the src files right next to the modules being tested? This made sense to me as I wanted to be able to move between writing tests and writing the actual logic so I did this a lot at the beginning of the project. Eventually I chose to stick with moving all tests to a tests folder as I noticed the earlier approach had me repeating code quite often.

5. Switching payment service providers without changing my payment service interface. Used the strategy technique here mostly, and some kind of factory for the strategies that ensures a test strategy is used when testing. You can check this out in src/services/payment.service.ts and src/services/payment_strategies.

#### API Documentation

Documentation is still a WIP and can be found here: https://documenter.getpostman.com/view/11384363/Uz5GpGGp
