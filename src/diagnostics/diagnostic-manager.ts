import { DiagnosticRecord, Level } from './definitions';

export class DiagnosticManager {
  private children: DiagnosticManager[] = [];

  constructor(public readonly module: string,
    public readonly instance: string,
    public readonly version: string) {
  }

  addOutputTo(child: DiagnosticManager) {
    this.children.push(child);
  }

  error(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.Error, Level.ErrorInDetails));
  }

  warning(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.Warning, Level.WarningInDetails));
  }

  info(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.Info, Level.InfoInDetails));
  }

  addRecord(record: DiagnosticRecord) {
    for (const child of this.children) {
      child.addRecord(record);
    }
  }

  private prepareRecord(data, level: Level, detailsLevel: Level) {
    return {
      module: this.module,
      version: this.version,
      instance: this.instance,
      function: data.funName,
      message: data.message,
      levelCode: level | (data.attachment ? detailsLevel : 0),
      attachment: data.attachment
    }
  }
}

export class DiagnosticAggregator extends DiagnosticManager {
  content: DiagnosticRecord[] = [];

  addRecord(record: DiagnosticRecord) {
    this.content.push(record);
  }
}
