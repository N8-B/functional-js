var beerData = JSON.parse(document.getElementById("beerData").textContent);
var beers = beerData.beers;
var beerTemplate = document.getElementById("tmpl-beer-groups").textContent;
var beerList = document.getElementById("beerList");
var avgAbv = document.getElementById("averageAbv");
var filters = document.getElementById("filters");
var filterLinks = filters.querySelectorAll("a");

var fp = {};

function loadBeers(beers) {
  var beerGroups = fp.groupBy(beers, function (beer) {
    return beer.locale;
  });
  beerList.innerHTML = _.template(beerTemplate)({ beers: beerGroups });
  averageAbv.innerHTML = 'Average ABV: ' + getAverageAbv(beers) + '%';
}

function setActiveFilter(active) {
  for (i=0; i<filterLinks.length; i++) {
    filterLinks[i].classList.remove('btn-active');
  }
  active.classList.add('btn-active');
}

// fp.filter = function (arr, callback) {
//   var filtered = [];
//   for (i=0; i<arr.length; i++) {
//     if (callback(arr[i])) {
//       filtered.push(arr[i]);
//     }
//   }
//   return filtered;
// };

fp.map = function (arr, callback) {
  var mapped = [];
  for (i=0; i<arr.length; i++) {
    mapped.push(callback(arr[i]));
  }
  return mapped;
};

fp.reduce = function (arr, callback, initial) {
  var last = initial;
  for (i=0; i<arr.length; i++) {
    last = callback(last, arr[i]);
  }
  return last;
};

fp.pluck = function (arr, prop) {
  return fp.map(arr, function (item) {
    return item[prop];
  });
};

fp.groupBy = function (arr, callback) {
  var groups = {};
  var key;
  for (var i=0; i<arr.length; i++) {
    key = callback(arr[i]);
    if (groups[key]) {
      groups[key].push(arr[i]);
    } else {
      groups[key] = [arr[i]];
    }
  }
  return groups;
};

fp.add = function(a, b) {
  return a + b;
};

fp.mean = function (arr, prop) {
  if (typeof arr[0] === 'object') {
    arr = fp.pluck(arr, prop);
  }
  return fp.reduce(arr, fp.add, 0) / arr.length;
};

function roundDecimal(num, places) {
  var factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
}

function getAverageAbv(beers) {
  return roundDecimal(fp.mean(beers, 'abv'), 1);
}

loadBeers(beers);

filters.addEventListener('click', function (e) {
  e.preventDefault();
  var clicked = e.target;
  var filterName = clicked.dataset.filter;
  var i;

  setActiveFilter(clicked);

  switch (filterName) {
    case 'all':
      loadBeers(beers);
      break;
    case 'domestic':
      loadBeers(_.filter(beers, function (beer) {
        return beer.locale === 'domestic';
      }));
      break;
    case 'imports':
      loadBeers(_.filter(beers, function (beer) {
        return beer.locale === 'import';
      }));
      break;
    case 'ale':
      loadBeers(_.filter(beers, function (beer) {
        return beer.type === 'ale' || beer.type === 'ipa';
      }));
      break;
    case 'lager':
      loadBeers(_.filter(beers, function (beer) {
        return beer.type === 'lager';
      }));
      break;
    case 'stout':
      loadBeers(_.filter(beers, function (beer) {
        return beer.type === 'stout';
      }));
      break;
    case 'surprise':
      loadBeers([_.sample(beers)]);
      break;
  }

});
