var $dealsPage = document.querySelector('.deals-page-container');
var $moreInfoPage = document.querySelector('.more-info-page-container');
var $backIcon = document.querySelector('.back-icon');
var $dealsButton = document.querySelector('.deals-button');

// function toggleFavorite() {
//   var inactive = 'fas fa-heart align-items-center favorite-icon inactive';
//   var active = 'fas fa-heart align-items-center favorite-icon active';

//   if (event.target.tagName !== 'I') {
//     return;
//   }

//   if (event.target.tagName === 'I' && event.target.className === inactive) {
//     event.target.className = active;
//   } else {
//     event.target.className = inactive;
//   }
// }

// document.addEventListener('click', toggleFavorite);

function goDealsPage() {
  viewSwapper('deals-page');
}

$dealsButton.addEventListener('click', goDealsPage);

function goBack(e) {
  if (data.view === 'more-info' && e.target.className === 'far fa-arrow-alt-circle-left back-icon') {
    viewSwapper('deals-page');
  } else if (data.view === 'deals-page' && e.target.className === 'far fa-arrow-alt-circle-left back-icon') {
    viewSwapper('home-page');
  }
}

$backIcon.addEventListener('click', goBack);

function hideBackOnHome() {
  if (data.view === 'home-page') {
    $backIcon.style.visibility = 'hidden';
  }
}

hideBackOnHome();

function getDealData() {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', 'https://www.cheapshark.com/api/1.0/deals?');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log('xhr status', xhr.status);
    console.log('xhr response', xhr.response);
    data.allDeals = xhr.response;

    for (var i = 0; i < data.allDeals.length; i++) {
      var dealInfo = data.allDeals[i];
      if (dealInfo.steamRatingPercent === '0') {
        dealInfo.steamRatingPercent = 'N/A';
      }
      if (dealInfo.metacriticScore === '0') {
        dealInfo.metacriticScore = 'N/A';
      }
      $dealsPage.appendChild(renderDealData(dealInfo));
    }
  });
  xhr.send();
}

getDealData();

function getMoreDealData(dealID) {
  var xhr = new XMLHttpRequest();
  var moreInfo = data.moreInfo;

  xhr.open('GET', 'https://www.cheapshark.com/api/1.0/deals?id=' + dealID);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log(xhr.response);
    data.dealMoreInfo = xhr.response;
    moreInfo.publisher = xhr.response.gameInfo.publisher;
    moreInfo.cheapestPrice = xhr.response.cheapestPrice.price;
    moreInfo.cheapestPriceDate = xhr.response.cheapestPrice.date;
    moreInfo.releaseDate = xhr.response.gameInfo.releaseDate;
    moreInfo.metacriticLink = xhr.response.gameInfo.metacriticLink;
    moreInfo.steamRatingText = xhr.response.gameInfo.steamRatingText;
    moreInfo.steamRatingCount = xhr.response.gameInfo.steamRatingCount;
    renderMoreDealData();
    $moreInfoPage.appendChild(renderMoreInfo());
    viewSwapper('more-info');
  });
  xhr.send();
}

function renderMoreDealData() {
  var moreInfo = data.moreInfo;
  var dealMoreInfo = data.dealMoreInfo;

  moreInfo.publisher = dealMoreInfo.gameInfo.publisher;
  moreInfo.cheapestPrice = dealMoreInfo.cheapestPrice.price;
  moreInfo.cheapestPriceDate = dealMoreInfo.cheapestPrice.date;
  moreInfo.releaseDate = dealMoreInfo.gameInfo.releaseDate;
  moreInfo.metacriticLink = dealMoreInfo.gameInfo.metacriticLink;
  moreInfo.steamRatingText = dealMoreInfo.gameInfo.steamRatingText;
  moreInfo.steamRatingCount = dealMoreInfo.gameInfo.steamRatingCount;

  if (moreInfo.steamRatingText === null || moreInfo.steamRatingText === 0) {
    moreInfo.steamRatingText = 'N/A';
  }

  if (moreInfo.releaseDate === 0) {
    moreInfo.releaseDate = 'N/A';
  }

}

function viewSwapper(dataView) {
  for (var i = 0; i < $viewList.length; i++) {
    if ($viewList[i].getAttribute('data-view') !== dataView) {
      $viewList[i].className = 'hidden';
    } else {
      $viewList[i].className = '';
    }
  }
  data.view = dataView;
  if (data.view === 'home-page') {
    $backIcon.style.visibility = 'hidden';
  } else {
    $backIcon.style.visibility = 'visible';
  }
}

