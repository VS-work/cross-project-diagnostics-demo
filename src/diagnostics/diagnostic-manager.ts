import { DiagnosticRecord, Level } from './definitions';

export interface DiagnosticDescriptor {
  module: string
  version: string;
  requestId?: string,
}

export function createDiagnosticManagerOn(module: string, version: string) {
  return {
    forRequest: (requestId: string) => {
      const diagnosticDescriptor = { module, version, requestId };

      return new EndpointDiagnosticManager(diagnosticDescriptor);
    },
    basedOn: (parent: DiagnosticManager) => {
      const diagnosticDescriptor = { module, version, requestId: parent.diagnosticDescriptor.requestId };
      const diag = new LiftingDiagnosticManager(diagnosticDescriptor);

      diag.addOutputTo(parent);

      return diag;
    }
  };
}

export interface DiagnosticManager {
  diagnosticDescriptor: DiagnosticDescriptor;
  fatal(funName: string, message: string, attachment?);
  error(funName: string, message: string, attachment?);
  warning(funName: string, message: string, attachment?);
  debug(funName: string, message: string, attachment?);
  prepareDiagnosticFor(funName: string);
  addRecord(record: DiagnosticRecord);
}

export class LiftingDiagnosticManager implements DiagnosticManager {
  private parents: DiagnosticManager[] = [];

  constructor(public readonly diagnosticDescriptor: DiagnosticDescriptor) {
  }

  addOutputTo(parent: DiagnosticManager) {
    this.parents.push(parent);
  }

  fatal(funName: string, message: string, attachmentPar) {
    const attachment = attachmentPar instanceof Error ? attachmentPar.stack : attachmentPar;

    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.FATAL));
  }

  error(funName: string, message: string, attachment) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.ERROR));
  }

  warning(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.WARNING));
  }

  debug(funName: string, message: string, attachment?) {
    this.addRecord(this.prepareRecord({ funName, message, attachment }, Level.DEBUG));
  }

  prepareDiagnosticFor(funName: string) {
    return {
      fatal: this.prepareFatalFor(funName),
      error: this.prepareErrorFor(funName),
      warning: this.prepareWarningFor(funName),
      debug: this.prepareDebugFor(funName)
    };
  }

  addRecord(record: DiagnosticRecord) {
    if (this.parents.length <= 0) {
      throw Error(`parents are missing for ${this.diagnosticDescriptor.module}@${this.diagnosticDescriptor.version} on ${this.diagnosticDescriptor.requestId}`);
    }

    for (const parent of this.parents) {
      parent.addRecord(record);
    }
  }

  private prepareFatalFor(funName: string) {
    return (message: string, attachment) => {
      this.fatal(funName, message, attachment);
    };
  }

  private prepareErrorFor(funName: string) {
    return (message: string, attachment) => {
      this.error(funName, message, attachment);
    };
  }

  private prepareWarningFor(funName: string) {
    return (message: string, attachment?) => {
      this.warning(funName, message, attachment);
    };
  }

  private prepareDebugFor(funName: string) {
    return (message: string, attachment?) => {
      this.debug(funName, message, attachment);
    };
  }

  private prepareRecord(data, level: Level): DiagnosticRecord {
    const { funName, message, attachment } = data;

    return {
      module: this.diagnosticDescriptor.module,
      version: this.diagnosticDescriptor.version,
      requestId: this.diagnosticDescriptor.requestId,
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
