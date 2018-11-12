import { DdfQueryValidator } from './ddf-query-validator';
import { DiagnosticManager } from './diagnostics/diagnostic-manager';

export class DdfCsvReader {
  private diag: DiagnosticManager;

  constructor(parentDiagnostic: DiagnosticManager) {
    this.diag = new DiagnosticManager('ddfcsvreader', parentDiagnostic.instance, '1.0.0');
    this.diag.addOutputTo(parentDiagnostic);
  }

  read(query) {
    this.diag.info('read', 'reading ', query);

    const validator = new DdfQueryValidator(this.diag);

    if (query.soBig) {
      this.diag.warning('read', 'query is so big');
    }

    const isValid = validator.validate(query);

    if (!isValid) {
      throw Error('query is NOT valid!');
    }

    this.diag.info('read', 'got result');

    return { columns: ['geo', 'year', 'pop'], data: [['ua', '2017', 4000000]] };
  }
}
