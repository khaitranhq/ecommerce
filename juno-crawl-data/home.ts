const Puppeteer = require('puppeteer');

interface Product {
  previewImgUrl?: string;
  productName?: string;
  cost?: number;
}

(async () => {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://juno.vn/');

//   const previewProductInfo: Product[] = await page.evaluate((): Product[] => {
  //   const previewProductElements: any[] = Array.from(
  //     document.querySelectorAll('.preview-block')
  //   );

  //   return previewProductElements.map((element) => {
  //     const productName = element
  //       .querySelector('.box-pro-detail > a')
  //       .textContent.replace(/\t*\n*/g, '');

  //     const cost = element
  //       .querySelector('.pro-price.highlight')
  //       .textContent.replace(/\t*\n*/g, '');

  //     const product: Product = {
  //       previewImgUrl: element.querySelector('img').getAttribute('src'),
  //       productName,
  //       cost
  //     };

  //     return product;
  //   });
  // });
  // console.log(previewProductInfo);

  await page.hover('[data-anmation="1"]');
  await page.hover(
    'label.Xanh.lá'
  );

  // const imgSrc = await page.evaluate(() => {
  //   const element = document.querySelector('#img-hover-1');
  //   return element.getAttribute('src');
  // });
  // console.log(imgSrc)

  await browser.close();
})();
