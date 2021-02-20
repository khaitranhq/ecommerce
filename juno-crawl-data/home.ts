const Puppeteer = require('puppeteer');
const ImageDownloader = require('image-downloader');
const fs = require('fs');

const { Page, ElementHandle } = Puppeteer;

interface Color {
  colorImgUrl?: string;
  productImgUrls?: string[];
}

interface Product {
  colors?: Color[];
  productName?: string;
  cost?: number;
}

const BASE_URL = 'https://juno.vn';

const initialPage = async () => {
  const browser = await Puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1060 }
  });
  const page = await browser.newPage();

  return { browser, page };
};

const getProductUrls = async (page: typeof Page): Promise<string[]> => {
  await page.goto(BASE_URL);

  const productLinks = await page.$$('.preview-block > a');
  const productURLs: string[] = [];

  for (const element of productLinks) {
    const url: string = await page.evaluate(
      (e: any) => e.getAttribute('href'),
      element
    );
    productURLs.push(url);
  }
  return productURLs;
};

const getColorName = async (
  page: typeof Page,
  colorElement: typeof ElementHandle
) => {
  return await page.evaluate(
    (e: typeof ElementHandle) => e.getAttribute('data-value'),
    colorElement
  );
};

const getColorImgUrl = async (
  page: typeof Page,
  colorElement: typeof ElementHandle
) => {
  return await page.evaluate(
    (e: typeof ElementHandle) =>
      e.querySelector('label > img').getAttribute('src'),
    colorElement
  );
};

const getProductImgUrls = async (
  page: typeof Page,
  colorElement: typeof ElementHandle
) => {
  await colorElement.click();

  const imgElements = await page.$$('#slide-image > div');

  const productImgUrls: string[] = [];
  for (const imgElement of imgElements) {
    const url: string = await page.evaluate(
      (e: any) => e.getAttribute('data-original'),
      imgElement
    );
    productImgUrls.push(url);
  }
  return productImgUrls;
};

(async () => {
  const { page, browser } = await initialPage();
  const productURLs = await getProductUrls(page);

  const products: Product[] = [];
  for (const url of productURLs) {
    let product: Product = { colors: [] };

    await page.goto(`${BASE_URL}${url}`);

    const colorElements = await page.$$('#variant-swatch-0 > div > div');

    const firstColorName = await getColorName(page, colorElements[0]);
    for (const i in colorElements) {
      const currentColorName = await getColorName(page, colorElements[i]);

      if (parseInt(i) && currentColorName === firstColorName) break;

      let color: Color = {};

      color.colorImgUrl = await getColorImgUrl(page, colorElements[i]);
      color.productImgUrls = await getProductImgUrls(page, colorElements[i]);
      product.colors.push(color);
    }

    products.push(product);
  }

  if (!fs.existsSync('./result')) fs.mkdirSync('./result');

  for (const product of products)
    for (const color of product.colors)
      for (const productImgUrl of color.productImgUrls)
        ImageDownloader.image({
          url: `http:${productImgUrl}`,
          dest: './result'
        });

  await browser.close();
})();
