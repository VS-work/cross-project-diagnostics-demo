export enum Level {
  OFF = 0x0,
  FATAL = 0x1,
  ERROR = 0x2,
  WARNING = 0x4,
  DEBUG = 0x8,
  ALL = FATAL | ERROR | WARNING | DEBUG
}

export const getLevelByCode = (levelCode: number): Level => {
  switch (levelCode) {
    case 0: return Level.OFF;
    case 1: return Level.FATAL;
    case 2: return Level.ERROR;
    case 3: return Level.WARNING;
    case 4: return Level.DEBUG;
    case 5: return Level.ALL;
    default: return Level.OFF;
  }
};

export type DiagnosticRecord = {
  module: string;
  requestId: string;
  version: string;
  funName: string;
  message: string;
  level: Level;
  attachment?
}
