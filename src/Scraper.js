const axios = require("axios");
const cheerio = require("cheerio");
const batosConfig = require("../batos.config");

class Scraping {
  getStreaming = async (slug) => {
    try {
      const $ = await this.koneksi(`${batosConfig.url}/${slug}`);
      const title = $(
        "article > div.megavid > div > div.item.meta > div.lm > div > h1"
      )
        ? $(
            "article > div.megavid > div > div.item.meta > div.lm > div > h1"
          ).text()
        : null;
      // console.log(title);
      const iframe = $("#pembed > iframe").attr("src")
        ? $("#pembed > iframe").attr("src")
        : null;
      const prevSlugEps = $(
        "article > div.megavid > div > div.naveps.bignav > div:nth-child(1) > a"
      )
        ? $(
            "article > div.megavid > div > div.naveps.bignav > div:nth-child(1) > a"
          )
            .attr("href")
            .split("/")[3]
        : null;
      const allSlugEps = $(
        "article > div.megavid > div > div.naveps.bignav > div.nvs.nvsc > a"
      )
        .attr("href")
        .split("/")[4];
      const nextSlugEps = $(
        "article > div.megavid > div > div.naveps.bignav > div:nth-child(3) > a"
      ).attr("href")
        ? $(
            "article > div.megavid > div > div.naveps.bignav > div:nth-child(3) > a"
          )
            .attr("href")
            .split("/")[3]
        : null;
      const recommendedArray = $(
        "article > div:nth-child(6) > div.listupd > article"
      ).toArray();
      const recommendedResults = [];
      recommendedArray.forEach((item) => {
        const title = $(item).find("div.bsx > a.tip > div.tt > h2").text();
        const img = $(item)
          .find("div.bsx > a.tip > div.limit > img")
          .attr("src")
          .split("?")[0];
        const type = $(item)
          .find("div.bsx > a.tip > div.limit > div.typez")
          .text();
        const onTrending = $(item)
          .find("div.bsx > a.tip > div.limit > div.hotbadge")
          .attr("class")
          ? true
          : false;
        const status = $(item)
          .find("div.bsx > a.tip > div.limit > div.bt > span.epx")
          .text();
        const slug = $(item)
          .find("div.bsx > a.tip")
          .attr("href")
          .split("/")[4]
          .trim();
        recommendedResults.push({ title, slug, img, type, status, onTrending });
      });
      const data = {
        status: title !== null ? true : false,
        title: title,
        src: iframe,
        prevSlugEps: prevSlugEps,
        allSlugEps: allSlugEps,
        nextSlugEps: nextSlugEps,
        recommended: recommendedResults,
      };
      const result = await this.cetakResult(data);
      return result;
    } catch (error) {
      return this.errorMsg(error);
    }
  };

  getDownload = async (slug) => {
    try {
      const $ = await this.koneksi(`${batosConfig.url}/${slug}`);
      const downloadArray = $(
        "article > div.entry-content > div:nth-child(2) > div.mctnx > div"
      ).toArray();
      const results = [];
      const resultsText = [];
      const resultsUrl = [];
      downloadArray.forEach((itemResolution) => {
        const resoFormat = $(itemResolution).find("div.sorattlx").text();
        const resolutionArray = $(itemResolution)
          .find("div.soraurlx")
          .toArray();

        let existingType = results.find((item) => item.format === resoFormat);
        if (!existingType) {
          existingType = {
            format: resoFormat,
            qualities: [],
          };
          results.push(existingType);
        }

        resolutionArray.forEach((resolutionText) => {
          const resoText = $(resolutionText).find("strong").text();
          const hrefArray = $(resolutionText).find("a").toArray();

          resultsText.push({ [resoFormat]: { resolutin: resultsUrl } });

          let existingQuality = existingType.qualities.find(
            (q) => q.quality === resoText
          );

          if (!existingQuality) {
            existingQuality = {
              quality: resoText,
              urls: [],
            };
            existingType.qualities.push(existingQuality);
          }

          hrefArray.forEach((urlItem) => {
            const href = $(urlItem).attr("href");
            const text = $(urlItem).text();

            existingQuality.urls.push({ href, server: text });
          });
        });
      });
      return results;
    } catch (error) {
      return this.errorMsg(error);
    }
  };

