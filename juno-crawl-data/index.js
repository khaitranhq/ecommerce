const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("https://juno.vn/blogs/he-thong-cua-hang");

  const provinces = await page.evaluate(() => {
    const result = Array.from(
      document.querySelectorAll('select[name="change-tinh"] > option')
    );

    return result.map((element) => ({
      value: element.getAttribute("value"),
      text: element.textContent,
    }));
  });

  for (let i = 1; i < provinces.length; ++i) {
    console.log("==============", provinces[i].text, "=========");
    await page.select('select[name="change-tinh"]', provinces[i].value);

    await page.waitForTimeout(1000);
    const stores = await page.evaluate(() => {
      const addresses = Array.from(document.querySelectorAll(".infoAddres"));

      const result = Array(addresses.length).fill({});

      addresses.forEach(
        (address, index) => (result[index].address = address.textContent)
      );
      return result
    });
    console.log(stores);
  }

  await browser.close();
})();
