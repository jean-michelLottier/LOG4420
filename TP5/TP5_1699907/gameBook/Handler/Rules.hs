module Handler.Rules where

import Import

getRulesR :: Handler Html
getRulesR = 
	defaultLayout $ do
		setTitle "Règles"
		$(widgetFile "rules")

