import * as express from 'express';
import { DdfCsvReader } from './ddfcsv-reader';
import { DiagnosticManager, DiagnosticAggregator } from './diagnostics/diagnostic-manager';

class WaffleServer {
  private diag: DiagnosticManager;

  constructor(parentDiagnostic: DiagnosticManager) {
    this.diag = new DiagnosticManager('waffleserver', parentDiagnostic.instance, '1.0.0');
    this.diag.addOutputTo(parentDiagnostic);
  }

  async processQuery(query) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.diag.info('processQuery', 'start query processing');

        try {
          const ddfCsvReader = new DdfCsvReader(this.diag);
          const data = ddfCsvReader.read(query);

          this.diag.info('processQuery', 'got result');

          resolve(data);
        } catch (e) {
          this.diag.error('processQuery', e.message);

          reject({ error: e.message });
        }
      }, query.delay || 0);
    });
  }
}

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  // console.log(req.query.isDiagnostics);
  const diag: DiagnosticAggregator = new DiagnosticAggregator('waffle server', req.query.queryId, '3.0.0');

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Content-Type', 'text/plain');

  diag.info('get /', 'start');

  const waffleServer = new WaffleServer(diag);

  diag.info('get /', 'ws instance created');

  const query: any = { select: { all: true } };

  query.delay = Number(req.query.delay);
  query.hasError = req.query.hasError;
  query.hasWarning = req.query.hasWarning;

  try {
    const result: any = await waffleServer.processQuery(query);

    // if (req.diag) {
    result._diagnostic = diag.content;
    // }

    const jsonResult = JSON.stringify(result, null, 2);

    diag.info('get /', 'got result');

    res.write(jsonResult);
  } catch (e) {
    res.write(e);
  } finally {
    res.end();
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
