module Handler.InitGame where

import Import
import Handler.Forms

import Data.Text (pack)

getInitGameR :: Handler Html
getInitGameR = do
	-- Génération du 'form' qui va s'afficher pour initialiser le joueur
	(formWidget, enctype) <- generateFormPost characterForm
	defaultLayout $ do
		setTitle "Set Game"
		$(widgetFile "initGame")

postInitGameR :: Handler Html
postInitGameR = do
    ((result, formWidget), enctype) <- runFormPost characterForm
    case result of
        FormSuccess person -> do
            setSession "person" (pack $ show person)
            deleteSession "currentPage"
            redirect $ GameR
        
        _ -> defaultLayout $ do
                setTitle "Set Game"
                $(widgetFile "initGame")