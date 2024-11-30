import "@logseq/libs";
import { appendFieldToBlock } from "./parse";

export async function fetch(
  dataname: string,
  query: string,
): Promise<Array<any>> {
  const blocks = await logseq.DB.q(query);
  if (!blocks) return [];

  const enhancedBlockPromises: Promise<any>[] = blocks.map((b) =>
    appendFieldToBlock(b, dataname),
  );
  return Promise.all(enhancedBlockPromises);
}
