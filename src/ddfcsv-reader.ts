import { DdfQueryValidator } from './ddf-query-validator';

export class DdfCsvReader {
  private logger;
  private error;

  constructor() {
    // this.logger = createLogger('ddfcsvreader:log', loggerObject);
    // this.error = createLogger('ddfcsvreader:err', loggerObject);
  }

  read(query) {
    // this.logger('reading ', query);
    // this.error('just an error');

    const validator = new DdfQueryValidator();

    validator.validate(query);

    return { data: [1, 2, 3], for: query };
  }
}
