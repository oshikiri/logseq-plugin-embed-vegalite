// BlockEntity of https://github.com/logseq/logseq/blob/master/libs/src/LSPlugin.ts
export interface Block {
  id: number;
  content: string;
  marker?: string;
  properties?: Map<any, any>;
  parent: Block;

  ext?: BlockExt;
}

export interface BlockExt {
  date?: string;
  logbook?: Logbook;
}

export interface Logbook {
  title?: string;
  startMin?: string;
  endMax?: string;
  fullpath?: string;
  durations?: LogbookDuration[];
}

export interface LogbookDuration {
  start?: string;
  end?: string;
  marker?: string;
}
