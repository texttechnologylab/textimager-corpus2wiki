// Goethe University Frankfurt
// Text Technology Lab, 2018
// Modified by Alex Hunziker & Hasanagha Mammadov

// Makes Text Hilightable based on the class attribute of the HTML Tags
// Example: <span class="MORPH_yourCategory_yourValue">I am hilightable<span>

$(document).ready(function() {
  // Define Background colors for sidebar
  function colores_google(n) {
    var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477",
    "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300",
    "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    return colores_g[n % colores_g.length];
  }

  let morphMap = new Map();
  // Go over all HTML Elements that contain Morph in their Class
  $('[class*=" MARK"]').each(function() {
    var classList = $(this).attr('class').split(/\s+/);
    // Iterate over all words of the class attribute
    $.each(classList, function(index, item) {
      if (item.startsWith("MARK")) {
        // MORPH is found
        var splittedText = (this.toString().split("_"));
        // Add category (splittedText[1]) to the map if it is not already there
        if(!morphMap.has(splittedText[1])){
          morphMap.set(splittedText[1],[splittedText[2]]);
        }
        // otherwise add value splittedText[2] to category if not already existent
        else{
          if(!morphMap.get(splittedText[1]).includes(splittedText[2]))
          morphMap.get(splittedText[1]).push(splittedText[2]);
        }
      }
    });
  });

  // Now we addd the categories and values found above to the sidebar
  $('#mw-navigation > #mw-panel').each(function() {
    var panel = this;
    // For each eentry of the morphMap, generate a category in the sidebar
    morphMap.forEach(function(element,i){
      var div = $('<div />',{class:"portal",role:'navigation',id:'p-'+i,'aria-labelledby':"p-"+i+"-label"});
      $('<h3>'+i+'</h3>',{id:"p-"+i+"-label"}).appendTo(div);
      var body = $('<div/>',{class:"body"});
      body.appendTo(div);
      var form = $('<ul />',{style:"padding: 0;list-style-type: none;"});
      // For all values, generate a Checkbox (and label)
      element.forEach(function(radioElement,j){
        var li = $('<li/>',{style:"list-style-type: none;"});
        $('<input />', { type: 'checkbox', id:radioElement,name: i, value: radioElement, class: i+"Checkbox"}).appendTo(li);
        $('<label />', { 'for': radioElement, text: radioElement, style:"font-size:13px; background:"+colores_google(j)+"44"}).appendTo(li);
        li.appendTo(form);
      });
      form.appendTo(div);
      // Append to MW Panel
      div.appendTo($('#mw-panel'));

      // Add function to Checkbox
      $('.'+i+'Checkbox').change(function() {
        if(this.checked) {
          $('.MARK_'+i+'_'+this.id).css('background',colores_google(morphMap.get(i).indexOf(this.id))+"44");
        }
        else{
          $('.MARK_'+i+'_'+this.id).css('background',"none");
        }
      });
    });
  });
});
