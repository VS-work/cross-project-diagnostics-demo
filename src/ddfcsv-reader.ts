import { DdfQueryValidator } from './ddf-query-validator';
import { DiagnosticManager, createDiagnosticManagerOn } from 'cross-project-diagnostics';

export class DdfCsvReader {
  private readonly diag: DiagnosticManager;

  constructor(parentDiagnostic: DiagnosticManager) {
    this.diag = createDiagnosticManagerOn('ddfcsvreader', '1.0.0').basedOn(parentDiagnostic);
  }

  read(query) {
    const { debug, warning } = this.diag.prepareDiagnosticFor('read');

    debug('reading ', query);

    const validator = new DdfQueryValidator(this.diag);

    if (query.emulateWarning) {
      warning('query is so big');
    }

    const isValid = validator.validate(query);

    if (!isValid) {
      throw Error('query is NOT valid!');
    }

    debug('got result');

    return { columns: ['geo', 'year', 'pop'], data: [['ua', '2017', 4000000]] };
  }
}
