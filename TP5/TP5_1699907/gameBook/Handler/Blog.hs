module Handler.Blog
    ( getBlogR
    , postBlogR
    )
where

import Import

data ArticleForm = ArticleForm {
    myNumber :: Int,
    myContent :: Textarea
}

-- The view showing the list of articles
getBlogR :: Handler Html
getBlogR = do
    -- Get the list of articles inside the database.
    articles <- runDB $ selectList [] [Desc ArticleNumber]
    -- We'll need the two "objects": articleWidget and enctype
    -- to construct the form (see templates/articles.hamlet).
    (articleWidget, enctype) <- generateFormPost entryForm
    defaultLayout $ do
        $(widgetFile "articles")

postBlogR :: Handler Html
postBlogR = do
    ((res,articleWidget),enctype) <- runFormPost entryForm
    case res of
         FormSuccess article -> do
            let number = myNumber article
            let contentOfArticle = unTextarea $ myContent article
            articleId <- runDB $ insert $ Article number contentOfArticle
            setMessage $ toHtml $ (show $ myNumber article) <> " created"
            redirect $ ArticleR articleId
         _ -> defaultLayout $ do
                setTitle "Please correct your entry form"
                $(widgetFile "articleAddError")

entryForm :: Form ArticleForm
entryForm = renderDivs $ ArticleForm
    <$> areq   intField "Number" Nothing
    <*> areq   textareaField "Content" Nothing