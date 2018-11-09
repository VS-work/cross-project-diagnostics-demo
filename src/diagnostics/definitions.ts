export enum Level {
  NoInfo = 0x0,
  Error = 0x1,
  DetailsOfError = 0x2,
  ErrorInDetails = Error | DetailsOfError,
  Warning = 0x4,
  DetailsOfWarning = 0x8,
  WarningInDetails = Warning | DetailsOfWarning,
  Info = 0x10,
  DetailsOfInfo = 0x20,
  InfoInDetails = Info | DetailsOfInfo
}

export const getLevelByCode = (levelCode: number): Level => {
  switch (levelCode) {
    case 0: return Level.NoInfo;
    case 1: return Level.Error;
    case 2: return Level.ErrorInDetails;
    case 3: return Level.ErrorInDetails | Level.Warning;
    case 4: return Level.ErrorInDetails | Level.WarningInDetails;
    case 5: return Level.ErrorInDetails | Level.WarningInDetails | Level.Info;
    case 6: return Level.ErrorInDetails | Level.WarningInDetails | Level.InfoInDetails;
    default: return Level.NoInfo;
  }
};

export type DiagnosticRecord = {
  module: string;
  version: string;
  function: string;
  message: string;
  levelCode: number;
  attachment?
}
