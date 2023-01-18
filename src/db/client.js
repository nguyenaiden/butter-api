import knex from "knex";
import { secrets } from "../../env.js";

const client = (function () {
  const c = knex({
    client: "mysql2",
    connection: { ...secrets.mysql },
  });

  return c;
})();

export default client;
