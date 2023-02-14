function LvLOnePage() {
  let result = [];
  $(".btn-full").map((i, e) => {
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
  console.log(result);
}

LvLOnePage();
