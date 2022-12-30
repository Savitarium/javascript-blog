'use strict';
{
    /*document.getElementById('test-button').addEventListener('click', function(){
        const links = document.querySelectorAll('.titles a');
    });*/
    const titleClickHandler = function (event){
        event.preventDefault();
        /* [DONE] remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll('.titles a.active');

        for(let activeLink of activeLinks){
            activeLink.classList.remove('active');
        }
        /* [DONE] add class 'active' to the clicked link */
        this.classList.add('active');
        /* [DONE] remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.posts .active');

        for(let activeArticle of activeArticles){
            activeArticle.classList.remove('active');
        }
        /* [DONE] get 'href' attribute from the clicked link */
        const articleSelector = this.getAttribute('href');
        /* [DONE] find the correct article using the selector (value of 'href' attribute) */
        const targetArticle = document.querySelector(articleSelector);
        /* add class 'active' to the correct article */
        targetArticle.classList.add('active');
    }

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles',
        optArticleTagsSelector = '.post-tags .list',
        optArticleAuthorSelector = '.post-author',
        optTagsListSelector = '.tags.list',
        optAuthorsListSelector = '.authors.list',
        optCloudClassCount = 5,
        optCloudClassPrefix = 'tag-size-'

    function generateTitleLinks(customSelector = ''){
        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        function clearMessages(){
            titleList.innerHTML = '';
        }
        clearMessages();
        /* for each article */
        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        let html = '';
        for(let article of articles) {
            /* get the article id */
            const articleID = article.getAttribute('id');
            /* find the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            /* get the title from the title element */

            /* create html of the link */
            const linkHTML = '<li><a href="#' + articleID + '"><span>' + articleTitle + '</span></a></li>';
            html = html + linkHTML
            /* insert link into titleList */
            titleList.innerHTML = html;
        }
        const links = document.querySelectorAll('.titles a');

        for(let link of links){
            link.addEventListener('click', titleClickHandler);
        }
    }
    generateTitleLinks();

    function calculateTagsParams(tags){
        const params = {max: 0, min: 99999 };
        for(let tag in tags){
            if(tags[tag] > params.max){
                params.max = tags[tag];
            }
            if(tags[tag] < params.min){
                params.min = tags[tag];
            }
        }

        return params;
    }
    calculateTagsParams();

    function calculateTagClass(count, params){
        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min;
        const percentage = normalizedCount / normalizedMax;
        const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
        return classNumber;
    }
    function generateTags() {
        /* [NEW] create a new variable allTags with an empty object */
        let allTags = {};
        /* find all articles */
        const articles = document.querySelectorAll(optArticleSelector)

        /* START LOOP: for every article: */
        for(let article of articles) {
            /* find tags wrapper */
            const tagList = article.querySelector(optArticleTagsSelector);
            /* make html variable with empty string */
            let html = '';
            /* get tags from data-tags attribute */
            const articleTags = article.getAttribute('data-tags');
            /* split tags into array */
            const articleTagsArray = articleTags.split(' ');
            /* START LOOP: for each tag */
            for(let tag of articleTagsArray) {
                /* generate HTML of the link */
                const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
                /* add generated code to html variable */
                html = html + linkHTML
                /* [NEW] check if this link is NOT already in allTags */
                if(!allTags[tag]) {
                    /* [NEW] add tag to allTags object */
                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }
                /* END LOOP: for each tag */
            }
            /* insert HTML of all the links into the tags wrapper */
            tagList.innerHTML = html;
            /* END LOOP: for every article: */
        }
        /* [NEW] find list of tags in right column */
        const tagList = document.querySelector(optTagsListSelector);

        /* [NEW] create variable for all links HTML code */
        const tagsParams = calculateTagsParams(allTags);
        let allTagsHTML = '';

        /* [NEW] START LOOP: for each tag in allTags: */
        for(let tag in allTags){
            /* [NEW] generate code of a link and add it to allTagsHTML */
            allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + ' ' + '</a></li>';
        }
        /* [NEW] END LOOP: for each tag in allTags: */

        /*[NEW] add HTML from allTagsHTML to tagList */
        tagList.innerHTML = allTagsHTML;
    }
    generateTags();

    function tagClickHandler(event) {
        /* prevent default action for this event */
        event.preventDefault();
        /* make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;
        /* make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');
        /* make a new constant "tag" and extract tag from the "href" constant */
        const tag = href.replace('#tag-', '');
        /* find all tag links with class active */
        const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
        /* START LOOP: for each active tag link */
        for(let activeTag of activeTags) {
            /* remove class active */
            activeTag.classList.remove('active');
            /* END LOOP: for each active tag link */
        }
        /* find all tag links with "href" attribute equal to the "href" constant */
        const allTags = document.querySelectorAll('a[href="' + href + '"]');
        /* START LOOP: for each found tag link */
        for (let allTag of allTags) {
            /* add class active */
            allTag.classList.add('active');
            /* END LOOP: for each found tag link */
        }
        /* execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-tags~="' + tag + '"]');
    }
    function addClickListenersToTags() {
        /* find all links to tags */
        const tagLinks = document.querySelectorAll('.post-tags .list a');
        /* START LOOP: for each link */
        for(let tagLink of tagLinks) {
            /* add tagClickHandler as event listener for that link */
            tagLink.addEventListener('click', tagClickHandler);
            /* END LOOP: for each link */
        }
    }
    addClickListenersToTags();
    function generateAuthors() {
        let allAuthors = {};
        /* find all articles */
        const articles = document.querySelectorAll(optArticleSelector)
        /* START LOOP: for every article: */
        for(let article of articles) {
            /* find authors wrapper */
            const authorList = article.querySelector(optArticleAuthorSelector);
            /* make html variable with empty string */
            let html = '';
            const author = article.getAttribute('data-author');
            /* get authors from data-tags attribute */
            const articleAuthor = article.getAttribute('data-author');
            /* generate HTML of the link */
            const linkHTML = '<p class="post-author"><a href="#author-' + author + '">' + author + '</a></p>';
            /* add generated code to html variable */
            html = html + linkHTML;
            /* [NEW] check if this link is NOT already in allTags */
            if(!allAuthors[author]){
                /* [NEW] add generated code to allTags array */
                allAuthors[author] = 1;
            } else {
                allAuthors[author]++;
            }
            /* insert HTML of all the links into the tags wrapper */
            authorList.innerHTML = html;
            /* END LOOP: for every article: */
        }
        const authorsList = document.querySelector(optAuthorsListSelector);
        const authorsParams = calculateTagsParams(allAuthors);
        let allAuthorsHTML = '';
        for(let author in allAuthors){
            allAuthorsHTML += '<li><a href="#tag-' + author + '" class="' + optCloudClassPrefix + calculateTagClass(allAuthors[author], authorsParams) + '">' + author + ' ' + '</a></li>';
        }
        authorsList.innerHTML = allAuthorsHTML;
        console.log(authorsList);
    }
    generateAuthors();

    function authorClickHandler(event) {
        /* prevent default action for this event */
        event.preventDefault();
        /* make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;
        /* make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');
        /* make a new constant "author" and extract author from the "href" constant */
        const author = href.replace('#author-', '');
        /* find all author links with class active */
        const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
        /* START LOOP: for each active author link */
        for(let activeAuthor of activeAuthors) {
            /* remove class active */
            activeAuthor.classList.remove('active');
            /* END LOOP: for each active tag link */
        }
        /* find all authors links with "href" attribute equal to the "href" constant */
        const allAuthors = document.querySelectorAll('a[href="' + href + '"]');
        /* START LOOP: for each found author link */
        for (let allAuthor of allAuthors) {
            /* add class active */
            allAuthor.classList.add('active');
            /* END LOOP: for each found tag link */
        }
        /* execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-author="' + author + '"]');
    }
    function addClickListenersToAuthors () {
        /* find all links to tags */
        const authorLinks = document.querySelectorAll('.post-author a');
        /* START LOOP: for each link */
        for(let authorLink of authorLinks) {
            /* add authorClickHandler as event listener for that link */
            authorLink.addEventListener('click', authorClickHandler);
            /* END LOOP: for each link */
        }
    }
    addClickListenersToAuthors();
}