function renderDealData(deal) {
  var $newContainer = document.createElement('div');
  $newContainer.setAttribute('class', 'newContainer');

  var $newDeal = document.createElement('div');
  $newDeal.setAttribute('class', 'deal-listing-container');
  $newContainer.appendChild($newDeal);

  var $dealInfoContainer = document.createElement('div');
  $dealInfoContainer.setAttribute('class', 'deal-info-container');
  $newDeal.appendChild($dealInfoContainer);

  var $row1 = document.createElement('div');
  $row1.setAttribute('class', 'row padding-top');
  $dealInfoContainer.appendChild($row1);

  var $columnHalf1 = document.createElement('div');
  $columnHalf1.setAttribute('class', 'column-half justify-content-center');
  $row1.appendChild($columnHalf1);

  var $thumb = document.createElement('img');
  $thumb.setAttribute('class', 'game-img');
  // API data
  $thumb.setAttribute('src', deal.thumb);
  $columnHalf1.appendChild($thumb);

  var $columnHalf2 = document.createElement('div');
  $columnHalf2.setAttribute('class', 'column-half text-align-center');
  $row1.appendChild($columnHalf2);

  var $gameTitle = document.createElement('h2');
  $gameTitle.setAttribute('class', 'game-title');
  // API data
  $gameTitle.textContent = deal.title;
  $columnHalf2.appendChild($gameTitle);

  var $row2 = document.createElement('div');
  $row2.setAttribute('class', 'row');
  $dealInfoContainer.appendChild($row2);

  var $columnHalf3 = document.createElement('div');
  $columnHalf3.setAttribute('class', 'column-half text-align-center margin-left');
  $row2.appendChild($columnHalf3);

  // Deal info section, will require API
  var $retail = document.createElement('h2');
  $retail.setAttribute('class', 'one-line');
  $retail.innerHTML = 'Retail: <span class="red-striked">$' + deal.normalPrice + '</span>';
  $columnHalf3.appendChild($retail);

  var $steamRatingPercent = document.createElement('h2');
  $steamRatingPercent.setAttribute('class', 'one-line');
  $steamRatingPercent.innerHTML = 'Steam: <span class="font-weight-normal">' + deal.steamRatingPercent + '</span>';
  $columnHalf3.appendChild($steamRatingPercent);

  var $metacriticScore = document.createElement('h2');
  $metacriticScore.setAttribute('class', 'one-line');
  $metacriticScore.innerHTML = 'Metacritic: <span class="font-weight-normal">' + deal.metacriticScore + '</span>';
  $columnHalf3.appendChild($metacriticScore);

  var $columnHalf4 = document.createElement('div');
  $columnHalf4.setAttribute('class', 'column-half text-align-center margin-right');
  $row2.appendChild($columnHalf4);

  var $newPrice = document.createElement('h2');
  $newPrice.setAttribute('class', 'one-line');
  $newPrice.innerHTML = 'New Price: <span class="green">$' + deal.salePrice + '</span>';
  $columnHalf4.appendChild($newPrice);

  var $savings = document.createElement('h2');
  $savings.setAttribute('class', 'one-line');
  $savings.textContent = parseFloat(deal.savings).toFixed(2) + '% off!';
  $columnHalf4.appendChild($savings);

  var $dealRating = document.createElement('h2');
  $dealRating.setAttribute('class', 'one-line');
  $dealRating.innerHTML = 'Deal Rating: <span class="font-weight-normal">' + deal.dealRating + '</span>';
  $columnHalf4.appendChild($dealRating);

  var $row3 = document.createElement('div');
  $row3.setAttribute('class', 'row margin-left');
  $newDeal.appendChild($row3);

  var $colThird1 = document.createElement('div');
  $colThird1.setAttribute('class', 'column-third justify-content-center align-items-center padding-top');
  $row3.appendChild($colThird1);

  var $icon1 = document.createElement('i');
  $icon1.setAttribute('class', 'fas fa-shopping-cart cart-icon');
  $colThird1.appendChild($icon1);

  var $colThird2 = document.createElement('div');
  $colThird2.setAttribute('class', 'column-third justify-content-center align-items-center padding-top');
  $row3.appendChild($colThird2);

  var $icon2 = document.createElement('i');
  $icon2.setAttribute('class', 'fas fa-info-circle info-icon');
  $icon2.setAttribute('data-dealId', deal.dealID);
  $icon2.addEventListener('click', function (e) {
    getMoreDealData(e.target.getAttribute('data-dealId'));

    var moreInfo = data.moreInfo;
    moreInfo.title = deal.title;
    moreInfo.gameID = deal.gameID;
    moreInfo.gameImg = deal.thumb;
    moreInfo.normalPrice = deal.normalPrice;
    moreInfo.salePrice = deal.salePrice;
    moreInfo.percentOff = deal.savings;
    moreInfo.steamRating = deal.steamRatingPercent;
    moreInfo.metacriticScore = deal.metacriticScore;
    moreInfo.dealRating = deal.dealRating;
    moreInfo.dealID = deal.dealID;
    moreInfo.metacriticLink = deal.metacriticLink;
    moreInfo.steamRatingCount = deal.steamRatingCount;

  });
  $colThird2.appendChild($icon2);

  var $colThird3 = document.createElement('div');
  $colThird3.setAttribute('class', 'column-third justify-content-center align-items-center padding-top');
  $row3.appendChild($colThird3);

  var $icon3 = document.createElement('i');
  $icon3.setAttribute('class', 'fas fa-heart align-items-center favorite-icon inactive');
  $colThird3.appendChild($icon3);

  return $newContainer;
}

