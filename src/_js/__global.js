// Load Vendors - I need these in the <head>. DataTables only needs to be loaded on the index HTML page.
//require('jquery');
//require('bootstrap');
//require('datatables.net');
//require('datatables.net-bs4');
//require('datatables.net-select');
//require('datatables.net-select-bs4');

//import SandBox from "./SandBox";
//const sandbox = new SandBox();

// My JS for the app
/* 
to-do:
 - Integrate offline vs online handler (allows for re-use of components via JS fetch)
 - JSON data for cards (use to emulate data binding from external source)
*/

/*
// Define where our data/content comes from 
const requestURL = 'sample.json';

// connect to the JSON
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'text';
request.send();

// Do something with the JSON
request.onload = function() {
  loadJson();
}

function loadJson(){
  // load the JSON for use
  const encodedResponse = request.response;
  const decodedResponse = JSON.parse(encodedResponse);  
}
*/

// Removes duplicate values from array - var arrayName = {srcArray}.filter( onlyUnique );
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

$(function(){ // document.ready
  // Update btn-group based on drop-down selection
  $(document).on('click','a.dropdown-item',function(e){
    e.preventDefault();
    $(this).parents(".btn-group").find('.btn:first-child').html( $(this).text() );
  });

/* BEGIN DATATABLE ITEMS */
/* --------------------- */

  if( $('#table-releases').length > 0 ){
    $('#filterClear').hide();

    // Allow sorting and filtering of the datatable - See https://datatables.net
    $.fn.dataTable.moment( 'D MMMM YYYY' );
    $('#table-releases').DataTable({
      "paging":   false,
      "info":     false,
      "searching": true,
      columnDefs: [
        { targets: [3,4,5], orderable: false }, // disable sorting on 'Status', 'Applications' and 'Actions' column
      ],
      "order": [[ 2, "desc" ]], // default sort by 'Date' column
      dom: 'lrtp',
    });
  }

  // Clear data table filters
  $(document).on('click','#filterClear',function(){
    $('#filterClear').hide();
    var table = $('#table-releases').DataTable();
    table.columns().search('').draw();
  });

  // Test Filter data table
  /*
  $(document).on('click','#filter',function(){
    var table = $('#table-releases').DataTable();
    table.columns(3).search("Archived").draw();
  });
  */

  // Filter data table based on which filter is clicked
  $(document).on('click','a.a__filter',function(e){
    e.preventDefault();

    // determine column
    var thText = $(this).parents("th").text();
    var index = $('#table-releases tr th').filter(
      function(){
        return $(this).text() == thText;
      }
    ).index();

    // get all badge text within the selected column
    var tdVals = [];
    $('#table-releases tr td:nth-child('+ parseInt(index+1) +')').each(function(){
      $(this).find('.badge').each(function(){
        tdVals.push( $(this).text() ) // array contains multiples of the same value at this point
      });
    });
    tdVals = tdVals.filter( onlyUnique ); // array now contains only one of each badge text

    // prepare content sting to use in popover
    var filterContentString="";
    for(var i=0;i<tdVals.length;i++){
      filterContentString+="<span id=\""+index+"_filterChoices\" class=\"badge badge-pill badge-dark badge__filterChoices\">"+tdVals[i]+"</span><br />";
    }

    // populate and show popover with all the possible filter choices
    $(this).popover({
      content: filterContentString,
      html: true
    });
    $(this).popover('show');
  });

  // Filter the data table based on the text of the chosen badge
  $(document).on('click','span[id$="_filterChoices"]',function(){
    $('#filterClear').show();
    var id = $(this).attr('id');
    var idPieces = id.split("_");
    var index = idPieces[0];
    var filterTerm = $(this).text();
    var table = $('#table-releases').DataTable();

    table.columns(index).search(filterTerm).draw();
    $(document).popover('dispose');
  });

/* ------------------- */
/* END DATATABLE ITEMS */
  
  // add new card with btn press
  $(document).on('click','#addNote',function(e){
    fetch("assets/card.html").then(function (response) {
      return response.text();
    }).then(function (data) {
      document.querySelector("#cardContainer").innerHTML += data; // add to dom
      document.querySelector('.cardGlow').scrollIntoView({ // scroll to the new card
        behavior: 'smooth',
        block: 'center',
      });
      setTimeout(function(){ // remove the glow effect (which has a css transition)
        $(".card").removeClass("cardGlow");
      },1000);
    });
  });
});

// pre-load card component(s) if appropriate
if( $('#cardContainer').length > 0 ){
  var cardCount = 2; // how many cards to pre-load
  for(var i=0;i<cardCount;i++){
    fetch("assets/card.html").then(function (response) {
      return response.text();
    }).then(function (data) {
      document.querySelector("#cardContainer").innerHTML += data;
      $(".card").removeClass("cardGlow");
    });
  }
}

// Need to replicate items when the 'Add Translation' btn is clicked
$(document).on('click','.btn__addTranslation',function(e){
  console.log('Add Translation button clicked.');
  /*
  fetch("assets/XXX").then(function (response) {
    return response.text();
  }).then(function (data) {
    document.querySelector("#").innerHTML += data;
  });
  */
});
