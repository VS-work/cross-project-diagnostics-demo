import { DiagnosticManager, createDiagnosticManagerOn } from 'cross-project-diagnostics';

export class DdfQueryValidator {
  private diag: DiagnosticManager;

  constructor(parentDiagnostic: DiagnosticManager) {
    this.diag = createDiagnosticManagerOn('ddf query validator', '1.0.0').basedOn(parentDiagnostic);
  }

  validate(query) {
    const { debug, warning, error } = this.diag.prepareDiagnosticFor('validate');

    debug('starting validation');

    if (query.emulateWarning) {
      warning('weird query', query);
    }

    if (query.emulateError) {
      error('invalid query', { query, error: new Error('wrong query') });
    }

    debug('validation passed ok');

    return true;
  }
}
