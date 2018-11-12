import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import { DiagnosticManager, DiagnosticAggregator } from '../src/diagnostics/diagnostic-manager';

chai.use(chaiAsPromised);

const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('logging', () => {
  afterEach(() => {
    sandbox.restore();
  });

  xit('with 3 diagnistics manager', () => {
    const ws = new DiagnosticManager('ws', '#Q001', '1.0.0');
    const wsreader = new DiagnosticManager('wsreader', '#Q001', '2.0.0');
    const vizabi = new DiagnosticAggregator('vizabi', '#Q001', '3.0.0');

    wsreader.addOutputTo(vizabi);
    ws.addOutputTo(wsreader);


    ws.info('foo1', 'notice 1');
    wsreader.info('foo2', 'notice 2');
    vizabi.info('foo3', 'notice 3');

    console.log(vizabi.content);
  });

  it('with 3 classes', () => {
    class Ws {
      private diag: DiagnosticManager;

      constructor(parentDiagnostic: DiagnosticManager) {
        this.diag = new DiagnosticManager('ws', '#Q001', '1.0.0');
        this.diag.addOutputTo(parentDiagnostic);
      }

      go1() {
        this.diag.error('go1', 'some err', new Error('foo'));
        this.diag.warning('go1', 'some warn');
        this.diag.info('go1', 'some info');
      }
    }

    class WsReader {
      private diag: DiagnosticManager;

      constructor(parentDiagnostic: DiagnosticManager) {
        this.diag = new DiagnosticManager('wsreader', '#Q001', '2.0.0');
        this.diag.addOutputTo(parentDiagnostic);
      }

      go2() {
        this.diag.error('go2', 'some err', new Error('foo'));
        this.diag.warning('go2', 'some warn');
        this.diag.info('go2', 'some info');
        const ws = new Ws(this.diag);
        ws.go1();
      }
    }

    class Vizabi {
      private diag: DiagnosticManager;

      constructor(parentDiagnostic: DiagnosticManager) {
        this.diag = new DiagnosticManager('vizabi', '#Q001', '3.0.0');
        this.diag.addOutputTo(parentDiagnostic);
      }

      go3() {
        this.diag.error('go3', 'some err', new Error('foo'));
        this.diag.warning('go3', 'some warn');
        this.diag.info('go3', 'some info');
        const wsReader = new WsReader(this.diag);
        wsReader.go2();
      }
    }


    const main = new DiagnosticAggregator('tools-page', '#Q001', '0.1.0');

    const vizabi = new Vizabi(main);

    vizabi.go3();

    console.log(main.content);
  });
});
