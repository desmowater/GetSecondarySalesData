# GetSecondarySalesData
2次売買のデータを取得するnode.js用のプログラムです。
取得元はReseroirが提供しているSales APIです。

https://docs.reservoir.tools/reference/getsalesv6

## 準備
- ローカルリポジトリにクローンしたら、ターミナルに```npm i```と打ち込んで、必要なパッケージをインストールしてください。
- ```.env_tenplate```を```.env```にリネームして、ReseroirのAPIキーを記入してください。APIキーはダッシュボードからサインアップすれば無料で取得できます。
https://dashboard.reservoir.tools/
- ```getSales.js```の7行目に対象のコントラクトアドレスを記入してください。


## データの取得
- ターミナルに```node getSales```と入力すると、```Sales.csv```というファイルにデータが書き出されます。
