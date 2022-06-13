function getTwitterService(serviceName) {
  return OAuth1.createService(serviceName)
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
    .setConsumerKey("API_KEY")
    .setConsumerSecret("API_KEY_SECRET")
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties());
}

function authCallback(request) {
  var twitterService = getTwitterService(request.parameter.serviceName);
  var isAuthorized = twitterService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('認証が正常に終了しました');
  } else {
    return HtmlService.createHtmlOutput('認証がキャンセルされました');
  }
}

function doGet(e) {
  var twitterService = getTwitterService(e.parameter.screenName);
  var template;
  if (!twitterService.hasAccess()) {
    var authorizationUrl = twitterService.authorize();
    template = HtmlService.createTemplateFromFile("index");
    template.authorizationUrl = authorizationUrl;
  } else {
    template = HtmlService.createTemplateFromFile("completed");
  }
  return template.evaluate();
}