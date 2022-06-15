// 認証用URL取得
function getOAuthURL() {
  Logger.log(getTwitterService().authorize());
}
 
// サービス取得
function getTwitterService() {
  return OAuth1.createService('nezulatoon')
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
  // 設定した認証情報をセット
    .setConsumerKey(PropertiesService.getScriptProperties().getProperty("API_KEY"))
    .setConsumerSecret(PropertiesService.getScriptProperties().getProperty("API_KEY_SECRET"))
    .setCallbackFunction(PropertiesService.getScriptProperties().getProperty('authCallback'))
  // 認証情報をプロパティストアにセット（これにより認証解除するまで再認証が不要になる
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