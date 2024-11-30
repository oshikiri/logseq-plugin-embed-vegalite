import { expect, test } from "@jest/globals";
import { extractClocks, convertDatetimeFormat } from "./parse";

test("extractClocks", () => {
  const content = `DOING taskname
:LOGBOOK:
CLOCK: [2024-10-25 Fri 22:44:21]
:END:`;

  const clocks = extractClocks(content, "");
  expect(clocks).toHaveLength(1);
  expect(clocks[0]).toHaveProperty("start", "2024-10-25T22:44:21");
  expect(clocks[0]).toHaveProperty("end", undefined);
});

test("convertDatetimeFormat(undefined) should be 'Invalid Date'", () => {
  const str: any = undefined;
  const dt = convertDatetimeFormat(str);
  expect(dt).toBe("Invalid Date");
});

test("convert", () => {
  const datetimeStr = "2024-11-26 Tue 19:44:47";
  const dt = convertDatetimeFormat(datetimeStr);
  expect(dt).toBe("2024-11-26T19:44:47");
});
