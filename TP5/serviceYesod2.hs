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
import           Data.List (find)


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


data Prof = Prof { nom :: String,
                   cours :: [Text]  } 
                  deriving Show


instance ToJSON Prof where
     toJSON (Prof nom cours) = object ["nom" .= nom,
                                       "cours" .= array cours ]

data App = App
mkYesod "App" [parseRoutes|
/ HomeR GET
/service/#Int ServiceR GET
|]


getHomeR = do 
    defaultLayout $ do
     [whamlet|
       <div ng-controller="MonControleur">
         <p> Quel professeur?  #
            <select ng-model="id" ng-change="chercher()">
                <option value="1">Michel Gagnon
                <option value="2">Michel Desmarais
                <option value="3">Michel Dagenais

         <h2>Les cours du professeur {{nom}}:
         <ul>
            <li ng-repeat="c in cours"> {{c}}
     |]
     toWidget [julius|
         function MonControleur($scope, $http) {
              $scope.chercher = function() {
                 $http({method: 'GET', url: 'http://localhost:3000/service/' + $scope.id})
                   .success(function(data) {
                          $scope.nom = data.nom;
                          $scope.cours = data.cours })
                   .error(function(data) { $scope.nom = "erreur"; })}
         };
     |]

getServiceR :: Int -> Handler Value
getServiceR id  = do 
     returnJson $ extraire $ find (condition id) professeurs
     where
       condition id (idProf, prof) = id == idProf
      
       extraire Nothing = Prof "" []
       extraire (Just (id,p)) = p



professeurs :: [(Int, Prof)]
professeurs = [
      (1,Prof "Michel Gagnon" ["log4420", "inf6410", "inf4215"]),
      (2,Prof "Michel Desmarais" ["log2420", "inf6304", "inf8007"]),
      (3,Prof "Michel Dagenais" ["inf2610", "inf4410", "inf8601"]) ]

main = warp 3000 App