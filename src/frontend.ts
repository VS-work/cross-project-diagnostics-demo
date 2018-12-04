import { EndpointDiagnosticManager } from './diagnostics/diagnostic-manager';
import { Level, getLabelByLevel } from './diagnostics/definitions';

export { getLabelByLevel };

export class Vizabi {
  private queryCount: number = 0;

  chart(delay: number, level: Level,
    emulateFatal: boolean, emulateError: boolean, emulateWarning: boolean, cb: Function): string {
    const requestId = `Q${++this.queryCount}`;
    const diag = new EndpointDiagnosticManager('vizabi', requestId, '3.0.0');

    diag.debug('chart', 'prepare new chart', { emulateFatal, emulateError, emulateWarning, delay });

    const xhr = new XMLHttpRequest();
    const url = `http://127.0.0.1:3000/?level=${level}&requestId=${requestId}&emulateFatal=${emulateFatal}&emulateError=${emulateError}&emulateWarning=${emulateWarning}&delay=${delay}`;

    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const wsResponse = JSON.parse(xhr.responseText);

            if (wsResponse._diagnostic) {
              diag.content.push(...wsResponse._diagnostic);
              diag.debug('chart', 'got external diagnostic');
            }
          } catch (e) {
            diag.fatal('chart', 'parse ws response', e);
          }

          cb(diag.content);
        } else {
          diag.fatal('chart', 'parse ws response', xhr.status);
          cb(diag.content);
        }
      }
    }

    return requestId;
  }
}
