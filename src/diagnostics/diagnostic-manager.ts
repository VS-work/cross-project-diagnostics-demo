import { DiagnosticRecord, Level } from './definitions';

export interface DiagnosticManager {
  readonly requestId: string,
  readonly version: string;
  fatal(funName: string, message: string, attachment?);
  error(funName: string, message: string, attachment?);
  warning(funName: string, message: string, attachment?);
  debug(funName: string, message: string, attachment?);
  addRecord(record: DiagnosticRecord);
}

export class LiftingDiagnosticManager implements DiagnosticManager {
  private children: DiagnosticManager[] = [];

  constructor(public readonly module: string,
    public readonly requestId: string,
    public readonly version: string) {
  }

  addOutputTo(child: DiagnosticManager) {
    this.children.push(child);
  }

  fatal(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.FATAL));
  }

  error(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.ERROR));
  }

  warning(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.WARNING));
  }

  debug(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.DEBUG));
  }

  addRecord(record: DiagnosticRecord) {
    for (const child of this.children) {
      child.addRecord(record);
    }
  }

  private prepareRecord(data, level: Level): DiagnosticRecord {
    const {funName, message, attachment} = data;

    return {
      module: this.module, version: this.version, requestId: this.requestId,
      funName, message, level, attachment
    };
  }
}

export class EndpointDiagnosticManager extends LiftingDiagnosticManager {
  content: DiagnosticRecord[] = [];

  addRecord(record: DiagnosticRecord) {
    this.content.push(record);
  }
}
