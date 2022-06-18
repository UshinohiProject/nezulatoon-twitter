var endpoint = "https://api.twitter.com/2/tweets";

// 認証用URL取得
function getOAuthURL() {
  Logger.log(getTwitterService().authorize());
}

function getTwitterService() {
  return OAuth1.createService("Nezulatoon")
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
    // 設定した認証情報をセット
    .setConsumerKey(PropertiesService.getScriptProperties().getProperty("API_KEY"))
    .setConsumerSecret(PropertiesService.getScriptProperties().getProperty("API_KEY_SECRET"))
    .setCallbackFunction('authCallback')
    // 認証情報をプロパティストアにセット（これにより認証解除するまで再認証が不要になる）
    .setPropertyStore(PropertiesService.getUserProperties());
}

//  認証成功時に呼び出される処理を定義
function authCallback(request) {
  var twitterService = getTwitterService(request.parameter.serviceName);
  var isAuthorized = twitterService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('認証が正常に終了しました');
  } else {
    return HtmlService.createHtmlOutput('認証がキャンセルされました');
  }
}

function toTweet() {
     //トークン確認
  var service = getTwitterService();
  if (!service.hasAccess()) {
    //認証画面を出力
    console.log("認証できていない");
  } else {
    //認証済みなので終了する
    console.log("認証できている");
  }
 
  //message本文
  var message = {
    //テキストメッセージ本文
    text: 'Aniiは頑張っている、とっても'
  }
 
  //リクエストオプション
  var options = {
    "method": "post",
    "muteHttpExceptions" : true,
    'contentType': 'application/json',
    'payload': JSON.stringify(message)
  }

  console.log(endpoint);
  console.log(options);
 
  //リクエスト実行
  var response = JSON.parse(service.fetch(endpoint, options));
 
  //リクエスト結果
  console.log(response);
}

// function myFunction() {
//   // 対象のスプレッドシートを取得
//   var spread = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SHEET_URL"));
//   // スプレッドシート内のシート一覧を取得
//   var sheets = spread.getSheets();
//   // 指定したシート(1番目)の左上に書き込み
//   sheets[0].getRange(1, 1).setValue('test');
// }

/*ここからツイートの取得用コード*/
// タイムライン取得用のAPIを起動する関数
function getTimeLine(query) {

  //クエリ設定
  //var query="%23nezulatoon_YAEGAKI";

  //言語設定
  var lang="ja";

  var spread = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SHEET_URL"));

  //シート名は任意
  var sheet = spread.getSheetByName('シート1');

  //スプレッドシート書き込みのために最終行取得
  const AValues = sheet.getRange('A:A').getValues();　 //A列の値取得
  var LastRow = AValues.filter(String).length;　　//空白の要素を除いた長さを取得

  var twitterService = getTwitterService();

  if (twitterService.hasAccess()) {
    // 検索結果取得
    var twMethod = { method:"GET" };
    var json = twitterService.fetch(endpoint+"/search/recent?query="+query, twMethod);

    // json形式で返ってくるのでパース
    var array = JSON.parse(json);
        Logger.log(array);

    for (var i=0; i<array["data"].length; i++){
    var content = array["data"][i]["text"];
　　//ふつうは意味ないけど、デバック用にログに出力してる
    console.log(content);

　　//ここでcontentを書き込む
    sheet.getRange(LastRow+1,1).setValue(content);
    //console.log(LastRow);
    LastRow++;
  }
  // 取得した項目をログに表示
    Logger.log(array);
    return i;
  } else {
  Logger.log(service.getLastError());
  }
}

function countHushTags(){
  var numYAEGAKI = getTimeLine("%23nezulatoon_YAEGAKI");
  var numNEZUGINZA = getTimeLine("%23nezulatoon_NEZUGINZA");
  var numNEZUMIYANAGA = getTimeLine("%23nezulatoon_NEZUMIYANAGA");
  console.log(numYAEGAKI);
  console.log(numNEZUGINZA);
  console.log(numNEZUMIYANAGA);
}