module Handler.WebService where

import Import
import Data.Maybe
import Handler.Game


data Page = Page 
	{ pageNumber :: GamePageNumber
	, gamePage :: GamePage
	} deriving (Show, Read)

instance ToJSON Page where
	toJSON (Page pageNumber (GamePage page decisions)) = 
		object
		["pageNumber" .= pageNumber
		,"page" .= object 
					["content" .= array (processPage page)
					,"decisions" .= array (processDecisionsList decisions)
					]
		]
		where
			processPage page = [ processContent p | p <- page]
			processContent (Paragraph paragraph) = object 
				["paragraph" .= paragraph
				,"type" .= ("Paragraph" :: String)
				]
			processContent (Image name isMonster) = object
				["name" .= name
				,"isMonster" .= isMonster
				,"type" .= ("Image" :: String)
				]
			processContent (Battle monsterName monsterSkill monsterLife) = object
				["monsterName" .= monsterName
				,"monsterSkill" .= monsterSkill
				,"monsterLife" .= monsterLife
				,"type" .= ("Battle" :: String)
				]
			processContent (Throw numberItems) = object
				["numberItems" .= numberItems
				,"type" .= ("Throw" :: String)
				]
			processContent (LossPoints pointsLost text) = object
				["pointsLost" .= pointsLost
				,"text" .= text
				,"type" .= ("LossPoints" :: String)
				]
			processDecisionsList decisions = [ processDecision d | d <- decisions]	
			processDecision (Decision nextPage decisionText) = object
				["nextPage" .= nextPage
				,"decisionText" .= decisionText
				]

getWebServiceR :: Int -> Handler Value
getWebServiceR pageNumber = do
	let gamePage = findPage pageNumber createPages
	returnJson $ Page pageNumber (fromJust gamePage)

postWebServiceR :: Int -> Handler Html
postWebServiceR = error "Not yet implemented: postWebServiceR"
