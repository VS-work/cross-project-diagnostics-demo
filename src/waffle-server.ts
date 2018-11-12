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
      }, query.timeout || 0);
    });
  }
}

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const diag: DiagnosticAggregator = new DiagnosticAggregator('waffle server', '#Q001', '3.0.0');

  res.setHeader('Content-Type', 'text/plain');

  diag.info('get /', 'start');

  const waffleServer = new WaffleServer(diag);

  diag.info('get /', 'ws instance created');

  const query = { select: { all: true } };

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
