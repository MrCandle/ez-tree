import { EzTreePage } from './app.po';

describe('ez-tree App', () => {
  let page: EzTreePage;

  beforeEach(() => {
    page = new EzTreePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
