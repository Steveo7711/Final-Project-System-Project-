// don't write code that executes automatically...
// except for adding event listeners.
// and declaring functions

// found this function on the internet
function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1].replace(/\+/g, " ");  // decode + as space
      }
  }
}

function buildCheatsheets() {
  // This notation is called JSON.  Java Script Object Notation
  // It is the native way that JavaScript can literally declare an object structure.
  // here we are literally building an object with the described structure.
  // {} is an object
  // [] is an array
  var linuxCheatsheets = {// creating the Linux object array
    keyword: "Linux",
    cheetsheets: [
      {
        title: "Linux Commands 1",
        link: "cheatsheets/linuxCommands.png"
      },
      {
        title: "Linux Commands 2",
        link: "cheatsheets/linuxCmds.jpg"
      }
    ]
  }

  var CSCheatsheets = { // creating the C# object array
    keyword: "C#",
    cheatsheets : [
      {
        title: "C# Syntax",
        link: "cheatsheets/CSharpSyntax.jpg"
      }
    ]
  }

  var CPPCheatsheets = {// creating the C++ object array
    keyword: "C++",
    cheatsheets: [
      {
        title: "C++ Syntax",
        link: "cheatsheets/CPlusPlus.jpg"
      }
    ]
  }

  var windowsCheatsheets = {// creating the Windows object array
    keyword: "Windows",
    cheetsheets: [
      {
        title: "Windows Intro",
        link: "cheatsheets/windowsIntro.jpg"
      }
    ]
  }

  return [ linuxCheatsheets, windowsCheatsheets, CSCheatsheets, CPPCheatsheets ] //returning all the objects for further use
}

function createCheatsheetLi(title, linkToCheatsheet) {
  // let's define html for a cheatsheet
  // "<ol><img src='"a[v]"' alt='did not load'></ol>"

  var li = $("<ol></ol>");
  var img = $("<img></img>")
    .attr("src", linkToCheatsheet)
    .attr("alt", title)
    .attr("class", "img img-responsive");

  li.append(img);  // insert the image into the li
  return li;
}

function createNotFoundDiv() { // make catch if the keywords dont match anything
  var div = $("<div></div>");
  div.text("Sorry mate, that isnt in our Database currently.") //best i could come up with lol.
  return div;
}

function createEmptrySearchDiv() { // make catch if nothing was entered
  var div = $("<div></div>");
  div.text("Could not return results becuase nothing was entered. " +
  "Sorry, please try again and search for something this time.") //best i could come up with lol.
  return div;
}

function createDidYouMeanDiv(searchStrg) { // make a funtion that will give suggestions like google.
  var div = $("<div></div>");
  div.text("Did you mean " + searchStrg + "?")
  return div;
}

// EVENT LISTENER, ON DOCUMENT LOADED
$(function() {
  var searchStrg = getUrlParameter("searchStrg").trim();  // remove whitespaces
  console.log("respond to search string: " + searchStrg);//logging the value for debugging

  $("#searchString").val(searchStrg);

  // handle empty search, show not found message
  if (searchStrg === "") {
    $("#searchResults").append(createEmptrySearchDiv());
  } else {
    searchThroughCheatsheets(searchStrg);
  }
})

function searchThroughCheatsheets(searchStrg) {
  // we want a map of keywords -> array of cheatsheets
  var cheetsheets = buildCheatsheets(); // gets the database of cheatsheets
  var cheatsheetsLIs = []
  var cheatsheetsKeywords = []

  cheetsheets.forEach(function(item) {
    if (item.keyword.toUpperCase() === searchStrg.toUpperCase()) {
      console.log("found matching cheatsheets :" + item.keyword)// log the match to make sure the if
                                                                  //statment is doing the right thing
      item.cheetsheets.forEach(function(cheetsheet) { // prints out the values form the cheatsheets object
        cheatsheetsLIs.push(createCheatsheetLi(cheetsheet.title, cheetsheet.link));
        cheatsheetsKeywords.push(item.keyword);
      })
    } else {
      console.log("keyword does not match " + searchStrg); // didnt match the value - for debugging
    }
  })

  if (cheatsheetsLIs.length === 0) {
    // search for partial matches
    console.log("searching for partial matches...")

    // after we search for partial matches,
    // if we have found a partial match,
    // display "did you mean? " with the results.

    // now we are ready to get the correct cheatsheets for the search
    // javascript has a map function for arrays.
    cheetsheets.forEach(function(item) {
      if (item.keyword.toUpperCase().includes(searchStrg.toUpperCase())) {// tries to see if the partial value
                                                                         //is in the string value of the cheatsheets
        console.log("found matching cheatsheets :" + item.keyword)// debugging an improper values
          // if the value matches print out the related cheatsheets
        item.cheetsheets.forEach(function(cheetsheet) {
          cheatsheetsLIs.push(createCheatsheetLi(cheetsheet.title, cheetsheet.link));
          cheatsheetsKeywords.push(item.keyword);
        })
      } else {
        console.log("keyword does not match " + searchStrg);
      }
    })

    if (cheatsheetsLIs.length === 0) {  // did we find any partial matches
      // show not found message
      $("#searchResults").append(createNotFoundDiv());
    } else {
      // show did you mean message
      $("#searchResults").append(createDidYouMeanDiv(cheatsheetsKeywords[0]));
    }
  }

  // only add results if there are results!
  if (cheatsheetsLIs.length > 0) {
    // at this point we have an array of HTMLs
    // there may or may not be a "Did you mean" div above the ul...
    var ul = $("<ul></ul>");

    cheatsheetsLIs.forEach(function(li) {
      ul.append(li).append("<hr/>");
    })

    $("#searchResults").append(ul);
  }

}
