import { fetch } from "./db";
import { createSvg } from "./vegalite";

export async function renderGraph(
  slotId: string,
  blockUuid: string,
  dataSources: Array<string>,
) {
  const vlJsonStr = await getJsonStrFromChildNode(blockUuid);
  if (!vlJsonStr) return;

  console.debug(`Render block=${blockUuid}, datasources="${dataSources}"`);

  const dataList = await getData(dataSources);
  console.debug({ blockUuid, dataList });

  const svgString = await createSvg(vlJsonStr, dataList);

  logseq.provideUI({
    key: crypto.randomUUID(),
    slot: slotId,
    reset: true,
    style: {
      flexDirection: "column",
    },
    template: svgString || "",
  });
}

async function getData(dataSources: Array<string>) {
  let dataList: Array<any> = [];

  for (const dataSource of dataSources) {
    // TODO: split("=")?
    const [dataname, query] = dataSource.split("=");

    const dateStart = new Date().valueOf();
    const data = await fetch(dataname, query);
    const dateEnd = new Date().valueOf();
    console.debug(
      `fetch: ${(dateEnd - dateStart) / 1000} sec, dataname="${dataname}", query="${query}"`,
    );

    const d = { dataname, query, data };
    dataList.push(d);
  }
  return dataList;
}

async function getJsonStrFromChildNode(rootBlockUuid: string): Promise<string> {
  const currentBlock = await logseq.Editor.getBlock(rootBlockUuid);
  // TODO: children?.[0][1]
  const childBlockUuid: any = currentBlock?.children?.[0][1];
  if (!childBlockUuid) return "";

  const jsonBlock = await logseq.Editor.getBlock(childBlockUuid);
  if (!jsonBlock?.content) return "";

  const vlJson: any = extractVLJson(jsonBlock?.content);
  return vlJson;
}

// TODO
function extractVLJson(content: string): string {
  return content.replace("```json", "").replace("```", "");
}
