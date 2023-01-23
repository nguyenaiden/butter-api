## Butter Backend Take home
Steps:
- Run `yarn install`
- To start the local dev server run `yarn dev`
Notes: I've chosen to use nextJS as the backend framework along with Railway as a hosted MySQL solution.
Please refer to the `dbschema.sql` file for the database schema. Note: I have manually populated the `users` table with a few sample entries
Sample userids: 
```
291ad09f-978d-11ed-8d21-0242ac11009d
297becb7-978d-11ed-8d21-0242ac11009d
29c01b28-978d-11ed-8d21-0242ac11009d
29fcea48-978d-11ed-8d21-0242ac11009d
2a398b23-978d-11ed-8d21-0242ac11009d
a8b32c90-96d3-11ed-8d21-0242ac11009d
```

MySQL DB access: `mysql -hcontainers-us-west-58.railway.app -uroot -pLW6kSO0bQTRgXKn8FKiS --port 5490 --protocol=TCP railway` 
Notes: This gives you ssh access into the deployed MySQL DB. 

The available API routes are as follow:
- Ping: `/api/ping`
    - This route run process.uptime() to get the status of the server
    - Run a sample query against the DB to ensure connection is intact
    - Return the server date
    Sample request: `curl localhost:3000/api/ping`
- Loads: `/api/v1/load`
    - This route only accepts PUT method. Any other methods will result in a status 403 with an error message
    - This will load the user account with the credit amount provided
    Sample request:
    `curl -X PUT localhost:3000/api/v1/load -H 'Content-Type: application/json' -d '{ "userId":"291ad09f-978d-11ed-8d21-0242ac11009d", "transactionAmount": { "amount": 30, "currency": "USD" }}'` 
- Authorization: `/api/v1/authorization`
    - This route only accepts PUT method. Any other methods will result in a status 403 with an error message
    - This will verify whether or not a user has enough balance for debit operations. Will reject requests with a `Declined` status if user does not meet the balance requirements.
    Sample request:
    `curl -X PUT localhost:3000/api/v1/authorization -H 'Content-Type: application/json' -d '{ "userId":"291ad09f-978d-11ed-8d21-0242ac11009d", "transactionAmount": { "amount": 48, "currency": "USD" }}'`

Event Sourcing pattern applied:
- On every load/authorize, the balance is calculated by going through all of the records in the `events` table that has the `Approved` status, and update the balance field in the `users` table accordingly. This action is done through a MySQL trigger (Refer to the `dbschema.sql` file). This operation is done within a transaction, so that every request is an all-or-nothing operation to prevent fragmented/incorrect data updates.
