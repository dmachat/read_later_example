(function($) {
  // We need one extra variable to do math for scrolling
  var lastPosition;

  Drupal.behaviors.readLater = {
    // Initialize the Read Later function
    attach: function (context, settings) {
      if (typeof Drupal.settings.readLater != undefined) {
        Drupal.behaviors.readLater.getPosition();

        $(window).resize(function(){
          Drupal.behaviors.readLater.currentPosition();
          Drupal.behaviors.readLater.savePosition();
        })

        $(window).scroll(function(e){
          Drupal.behaviors.readLater.currentPosition();
          Drupal.behaviors.readLater.savePosition();
        });
      }
    },
    // Loads the position on initial page load and sets the jumpclick
    getPosition: function () {
      $.ajax({
        url: '/read_later/load',
        type: 'GET',
        data: {
          'uid': Drupal.settings.readLater.uid,
          'nid': Drupal.settings.readLater.nid
        },
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
          if (data.success == true) {
            Drupal.behaviors.readLater.jumpClickHandler(parseInt(data.anchor));
          }
        }
      });
    },
    // Saves position as the user scrolls through the text
    savePosition: function () {
      if (Drupal.settings.readLater.anchor != window.last_position && Drupal.settings.readLater.anchor > 0) {
        $.ajax({
          url: '/read_later/save',
          type: 'GET',
          data: {
            'uid': Drupal.settings.readLater.uid,
            'nid': Drupal.settings.readLater.nid,
            'anchor': Drupal.settings.readLater.anchor
          },
          dataType: 'json',
          success: function (data, textStatus, jqXHR) {
            window.last_position = Drupal.settings.readLater.anchor;
          }
        });
      }
    },
    // Add the proper anchor to the click event in the Read Later header
    jumpClickHandler: function(index) {
      target = $('#page #content').find('p:eq(' + index + ')');
      $('#read-later-header > a').click(function(e) {
        $('html, body').animate({
          scrollTop: target.offset().top
        });
        e.preventDefault();
      });
    },
    // Does a little math to see if a new paragraph is now the last paragraph
    // visible at the top of the window
    currentPosition: function() {
      var windowTop = $(window).scrollTop();

      $('#page #content').find('p').each(function() {
        eTop = $(this).offset().top - windowTop;
        if (eTop > 0) {
          Drupal.settings.readLater.anchor = $(this).index();
          return false;
        }
      });
    }
  }
})(jQuery);
