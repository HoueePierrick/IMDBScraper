import request from "request-promise";
import cheerio from "cheerio";
import fs from "fs";
import todayTomorrow from "./Functions/todayTomorrow.js";
import sleep from "./Functions/sleep.js";

async function GetterOne(path: string) {
  const html = await request.get(
    "https://www.docmorris.de/grippostad-c-24-kapseln/00571748"
  );
  const { today, tomorrow } = todayTomorrow(new Date());
  fs.writeFileSync(`test2.html`, html);
}

GetterOne("");
