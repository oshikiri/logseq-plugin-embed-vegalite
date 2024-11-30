import * as vega from "vega";
import * as vegalite from "vega-lite";

export async function createSvg(
  jsonStr: string,
  dataList: Array<any>,
): Promise<string> {
  const vlSpec: vegalite.TopLevelSpec = JSON.parse(jsonStr);
  const vegaspec: vega.Spec = vegalite.compile(vlSpec).spec;
  const svg: string = await createSvgFromVegaSpec(vegaspec, dataList);
  return svg;
}

async function createSvgFromVegaSpec(
  vegaSpec: vega.Spec,
  dataList: Array<any>,
): Promise<string> {
  let view = new vega.View(vega.parse(vegaSpec), { renderer: "svg" });

  for (const { dataname, data } of dataList) {
    view = view.insert(dataname, data);
  }

  const svgString = await view.toSVG().catch(function (err) {
    console.error(err);
    return "";
  });

  return svgString;
}