  getLatest = async (page = 1) => {
    try {
      const $ = await this.koneksi(`${batosConfig.url}/page/${page}`);
      const animeArray = $(
        "#content > div > div.postbody > div:nth-child(2) > div.listupd.normal > div.excstf > article.stylesix"
      ).toArray();
      const animeResults = [];
      const prevPage = $(
        "#content > div > div.postbody > div:nth-child(2) > div.listupd.normal > div.hpage > a.l"
      ).attr("href")
        ? $(
            "#content > div > div.postbody > div:nth-child(2) > div.listupd.normal > div.hpage > a.l"
          )
            .attr("href")
            .split("/")[4]
            .trim()
        : null;
      const nextPage = $(
        "#content > div > div.postbody > div:nth-child(2) > div.listupd.normal > div.hpage > a.r"
      ).attr("href")
        ? $(
            "#content > div > div.postbody > div:nth-child(2) > div.listupd.normal > div.hpage > a.r"
          )
            .attr("href")
            .split("/")[4]
            .trim()
        : null;
      animeArray.forEach((item) => {
        const title = $(item).find("div > div.inf > h2 > a").text();
        const img = $(item)
          .find("div > div.thumb > a > img")
          .attr("src")
          .split("?")[0];
        const slug = $(item)
          .find("div > div.inf > h2 > a")
          .attr("href")
          .split("/")[3];
        const type = $(item).find("div > div.thumb > a > div.typez").text();
        const eps = $(item).find("div > div.thumb > a > div.bt > span").text();
        const rating = $(item).find("div > div.upscore > span.scr").text();
        const status = $(item)
          .find("div > div.inf > ul > li:nth-child(1)")
          .text()
          .split(":")[1]
          .trim();
        const series = $(item)
          .find("div > div.inf > ul > li:nth-child(4) > a")
          .text();
        const seriesSlug = $(item)
          .find("div > div.inf > ul > li:nth-child(4) > a")
          .attr("href")
          .split("/")[4]
          .trim();
        const releasedDate = $(item)
          .find("div > div.inf > ul > li:nth-child(3)")
          .text();
        const genres = $(item)
          .find("div > div.inf > ul > li:nth-child(5) > a")
          .toArray();
        const genresArray = [];
        genres.forEach((genre) => {
          const name = $(genre).text();
          const slug = $(genre).attr("href").split("/")[4].trim();
          genresArray.push({ name, slug });
        });
        animeResults.push({
          title,
          img,
          slug,
          type,
          eps,
          rating,
          status,
          series,
          seriesSlug,
          releasedDate,
          genres: genresArray,
        });
      });
      const prevPageInt = parseInt(prevPage);
      const nextPageInt = parseInt(nextPage);
      parseInt(nextPage);
      return {
        status: true,
        prevPage: prevPageInt,
        nextPage: nextPageInt,
        currentPage: nextPageInt - 1,
        data: animeResults,
      };
    } catch (error) {
      return this.errorMsg(error);
    }
  };

  animeDetail = async (slug) => {
    try {
      const $ = await this.koneksi(`${batosConfig.url}/anime/${slug}`);
      const title = $(
        "article > div.bixbox.animefull > div > div.infox > h1"
      ).text();
      const img = $(
        "article > div.bixbox.animefull > div > div.thumbook > div.thumb > img"
      ).attr("src");
      const rating = $(
        "article > div.bixbox.animefull > div > div.thumbook > div.rt > div.rating > strong"
      ).text();
      const ratingWidth = $(
        "article > div.bixbox.animefull > div > div.thumbook > div.rt > div.rating > div > div > div > span"
      )
        .attr("style")
        .split(":")[1]
        .trim();
      const aboutArray = $(
        "article > div.bixbox.animefull > div > div.infox > div > div.info-content > div.spe > span"
      ).toArray();
      const aboutResults = [];
      aboutArray.forEach((item) => {
        const key = $(item).find("b").text().split(":")[0].toLowerCase().trim();
        const value = $(item).text().split(":")[1].trim();
        aboutResults.push({ [key]: value });
      });
      const genresArray = $(
        "article > div.bixbox.animefull > div > div.infox > div > div.info-content > div.genxed > a"
      ).toArray();
      const genres = [];
      genresArray.forEach((item) => {
        const slug = $(item).attr("href").split("/")[4];
        const name = $(item).text();
        genres.push({ name, slug });
      });
      const synopsis = $(
        "article > div.bixbox.synp > div.entry-content > p"
      ).text();

      const lastEps = $(
        "article > div.bixbox.bxcl.epcheck > div.lastend > div:nth-child(2) > a"
      )
        .attr("href")
        .split("/")[3]
        .trim();
      const allEpsArray = $(
        "article > div.bixbox.bxcl.epcheck > div.eplister > ul > li"
      ).toArray();
      const allEpsResults = [];
      allEpsArray.forEach((item) => {
        const slug = $(item).find("a").attr("href").split("/")[3];
        const title = $(item).find("a > div.epl-title").text();
        const releaseDate = $(item).find("a > div.epl-date").text();
        const eps = $(item).find("a > div.epl-num").text();
        allEpsResults.push({ title, eps, slug, releaseDate });
      });
      return {
        status: true,
        data: {
          title,
          img,
          rating,
          ratingWidth,
          info: aboutResults,
          genres,
          synopsis,
          firstEps: allEpsResults.pop().slug,
          lastEps,
          allEpsResults,
        },
      };
    } catch (error) {
      return this.errorMsg(error);
    }
  };

  //--------UTILITIES function------------

  errorMsg = (error) => {
    console.error(error);
    return { status: false, message: "Mohon maaf, data tidak ditemukan!!!" };
  };

  koneksi = async (url) => {
    const res = await axios.get(url);
    return cheerio.load(res.data);
  };
  cetakResult = async (data) => {
    if (data.status) {
      return {
        status: data.status,
        data: {
          title: data.title,
          src: data.src,
          prevSlugEps: data.prevSlugEps,
          allSlugEps: data.allSlugEps,
          nextSlugEps: data.nextSlugEps,
          recommended: data.recommended,
        },
      };
    } else {
      return {
        status: data.status,
        message: "Mohon maaf, data tidak ditemukan!",
      };
    }
  };
}

// const testing = new Scraping();
// testing.getDownload("one-piece-episode-1104-subtitle-indonesia").then((d) => {
//   console.log(d);
// });

module.exports = Scraping;
