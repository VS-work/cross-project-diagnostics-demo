import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import { DiagnosticManager, LiftingDiagnosticManager, EndpointDiagnosticManager } from '../src/diagnostics/diagnostic-manager';

chai.use(chaiAsPromised);

const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('logging', () => {
  afterEach(() => {
    sandbox.restore();
  });

  xit('with 3 diagnistics manager', () => {
    const ws = new LiftingDiagnosticManager('ws', '#Q001', '1.0.0');
    const wsreader = new LiftingDiagnosticManager('wsreader', '#Q001', '2.0.0');
    const vizabi = new EndpointDiagnosticManager('vizabi', '#Q001', '3.0.0');

    wsreader.addOutputTo(vizabi);
    ws.addOutputTo(wsreader);


    ws.debug('foo1', 'notice 1');
    wsreader.debug('foo2', 'notice 2');
    vizabi.debug('foo3', 'notice 3');

    console.log(vizabi.content);
  });

  it('with 3 classes', () => {
    class Ws {
      private diag: LiftingDiagnosticManager;

      constructor(parentDiagnostic: DiagnosticManager) {
        this.diag = new LiftingDiagnosticManager('ws', '#Q001', '1.0.0');
        this.diag.addOutputTo(parentDiagnostic);
      }

      go1() {
        this.diag.error('go1', 'some err', new Error('foo'));
        this.diag.warning('go1', 'some warn');
        this.diag.debug('go1', 'some info');
      }
    }

    class WsReader {
      private diag: LiftingDiagnosticManager;

      constructor(parentDiagnostic: DiagnosticManager) {
        this.diag = new LiftingDiagnosticManager('wsreader', '#Q001', '2.0.0');
        this.diag.addOutputTo(parentDiagnostic);
      }

      go2() {
        this.diag.error('go2', 'some err', new Error('foo'));
        this.diag.warning('go2', 'some warn');
        this.diag.debug('go2', 'some info');
        const ws = new Ws(this.diag);
        ws.go1();
      }
    }

    class Vizabi {
      private diag: LiftingDiagnosticManager;

      constructor(parentDiagnostic: DiagnosticManager) {
        this.diag = new LiftingDiagnosticManager('vizabi', '#Q001', '3.0.0');
        this.diag.addOutputTo(parentDiagnostic);
      }

      go3() {
        this.diag.error('go3', 'some err', new Error('foo'));
        this.diag.warning('go3', 'some warn');
        this.diag.debug('go3', 'some info');
        const wsReader = new WsReader(this.diag);
        wsReader.go2();
      }
    }


    const main = new EndpointDiagnosticManager('tools-page', '#Q001', '0.1.0');

    const vizabi = new Vizabi(main);

    vizabi.go3();

    console.log(main.content);
  });
});
