const puppeteer = require('puppeteer');

interface Province {
  value: string;
  text: string;
}

interface Store {
  address?: string;
  district?: string;
  infoTime?: string;
  infoHotline?: string;
  infoStatus?: string;
  imgStoreSrc?: string;
}

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto('https://juno.vn/blogs/he-thong-cua-hang');

  const provinces: Province[] = await page.evaluate(() => {
    const result: any[] = Array.from(
      document.querySelectorAll('select[name="change-tinh"] > option')
    );

    return result.map(
      (element): Province => ({
        value: element.getAttribute('value'),
        text: element.textContent
      })
    );
  });

  for (let i = 1; i < provinces.length; ++i) {
    console.log('==============', provinces[i].text, '=========');
    await page.select('select[name="change-tinh"]', provinces[i].value);

    await page.waitForTimeout(1000);

    const stores: Array<Store> = await page.evaluate(
      (): Array<Store> => {
        const storesElements = Array.from(
          document.querySelectorAll('.itemStore')
        );

        const storeClass: Store = {
          district: 'districtStore > a > span',
          address: 'infoAddres',
          infoTime: 'infoTime',
          infoHotline: 'infoHotline',
          infoStatus: 'infoStatus'
        };
        return storesElements.map(
          (elementStore): Store => {
            const store: Store = {};
            Object.entries(storeClass).forEach(
              ([key, value]: [string, string]) => {
                const subElement = elementStore.querySelector(`.${value}`);
                if (subElement) store[key] = subElement.textContent;
              }
            );

            const imgStoreSrc: string = elementStore
              .querySelector('.viewShowroom > span > img')
              .getAttribute('src');
            store.imgStoreSrc = imgStoreSrc;

            return store;
          }
        );
      }
    );
    console.log(stores);
  }

  await browser.close();
})();
