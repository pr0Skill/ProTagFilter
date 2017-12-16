// ==UserScript==
// @name         ProTagFilter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pr0gramm.com/*
// ==/UserScript==

(function () {
  'use strict';

  var oldHref = document.location.href;
  // welche Tags ab welcher confidence ignoriert werden sollen halt
  var ignoreTags = [{
    tag: 'repost', // wer mag schon reposts?
    downvote: true, // automatisch runter Voten?
    skip: false, //überspringen
    confidenceThreshold: 0.85 // ab welcher confidence ( > mehr upvots < weniger )
  }, {
    tag: 'Wichteln 2017', // ¯\_(ツ)_/¯
    downvote: false, // muss nicht sein
    skip: true,
    confidenceThreshold: 0.2 // ab welcher confidence
  }];

  var base = 'https://pr0gramm.com/api/items/info?itemId=';

  setTimeout(function () {

    $(function () {

      var bodyList = document.querySelector("body");
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (oldHref != document.location.href) {
            oldHref = document.location.href;
            var currentUrl = window.location.href;
            var itemId = currentUrl.split('/')
              .pop();
            requestAPI(base + itemId);
          }
        });
      });

      var config = {
        childList: true,
        subtree: true
      };

      observer.observe(bodyList, config);

      function requestAPI(requestURL) {
        $.ajax({
            url: requestURL
          })
          .done(function (res) {
            if (res && res.tags && res.tags.length) {
              res.tags.map(function (tag) {
                ignoreTags.map(function (ignore) {
                  if (String(tag.tag).toLowerCase() == ignore.tag.toLowerCase() && tag.confidence >= ignore.confidenceThreshold) {
                    if (ignore.downvote) {
                      !$('.item-vote')
                        .hasClass('voted-down') && $('.item-vote .vote-down:visible')
                        .click()
                        .length
                    }
                    if (ignore.skip) {
                      $('.stream-next:visible')
                        .click();
                    }
                  }
                });
              });
            }
          })
          .fail(function (err) {
            console.log('Error: ' + err.status);
          });
      }

    });
  }, 1);

})();
