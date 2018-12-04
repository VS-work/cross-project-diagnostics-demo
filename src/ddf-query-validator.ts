import { LiftingDiagnosticManager } from './diagnostics/diagnostic-manager';

export class DdfQueryValidator {
  private diag: LiftingDiagnosticManager;

  constructor(parentDiagnostic: LiftingDiagnosticManager) {
    this.diag = new LiftingDiagnosticManager('ddfcsvreader', parentDiagnostic.requestId, '1.0.0');
    this.diag.addOutputTo(parentDiagnostic);
  }

  validate(query) {
    this.diag.debug('validate', 'starting validation');

    if (query.emulateWarning) {
      this.diag.warning('validate', 'weird query', query);
    }

    if (query.emulateError) {
      this.diag.error('validate', 'invalid query', { query, error: new Error('wrong query') });
    }

    this.diag.debug('validate', 'validation passed ok');

    return true;
  }
}
