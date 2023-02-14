import request from "request-promise";
import cheerio from "cheerio";
import fs from "fs";
import todayTomorrow from "./Functions/todayTomorrow.js";
import sleep from "./Functions/sleep.js";

interface Movie {
  title: string;
  rank: number;
  IMDBRating: number;
  descriptionURL: string;
  posterURL: string;
}

async function folderCreatorOne(path: string) {
  const { today, tomorrow } = todayTomorrow(new Date());
  // Don't create the html logs folder as expected to have been created by AlphegaGetter
  // Same for dates => HERE created as it's non-existing - TO DO
  fs.mkdir(
    `${path}html-logs/${today.Year}-${today.Month}-${today.Date}`,
    { recursive: true },
    (err) => {
      console.log(err);
    }
  );
  await sleep(1000);
}

async function fileSaverOne(html: any, path: string) {
  const { today, tomorrow } = todayTomorrow(new Date());
  fs.writeFileSync(
    `${path}html-logs/${today.Year}-${today.Month}-${today.Date}/IMDB.html`,
    html
  );
}

async function GetterOne(path: string) {
  const html = await request.get(
    "https://m.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm"
  );
  await folderCreatorOne(path);
  await sleep(1000);
  await fileSaverOne(html, path);
  await sleep(1000);
}

function LvLOnePage($: any) {
  let result: Movie[] = [];
  $(".btn-full").map((i: number, e: any) => {
    const descriptionURL = "https://m.imdb.com" + $(e).attr("href");
    const title = $(e).find("span > h4").text().trim().replace(/\n/, " ");
    const rank = Number($(e).find("span > span").text().split(/\n/)[0]);
    const IMDBRating = Number(
      $(e).find(".imdb-rating").text().replace(",", ".")
    );
    const toBePushed = {
      title,
      rank,
      IMDBRating,
      descriptionURL,
      posterURL: "string",
    };
    result.push(toBePushed);
  });
  return result;
}

async function ParserOne(path: string) {
  const { today, tomorrow } = todayTomorrow(new Date());
  const html = fs.readFileSync(
    `${path}html-logs/${today.Year}-${today.Month}-${today.Date}/IMDB.html`
  );
  const $ = await cheerio.load(html);
  const result = LvLOnePage($);
  return result;
}

async function folderCreatorTwo(path: string) {
  const { today, tomorrow } = todayTomorrow(new Date());
  // Don't create the html logs folder as expected to have been created by AlphegaGetter
  // Same for dates => HERE created as it's non-existing - TO DO
  fs.mkdir(
    `${path}html-logs/${today.Year}-${today.Month}-${today.Date}/Subpages`,
    { recursive: true },
    (err) => {
      console.log(err);
    }
  );
  await sleep(1000);
}

async function fileSaverTwo(html: any, path: string, i: number) {
  const { today, tomorrow } = todayTomorrow(new Date());
  fs.writeFileSync(
    `${path}html-logs/${today.Year}-${today.Month}-${today.Date}/Subpages/${i}.html`,
    html
  );
}

async function GetterTwo(path: string, url: string, i: number) {
  const html = await request.get(url);
  //   await folderCreatorTwo(path);
  await sleep(1000);
  await fileSaverTwo(html, path, i);
  await sleep(1000);
}

async function FullJob(path: string) {
  await GetterOne(path);
  await sleep(1000);
  const HundredMovie = await ParserOne(path);
  await folderCreatorTwo(path);
  // HundredMovie.length
  for (let i = 0; i < 10; i++) {
    await GetterTwo(path, HundredMovie[i].descriptionURL, i);
  }
}

FullJob("");
