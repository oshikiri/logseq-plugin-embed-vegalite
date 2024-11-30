import "@logseq/libs";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import { Block, LogbookDuration } from "./types";

// for vega toDate
// https://vega.github.io/vega/docs/expressions/#toDate
const datetimeFormatForVegalite = "YYYY-MM-DDTHH:mm:ss";

export async function appendFieldToBlock(
  block: Block,
  dataname: string,
): Promise<Block> {
  if (block.properties) {
    block.properties = sanitizeProperties(block.properties);
  }

  block = appendCustomFields(block);

  block = await appendTaskFields(block, dataname);

  return block;
}

function appendCustomFields(block: Block): Block {
  block.ext = block.ext || {};

  // I usually add date to task like below
  // - DONE some task [[2024-11-10]]
  block.ext.date = block.content?.match(/\d+-\d+-\d+/)?.[0];

  return block;
}

async function appendTaskFields(
  block: Block,
  dataname: string,
): Promise<Block> {
  if (!dataname.includes("task")) return block;

  block.ext = block.ext || {};
  block.ext.logbook = block.ext.logbook || {};

  block.ext.logbook.title = extractTaskTitle(block.content || "");

  if (dataname.includes("fullpath")) {
    block.ext.logbook.fullpath = trimTitle(
      (await getFullPath(block.parent?.id || null)) + block.ext.logbook.title,
    );
  }

  const durations = extractClocks(block.content || "", block.marker || "");
  block.ext.logbook.durations = durations;
  if (durations.length == 0) return block;

  block.ext.logbook.startMin = durations.map((d) => d.start || "").sort()[0];

  const endMax = durations
    .filter((d) => !!d.end)
    .map((d) => d.end)
    .sort()
    .reverse()[0];
  block.ext.logbook.endMax =
    endMax || dayjs().format(datetimeFormatForVegalite);

  return block;
}

export function convertDatetimeFormat(datetime: string): string {
  const datetimeFormatLogbook = "YYYY-MM-DD ddd HH:mm:ss";
  return dayjs(datetime, datetimeFormatLogbook).format(
    datetimeFormatForVegalite,
  );
}

export function extractClocks(
  content: string,
  rootStatus: string,
): LogbookDuration[] {
  const clocks = Array.from(
    content.matchAll(/CLOCK:\s*\[(.+?)\](?:--\[(.+?)\])?/g),
  );
  const durations: Array<any> = [];
  for (const i in clocks) {
    const c = clocks[i];
    durations.push({
      start: c[1] ? convertDatetimeFormat(c[1]) : undefined,
      end: c[2] ? convertDatetimeFormat(c[2]) : undefined,
      marker: Number(i) == clocks.length - 1 ? rootStatus : "DONE",
    });
  }
  return durations;
}

function extractTaskTitle(taskContent: string): string {
  const line0 = taskContent.split("\n")[0];
  return trimTitle(line0);
}

function sanitizeProperties(properties: any): any {
  for (const k in properties) {
    // start:: [[2024-01-01]]
    // -> {"start":["2024-01-01"]}
    if (properties[k]?.length == 1) {
      properties[k] = properties[k][0];
    }
  }
  return properties;
}

// TODO: cache
async function getFullPath(parentId: number | null): Promise<string> {
  let fullpath = "";
  while (parentId != null) {
    const parent = await logseq.Editor.getBlock(parentId);
    if (parent == null) break;
    fullpath = parent?.content?.split("\n")[0] + " > " + fullpath;
    parentId = parent?.parent?.id;
  }
  return fullpath;
}

function trimTitle(title: string): string {
  return title
    .replaceAll("TODO ", "")
    .replaceAll("DOING ", "")
    .replaceAll("DONE ", "")
    .replaceAll(/\[\[\d{4}-\d{2}-\d{2}\]\]/g, "")
    .replaceAll(/(\[\[|\]\])/g, "");
}
