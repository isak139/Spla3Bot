# Discord.js v14 Slash Commands Bot for Splatoon3

Discord でスプラトゥーン 3 のステージ情報などを取得できる BOT です．スラッシュコマンドに対応しています．
こちらの[Spla3 API(β)](https://spla3.yuu26.com)を使用しています．

# Bot Setup

**Node.js v18 が必要です．**

-   `npm install` を実行．
-   root ディレクトリに`.env`ファイルを作成する．
    ```
    TOKEN="YOUR_BOT_TOKEN"
    CLIENT_ID="YOUR_CLIENT_ID"
    ```
-   `node index.js`を実行．
-   Enjoy!

# Bot Commands

| コマンド                                          | 詳細                                                         | 動作イメージ                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| /ping                                             | Pong\!                                                       | ![](https://i.imgur.com/yj18wpx.png)                                                                       |
| /stage \(regular\|open\|challenge\) \(now\|next\) | 現在あるいは次の指定したマッチのステージデータを表示します． | ![](https://i.imgur.com/49km5DP.png)                                                                       |
| /stage \(regular\|open\|challenge\) \(schedule\)  | 現在以降の指定したマッチのステージデータ一覧を表示します．   | ![](https://user-images.githubusercontent.com/61001713/200783176-5edd0584-cc0c-4a0a-96bd-5e7fe8d85c73.gif) |
| /coop \(now\|next\)                               | 現在あるいは次のサーモンランの情報を表示します．             | ![](https://i.imgur.com/EGP2v3i.png)                                                                       |
| /coop \(schedule\)                                | 現在以降のサーモンランの情報を表示します．                   | ![](https://user-images.githubusercontent.com/61001713/200782942-d5d252fe-63e7-478e-a8d1-6977aef73630.gif) |
| /random weapon                                    | ランダムにブキの情報を表示します．                           | ![](https://i.imgur.com/YVTJR6A.png/ra/)                                                                   |
| /random stage                                     | ランダムにステージを表示します．                             | ![](https://i.imgur.com/QcHqI37.png)                                                                       |
| /random rule                                      | ランダムにルールを表示します．                               | ![](https://i.imgur.com/vuEicsd.png)                                                                       |
