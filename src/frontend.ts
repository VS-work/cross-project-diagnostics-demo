import { DiagnosticAggregator } from './diagnostics/diagnostic-manager';

export class Vizabi {
  private diag: DiagnosticAggregator;
  private queryCount: number = 0;

  constructor() {
    this.diag = new DiagnosticAggregator('vizabi', '', '3.0.0');
  }

  chart(isDiagnostics: boolean, hasError: boolean, hasWarning: boolean, delay: number, cb: Function) {
    this.diag.info('chart', 'prepare new chart', { hasError, hasWarning, delay });
    const http = new XMLHttpRequest();
    const queryId = `Q${++this.queryCount}`;
    const url = `http://127.0.0.1:3000/?isDiagnostics=${isDiagnostics}&queryId=${queryId}&hasError=${hasError}&hasWarning=${hasWarning}&delay=${delay}`;

    http.open('GET', url);
    http.send();
    http.onreadystatechange = () => {
      try {
        const wsResponse = JSON.parse(http.responseText);

        if (wsResponse._diagnostic) {
          this.diag.content.push(...wsResponse._diagnostic);
          this.diag.info('chart', 'got external diagnostic');
        }
      } catch (e) {
        this.diag.error('chart', 'parse ws response', e);
      }

      cb(this.diag.content);
    }
  }
}
