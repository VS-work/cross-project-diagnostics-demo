import { createDiagnosticManagerOn } from './diagnostics/diagnostic-manager';
import { Level, getLabelByLevel } from './diagnostics/definitions';

export { getLabelByLevel };

export class Vizabi {
  private queryCount: number = 0;

  chart(delay: number, level: Level, emulateFrontendFatal: boolean, emulateBackendFatal: boolean,
    emulateError: boolean, emulateWarning: boolean, cb: Function): string {
    const requestId = `Q${++this.queryCount}`;
    const diag = createDiagnosticManagerOn('vizabi', '3.0.0').forRequest(requestId);
    const { debug, fatal } = diag.prepareDiagnosticFor('chart');

    debug('prepare new chart', { emulateFrontendFatal, emulateBackendFatal, emulateError, emulateWarning, delay });

    const xhr = new XMLHttpRequest();
    const url = emulateFrontendFatal ? 'wrong url' :
      `http://127.0.0.1:3000/?level=${level}&requestId=${requestId}&emulateFatal=${emulateBackendFatal}&emulateError=${emulateError}&emulateWarning=${emulateWarning}&delay=${delay}`;

    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const wsResponse = JSON.parse(xhr.responseText);

            if (wsResponse._diagnostic) {
              diag.content.push(...wsResponse._diagnostic);
              debug('got external diagnostic');
            }
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
