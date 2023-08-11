import axios from 'axios';
import fs from 'fs';

// データを取得するコレクションのコントラクトアドレス
const contractAddress = "0x327879ED99ea43Cf0a7a31034eDF7C8F17D63FbD"

/**
 * メイン処理
 */
async function main() {
	let whileLoopFlag = true;
	let firstTimeFlag = true;
	let pageKey = '';	//APIが返す改ページ用のキー

	// 出力ファイルの準備 "w"->「書き込みで開く。既存ファイルは削除される。」モード
	fs.open('Sales.csv', "w", (err, fd) => {
		if (err) { console.log("ファイルが開けない"); }
	});
	fs.appendFileSync('Sales.csv', `date,tokenId,from,to,price\n`)

	//pageKey（改ページフラグ）が出なくなるまでループ
	try {
		while (whileLoopFlag) {

			let output = ""
			// 初回は「pageKeyなし」２回目からは「pageKeyあり」を検索条件（引数）にする
			if (firstTimeFlag) {
				output = await getData(pageKey)
				firstTimeFlag = false
			} else {
				output = await getData(pageKey)
			}

			// データの格納
			let sales = output.sales;

			// ファイルへの書き出し
			for (const data of sales) {
				fs.appendFileSync('Sales.csv', `${new Date(data.timestamp * 1000)},${data.token.tokenId},${data.from},${data.to},${data.price.amount.decimal}\n`)
			}

			// pageKeyの格納
			pageKey = output.continuation

			//pageKeyが出なくなったらループを抜ける
			if (pageKey == null || pageKey == '') {
				whileLoopFlag = false
			}
		}
	} catch (e) {
		console.error("エラー：", e.message);
	}
}

/**
 * APIを叩く関数
 */
async function getData(pageKey) {
	let outputData = []
	let options

	// 検索条件の設定 初回と2回目以降で分岐
	if (pageKey == '') {
		options = {
			method: 'GET',
			url: 'https://api.reservoir.tools/sales/v6',
			params: {
				contract: '0x327879ED99ea43Cf0a7a31034eDF7C8F17D63FbD',
			},
			headers: { accept: '*/*', 'x-api-key': process.env.RESERVOIR_API_KEY }
		};
	} else {
		options = {
			method: 'GET',
			url: 'https://api.reservoir.tools/sales/v6',
			params: {
				contract: contractAddress,
				continuation: `${pageKey}`
			},
			headers: { accept: '*/*', 'x-api-key': process.env.RESERVOIR_API_KEY }
		};
	}

	//APIを叩く
	await axios
		.request(options)
		.then(function (response) {
			outputData = response.data
		})
		.catch(function (error) {
			console.error(error);
		});

	return outputData;

}

main()