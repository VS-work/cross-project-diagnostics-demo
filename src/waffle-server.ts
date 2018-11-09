import * as express from 'express';
import { DdfCsvReader } from './ddfcsv-reader';

class WaffleServer {
  private logger;

  constructor() {
    // this.logger = createLogger('waffleserver:log', loggerObject);
  }

  processQuery(query) {
    const ddfCsvReader = new DdfCsvReader();
    const data = ddfCsvReader.read(query);

    // this.logger('got data ', data, ' in accordance with ', query);

    return data;
  }
}

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  const waffleServer = new WaffleServer();
  const query = { select: { all: true } };

  const result = JSON.stringify(waffleServer.processQuery(query), null, 2);

  res.write(`----------------------\nresult is ${result}`);
  res.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
