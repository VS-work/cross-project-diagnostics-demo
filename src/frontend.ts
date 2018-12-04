import { EndpointDiagnosticManager } from './diagnostics/diagnostic-manager';
import { Level } from './diagnostics/definitions';

export class Vizabi {
  private diag: EndpointDiagnosticManager;
  private queryCount: number = 0;

  constructor() {
    this.diag = new EndpointDiagnosticManager('vizabi', '', '3.0.0');
  }

  chart(delay: number, level: Level,
    emulateFatal: boolean, emulateError: boolean, emulateWarning: boolean, cb: Function): string {
    this.diag.debug('chart', 'prepare new chart', { emulateFatal, emulateError, emulateWarning, delay });
    const xhr = new XMLHttpRequest();
    const requestId = `Q${++this.queryCount}`;
    const url = `http://127.0.0.1:3000/?level=${level}&requestId=${requestId}&emulateFatal=${emulateFatal}&emulateError=${emulateError}&emulateWarning=${emulateWarning}&delay=${delay}`;

    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const wsResponse = JSON.parse(xhr.responseText);

            if (wsResponse._diagnostic) {
              this.diag.content.push(...wsResponse._diagnostic);
              this.diag.debug('chart', 'got external diagnostic');
            }
          } catch (e) {
            this.diag.fatal('chart', 'parse ws response', e);
          }

          cb(this.diag.content);
        } else {
          this.diag.fatal('chart', 'parse ws response', xhr.status);
          cb(this.diag.content);
        }
      }
    }

    return requestId;
  }
}
