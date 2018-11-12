import { DiagnosticManager } from './diagnostics/diagnostic-manager';

export class DdfQueryValidator {
  private diag: DiagnosticManager;

  constructor(parentDiagnostic: DiagnosticManager) {
    this.diag = new DiagnosticManager('ddfcsvreader', parentDiagnostic.instance, '1.0.0');
    this.diag.addOutputTo(parentDiagnostic);
  }

  validate(query) {
    this.diag.info('validate', 'starting validation');

    if (query.hasWarning) {
      this.diag.warning('validate', 'weird query', query);
    }

    if (query.hasError) {
      this.diag.error('validate', 'invalid query', { query, error: new Error('wrong query') });
    }

    this.diag.info('validate', 'validation passed ok');

    return true;
  }
}
