{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
{-# LANGUAGE TemplateHaskell   #-}
{-# LANGUAGE TypeFamilies      #-}
import           Yesod
import 		 Control.Applicative
import 		 Control.Monad
import           Network.Wai
import           Network.HTTP.Types
import 		 Data.HashMap.Strict
import           Data.Text (Text)


instance Yesod App where
    defaultLayout contents = do
        PageContent title headTags bodyTags <- widgetToPageContent contents
        giveUrlRenderer [hamlet|
            $doctype 5
            <html ng-app >
                <head>
                    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js">
                    <title>#{title}
                    ^{headTags}
                <body>
                    ^{bodyTags}
        |]


data Info = Info { info :: String  } 
                  deriving Show




instance FromJSON Info  where
   parseJSON (Object v) = Info <$> (v .: "name")
   parseJSON _          = mzero


instance ToJSON Info where
     toJSON (Info info) = object ["info" .= info]


data App = App
mkYesod "App" [parseRoutes|
/ HomeR GET
/service/ ServiceR GET
|]


getHomeR = do 
    defaultLayout $ do
     [whamlet|
       <div ng-controller="MonControleur">
         <h1>Hello {{info}}!
     |]
     toWidget [julius|
         function MonControleur($scope, $http) {
              $http({method: 'GET', url: 'http://localhost:3000/service'})
                 .success(function(data) { $scope.info = data.info; })
                 .error(function(data) { $scope.info = "erreur"; })

	        
     };
     |]

getServiceR :: Handler Value
getServiceR  = do 
     returnJson $ Info "toto"


main = warp 3000 App
