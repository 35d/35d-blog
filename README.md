# これは何？
 - [@___35d](https://twitter.com/___35d) の個人ブログ blog.35d.jp のソースコードです
 - [Next.js](https://nextjs.org/) + [Notion API](https://developers.notion.com/) を使って作られています

# ローカルで動かす場合
- `env.local` というファイルに、 `NOTION_TOKEN=XXX` `NOTION_DATABASE_ID=YYY` をそれぞれ追記
- データベースに必要なプロパティに制約があるので、ソースコードを読んでよしなにデータベース側のプロパティを変更
- books と stock-articles のページも別のデータベース ID （公開ページなので環境変数化していない）を使用しているので、とりあえずビルド通すだけならページ削除して始めるのがオススメ
- ローカルの場合、 `IS_DEVELOPMENT` で分岐してる箇所でモックのデータを返すようにしている部分があるので注意


# デプロイする場合
- ビルドするサービス（GitHub Actions や Vercel）にも同じく環境変数をセットすること

# 投げ銭
https://buy.stripe.com/8wM8Addc9e6N9JSaEE