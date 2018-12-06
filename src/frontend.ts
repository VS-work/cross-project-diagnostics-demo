import { createDiagnosticManagerOn } from './diagnostics/diagnostic-manager';
import { getLabelByLevel, getLevelByLabel } from './diagnostics/definitions';

export { getLabelByLevel };

export class Vizabi {
  private queryCount: number = 0;

  chart(delay: number, severityLabel: string, emulateFrontendFatal: boolean, emulateBackendFatal: boolean,
    emulateError: boolean, emulateWarning: boolean, cb: Function): string {
    const requestId = `Q${++this.queryCount}`;
    const diag = createDiagnosticManagerOn('vizabi', '3.0.0').forRequest(requestId).withSeverityLevel(getLevelByLabel(severityLabel));
    const { debug, fatal } = diag.prepareDiagnosticFor('chart');

    debug('prepare new chart', { emulateFrontendFatal, emulateBackendFatal, emulateError, emulateWarning, delay });

    const xhr = new XMLHttpRequest();
    const url = emulateFrontendFatal ? 'wrong url' :
      `http://127.0.0.1:3000/?level=${diag.diagnosticDescriptor.level}&requestId=${requestId}&emulateFatal=${emulateBackendFatal}&emulateError=${emulateError}&emulateWarning=${emulateWarning}&delay=${delay}`;

    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            diag.extractDiagnosticContentFrom(xhr.responseText);
            debug('got external diagnostic');
          } catch (e) {
            fatal(`parse ws response`, e);
          }

          cb(diag.content);
        } else {
          fatal('parse ws response', { url, status: xhr.status });
          cb(diag.content);
        }
      }
    }

    return requestId;
  }
}
