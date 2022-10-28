export interface NavLinkViewModel {
  next: {
    slug: string
    title: string
  }
  prev: {
    slug: string
    title: string
  }
}

/**
 * 記事リストと現在の記事番号から、前後のナビゲーション用のオブジェクトを組み立てて返却する
 * TODO: 単体テスト書く
 *
 * @returns NavLink
 */
export const buildNavLinkViewModel = (
  articleList: TODO[],
  currentIndex: number
): NavLinkViewModel => {
  let nextIndex: number, prevIndex: number

  // 最初の記事でなければ次（未来）の記事が存在
  if (currentIndex !== 0) nextIndex = currentIndex - 1

  // 最後の記事でなければ前（過去）の記事が存在
  if (currentIndex !== articleList.length - 1) prevIndex = currentIndex + 1

  const navLink: NavLinkViewModel = {
    next: {
      title: articleList[nextIndex]?.properties.Page.title[0]?.plain_text || '',
      slug: articleList[nextIndex]?.properties.Slug.rich_text[0].plain_text || '',
    },
    prev: {
      title: articleList[prevIndex]?.properties.Page.title[0]?.plain_text || '',
      slug: articleList[prevIndex]?.properties.Slug.rich_text[0].plain_text || '',
    },
  }

  return navLink
}
