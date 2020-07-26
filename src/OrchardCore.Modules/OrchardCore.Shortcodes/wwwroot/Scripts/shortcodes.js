/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

/// jQuery helper to append text to a textarea or input.
jQuery.fn.extend({
  insertAtCaret: function insertAtCaret(myValue) {
    return this.each(function (i) {
      if (document.selection) {
        //For browsers like Internet Explorer
        this.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      } else if (this.selectionStart || this.selectionStart === "0") {
        //For browsers like Firefox and Webkit based
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += myValue;
        this.focus();
      }
    });
  }
});
var shortcodeWrapperTemplate = "\n<div class=\"shortcode-popover-wrapper\"></div>\n";
var shortcodeHolderTemplate = "\n<button type=\"button\" class=\"shortcode-popover-btn btn btn-sm\">\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n    <path d=\"M16 4.2v1.5h2.5v12.5H16v1.5h4V4.2h-4zM4.2 19.8h4v-1.5H5.8V5.8h2.5V4.2h-4l-.1 15.6zm5.1-3.1l1.4.6 4-10-1.4-.6-4 10z\"></path>\n</svg>\n</button>\n<div class=\"shortcode-popover-holder mt-n3 mr-n3 py-3 px-2 w-50 bg-white border shadow rounded\" style=\"display:none\"></div>  \n"; // Wraps each .shortcode-popover class with a wrapper, and attaches detaches the shortcode app as required.

$(function () {
  $('.shortcode-popover').each(function () {
    $(this).wrap(shortcodeWrapperTemplate);
    $(this).parent().append(shortcodeHolderTemplate);
  });
  $('.shortcode-popover-btn').on('click', function () {
    var holder = $(this).siblings('.shortcode-popover-holder');
    shortcodeApp.init(holder, $(this).siblings('.shortcode-popover'), true);
    holder.fadeToggle();

    var modalCloser = function modalCloser(e) {
      if (!holder.is(e.target) && holder.has(e.target).length === 0) {
        cancel();
      }
    };

    var cancel = function cancel() {
      holder.fadeToggle();
      $(document).off('mouseup', modalCloser);
    };

    $(document).on('mouseup', modalCloser);
    $('#shortcode-popover-app-content').on('success', function () {
      if (shortcodeApp.value && shortcodeApp.value.defaultShortcode) {
        var input = $(holder).siblings('.shortcode-popover');
        input.insertAtCaret(shortcodeApp.value.defaultShortcode);
      }

      holder.fadeToggle();
      $(document).off('mouseup', modalCloser);
    });
    $('#shortcode-popover-app-content').on('cancel', cancel);
  });
}); // vuejs shortcodeApp
// Appended once to the body and moved around as required.

var shortcodeApp;

function initializeShortcodes(element) {
  if (element) {
    var elementId = element.id;
    var vueMultiselect = Vue.component('vue-multiselect', window.VueMultiselect["default"]);
    shortcodeApp = new Vue({
      el: '#' + elementId,
      components: {
        'vue-multiselect': vueMultiselect
      },
      data: function data() {
        var shortcodes = JSON.parse(element.dataset.shortcodes || "[]");
        return {
          value: '',
          selector: '',
          showControls: true,
          shortcodes: shortcodes,
          allShortcodes: shortcodes,
          categories: []
        };
      },
      methods: {
        init: function init(selector, categoriesSelector, showControls) {
          var self = this;
          self.value = '';
          self.categories = '';
          self.shortcodes = [];
          self.showControls = false;

          if (showControls) {
            self.showControls = showControls;
          }

          if (selector) {
            $('#shortcode-popover-app-content').detach().appendTo(selector);
            $(selector).addClass('active');
            self.selector = selector;

            if (categoriesSelector) {
              var categories = $(categoriesSelector).data('shortcodecategories');

              if (categories) {
                self.shortcodes = self.allShortcodes.filter(function (shortcode) {
                  return shortcode.categories.some(function (category) {
                    return categories.indexOf(category) > -1;
                  });
                });
              }
            }
          } else {
            alert($('#shortcode-selector-error').data('localized'));
          }
        },
        success: function success() {
          $(this.$el).trigger('success');
          this.close();
        },
        cancel: function cancel() {
          $(this.$el).trigger('cancel');
          this.close();
        },
        close: function close() {
          // Don't reset the values here as apps may still need to read this values.
          $('#shortcode-popover-app-content').detach().appendTo('#shortcode-popover-app-container');
          $('#shortcode-popover-app-content').off();
        }
      }
    });
    return shortcodeApp;
  }
} // initializes a code mirror editor with a shortcode popover.
// categories should be placed on the parent with class .shortcode-popover-categories.


function initializeCodeMirrorShortcodeWrapper(editor) {
  var codemirrorWrapper = editor.display.wrapper;
  $(codemirrorWrapper).wrap(shortcodeWrapperTemplate);
  $(codemirrorWrapper).parent().append(shortcodeHolderTemplate);
  $(codemirrorWrapper).siblings('.shortcode-popover-btn').on('click', function () {
    var holder = $(this).siblings('.shortcode-popover-holder');
    shortcodeApp.init(holder, $(this).closest('.shortcode-popover-categories'), true);
    holder.fadeToggle();

    var modalCloser = function modalCloser(e) {
      if (!holder.is(e.target) && holder.has(e.target).length === 0) {
        cancel();
      }
    };

    var cancel = function cancel() {
      holder.fadeToggle();
      $(document).off('mouseup', modalCloser);
    };

    $(document).on('mouseup', modalCloser); // By design these leave the popover in place where another editor can move it.

    $('#shortcode-popover-app-content').on('success', function () {
      if (shortcodeApp.value && shortcodeApp.value.defaultShortcode) {
        editor.replaceSelection(shortcodeApp.value.defaultShortcode);
      }

      holder.fadeToggle();
      $(document).off('mouseup', modalCloser);
    });
    $('#shortcode-popover-app-content').on('cancel', cancel);
  });
}