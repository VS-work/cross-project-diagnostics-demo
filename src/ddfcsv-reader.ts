import { DdfQueryValidator } from './ddf-query-validator';
import { LiftingDiagnosticManager } from './diagnostics/diagnostic-manager';

export class DdfCsvReader {
  private diag: LiftingDiagnosticManager;

  constructor(parentDiagnostic: LiftingDiagnosticManager) {
    this.diag = new LiftingDiagnosticManager('ddfcsvreader', parentDiagnostic.requestId, '1.0.0');
    this.diag.addOutputTo(parentDiagnostic);
  }

  read(query) {
    this.diag.debug('read', 'reading ', query);

    const validator = new DdfQueryValidator(this.diag);

    if (query.emulateWarning) {
      this.diag.warning('read', 'query is so big');
    }

    const isValid = validator.validate(query);

    if (!isValid) {
      throw Error('query is NOT valid!');
    }

    this.diag.debug('read', 'got result');

    return { columns: ['geo', 'year', 'pop'], data: [['ua', '2017', 4000000]] };
  }
}
