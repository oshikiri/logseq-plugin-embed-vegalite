import "@logseq/libs";
import { renderGraph } from "./render";

async function main() {
  logseq.App.onMacroRendererSlotted(({ slot, payload }) => {
    const blockUuid = payload.uuid;
    const [type, ...dataSources] = payload.arguments;
    if (type != ":vegalite") return;

    return renderGraph(slot, blockUuid, dataSources);
  });
}

logseq.ready(main).catch(console.error);
