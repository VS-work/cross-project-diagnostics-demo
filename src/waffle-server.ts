import * as express from 'express';
import { DdfCsvReader } from './ddfcsv-reader';
import { DiagnosticManager, createDiagnosticManagerOn, EndpointDiagnosticManager } from './diagnostics/diagnostic-manager';

class WaffleServer {
  private diag: DiagnosticManager;

  constructor(parentDiagnostic: DiagnosticManager) {
    this.diag = createDiagnosticManagerOn('waffleserver', '1.0.0').basedOn(parentDiagnostic);
  }

  async processQuery(query) {
    const { debug, error } = this.diag.prepareDiagnosticFor('processQuery');

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        debug('start query processing');

        try {
          const ddfCsvReader = new DdfCsvReader(this.diag);
          const data = ddfCsvReader.read(query);

          debug('got result');

          resolve(data);
        } catch (e) {
          error(e.message);

          reject({ error: e.message });
        }
      }, query.delay || 0);
    });
  }
}

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const diag: DiagnosticManager = createDiagnosticManagerOn('waffleserver routes', '3.0.0').forRequest(req.query.requestId);
  const { debug, fatal } = diag.prepareDiagnosticFor('get /');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/plain');

  debug('start');

  const waffleServer = new WaffleServer(diag);

  debug('ws instance created');

  const query: any = { select: { all: true } };

  query.delay = Number(req.query.delay);
  query.level = req.query.level;
  query.emulateError = req.query.emulateError === 'true';
  query.emulateWarning = req.query.emulateWarning === 'true';

  try {
    if (req.query.emulateFatal === 'true') {
      throw Error('unexpected WS issue!');
    }

    const result: any = await waffleServer.processQuery(query);
    debug('got result');

    result._diagnostic = (<EndpointDiagnosticManager>diag).content;
    const jsonResult = JSON.stringify(result, null, 2);
    res.write(jsonResult);
  } catch (e) {
    fatal('trouble with route', e);

    const jsonResult = JSON.stringify({ error: e.toString(), _diagnostic: (<EndpointDiagnosticManager>diag).content }, null, 2);
    res.write(jsonResult);
  } finally {
    res.end();
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
