import { DiagnosticManager, createDiagnosticManagerOn } from './diagnostics/diagnostic-manager';

export class DdfQueryValidator {
  private diag: DiagnosticManager;

  constructor(parentDiagnostic: DiagnosticManager) {
    this.diag = createDiagnosticManagerOn('ddfcsvreader', '1.0.0').basedOn(parentDiagnostic);
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