function renderMoreInfo() {
  var moreInfo = data.moreInfo;

  var $moreInfoContainer = document.createElement('div');
  $moreInfoContainer.setAttribute('class', 'more-info-container');

  var $info1 = document.createElement('div');
  $info1.setAttribute('class', 'info-1 roboto');
  $moreInfoContainer.appendChild($info1);
  // API title
  var $gameTitleInfo = document.createElement('h3');
  $gameTitleInfo.setAttribute('class', 'text-align-center game-title-info roboto margin-bottom padding-top margin-info');
  $gameTitleInfo.textContent = moreInfo.title;
  $info1.appendChild($gameTitleInfo);

  var $infoRow1 = document.createElement('div');
  $infoRow1.setAttribute('class', 'row margin-info text-align-center');
  $info1.appendChild($infoRow1);

  var $infoColumnHalf1 = document.createElement('div');
  $infoColumnHalf1.setAttribute('class', 'column-half');
  $infoRow1.appendChild($infoColumnHalf1);
  // API img
  var $infoImg = document.createElement('img');
  $infoImg.setAttribute('class', 'game-img');
  $infoImg.setAttribute('src', data.moreInfo.gameImg);
  $infoColumnHalf1.appendChild($infoImg);
  // API steam rating
  var $infoSteamRating = document.createElement('h3');
  $infoSteamRating.setAttribute('class', 'no-margin padding-top one-line');
  $infoSteamRating.innerHTML = 'Steam Rating: <span class="font-weight-normal">' + moreInfo.steamRating + '</span></h3>';
  $infoColumnHalf1.appendChild($infoSteamRating);
  // API metacritic score
  var $infoMetacriticScore = document.createElement('h3');
  $infoMetacriticScore.setAttribute('class', 'no-margin padding-top one-line');
  $infoMetacriticScore.innerHTML = 'Metacritic Score: <span class="font-weight-normal">' + moreInfo.metacriticScore + '</span></h3>';
  $infoColumnHalf1.appendChild($infoMetacriticScore);

  var $infoColumnHalf2 = document.createElement('div');
  $infoColumnHalf2.setAttribute('class', 'column-half');
  $infoRow1.appendChild($infoColumnHalf2);

  var $infoRetail = document.createElement('h3');
  $infoRetail.setAttribute('class', 'margin-price one-line');
  $infoRetail.innerHTML = 'Retail: <span class="red-striked">$' + moreInfo.normalPrice + '</span></h3>';
  $infoColumnHalf2.appendChild($infoRetail);

  var $infoNewPrice = document.createElement('h3');
  $infoNewPrice.setAttribute('class', 'no-margin padding-bottom');
  $infoNewPrice.innerHTML = 'New Price: <span class="green">$' + moreInfo.salePrice + '</span></h3>';
  $infoColumnHalf2.appendChild($infoNewPrice);

  var $infoPercentage = document.createElement('h3');
  $infoPercentage.setAttribute('class', 'no-margin padding-top-info padding-bottom-2');
  $infoPercentage.textContent = parseFloat(moreInfo.percentOff).toFixed(2) + '% off!';
  $infoColumnHalf2.appendChild($infoPercentage);

  var $infoDealRating = document.createElement('h3');
  $infoDealRating.setAttribute('class', 'no-margin padding-top margin-bottom');
  $infoDealRating.innerHTML = 'Deal Rating: <span class="font-weight-normal">' + moreInfo.dealRating + '</span></h3>';
  $infoColumnHalf2.appendChild($infoDealRating);

  var $info2 = document.createElement('div');
  $info2.setAttribute('class', 'info-2 margin-top text-align-center roboto');
  $moreInfoContainer.appendChild($info2);

  var $infoRow2 = document.createElement('div');
  $infoRow2.setAttribute('class', 'row');
  $info2.appendChild($infoRow2);

  var $info2ColumnHalf1 = document.createElement('div');
  $info2ColumnHalf1.setAttribute('class', 'column-half text-align-end');
  $infoRow2.appendChild($info2ColumnHalf1);

  var $publisher = document.createElement('h3');
  $publisher.textContent = 'Publisher:';
  $info2ColumnHalf1.appendChild($publisher);

  var $releaseDate = document.createElement('h3');
  $releaseDate.textContent = 'Release Date:';
  $info2ColumnHalf1.appendChild($releaseDate);

  var $metacriticLink = document.createElement('h3');
  $metacriticLink.textContent = 'Metacritic Link:';
  $info2ColumnHalf1.appendChild($metacriticLink);

  var $steamReviews = document.createElement('h3');
  $steamReviews.textContent = 'Steam Reviews:';
  $info2ColumnHalf1.appendChild($steamReviews);

  var $reviewCount = document.createElement('h3');
  $reviewCount.textContent = 'Review Count:';
  $info2ColumnHalf1.appendChild($reviewCount);

  var $cheapestPrice = document.createElement('h3');
  $cheapestPrice.textContent = 'Cheapest Price:';
  $info2ColumnHalf1.appendChild($cheapestPrice);

  var $cheapestDate = document.createElement('h3');
  $cheapestDate.textContent = 'Date:';
  $info2ColumnHalf1.appendChild($cheapestDate);

  var $info2ColumnHalf2 = document.createElement('div');
  $info2ColumnHalf2.setAttribute('class', 'column-half text-align-left');
  $infoRow2.appendChild($info2ColumnHalf2);

  var $publisherAPI = document.createElement('h3');
  $publisherAPI.setAttribute('class', 'font-weight-normal');
  $publisherAPI.textContent = data.moreInfo.publisher;
  $info2ColumnHalf2.appendChild($publisherAPI);

  var $releaseAPI = document.createElement('h3');
  $releaseAPI.setAttribute('class', 'font-weight-normal');
  $releaseAPI.textContent = data.moreInfo.releaseDate;
  $info2ColumnHalf2.appendChild($releaseAPI);
  // come back to this
  var $metacriticLinkAPI = document.createElement('h3');
  $metacriticLinkAPI.setAttribute('class', 'font-weight-normal');
  $metacriticLinkAPI.textContent = 'Crysis';
  $info2ColumnHalf2.appendChild($metacriticLinkAPI);

  var $steamReviewsAPI = document.createElement('h3');
  $steamReviewsAPI.setAttribute('class', 'font-weight-normal');
  $steamReviewsAPI.textContent = data.moreInfo.steamRatingText;
  $info2ColumnHalf2.appendChild($steamReviewsAPI);

  var $reviewCountAPI = document.createElement('h3');
  $reviewCountAPI.setAttribute('class', 'font-weight-normal');
  $reviewCountAPI.textContent = data.moreInfo.steamRatingCount;
  $info2ColumnHalf2.appendChild($reviewCountAPI);

  var $cheapestPriceAPI = document.createElement('h3');
  $cheapestPriceAPI.setAttribute('class', 'font-weight-normal');
  $cheapestPriceAPI.textContent = data.moreInfo.cheapestPrice;
  $info2ColumnHalf2.appendChild($cheapestPriceAPI);

  var $cheapestDateAPI = document.createElement('h3');
  $cheapestDateAPI.setAttribute('class', 'font-weight-normal');
  $cheapestDateAPI.textContent = data.moreInfo.cheapestPriceDate;
  $info2ColumnHalf2.appendChild($cheapestDateAPI);

  return $moreInfoContainer;
}

var $viewList = document.querySelectorAll('div[data-view');
