(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: tooltip.js v3.1.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return
      var that = this;

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.hoverState = null

      var complete = function() {
        that.$element.trigger('shown.bs.' + that.type)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one($.support.transition.end, complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth,
      height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

},{}],2:[function(require,module,exports){
/*!
 * jQuery-runner - v2.3.0 - 2013-07-14
 * https://github.com/jylauril/jquery-runner/
 * Copyright (c) 2013 Jyrki Laurila <https://github.com/jylauril>
 */
(function() {
  var Runner, formatTime, meta, pad, runners, uid, _requestAnimationFrame, _uid;

  meta = {
    version: "2.3.0",
    name: "jQuery-runner"
  };

  runners = {};

  _uid = 1;

  pad = function(num) {
    return (num < 10 ? '0' : '') + num;
  };

  uid = function() {
    return 'runner' + _uid++;
  };

  _requestAnimationFrame = (function(win, raf) {
    return win['webkitR' + raf] || win['r' + raf] || win['mozR' + raf] || win['msR' + raf] || function(fn) {
      return setTimeout(fn, 30);
    };
  })(window, 'equestAnimationFrame');

  formatTime = function(time, settings) {
    var i, len, ms, output, prefix, separator, step, steps, value, _i, _len;
    settings = settings || {};
    steps = [3600000, 60000, 1000, 10];
    separator = ['', ':', ':', '.'];
    prefix = '';
    output = '';
    ms = settings.milliseconds;
    len = steps.length;
    value = 0;
    if (time < 0) {
      time = Math.abs(time);
      prefix = '-';
    }
    for (i = _i = 0, _len = steps.length; _i < _len; i = ++_i) {
      step = steps[i];
      value = 0;
      if (time >= step) {
        value = Math.floor(time / step);
        time -= value * step;
      }
      if ((value || i > 1 || output) && (i !== len - 1 || ms)) {
        output += (output ? separator[i] : '') + pad(value);
      }
    }
    return prefix + output;
  };

  Runner = (function() {
    function Runner(items, options, start) {
      var id;
      if (!(this instanceof Runner)) {
        return new Runner(items, options, start);
      }
      this.items = items;
      id = this.id = uid();
      this.settings = $.extend({}, this.settings, options);
      runners[id] = this;
      items.each(function(index, element) {
        $(element).data('runner', id);
      });
      this.value(this.settings.startAt);
      if (start || this.settings.autostart) {
        this.start();
      }
    }

    Runner.prototype.running = false;

    Runner.prototype.updating = false;

    Runner.prototype.finished = false;

    Runner.prototype.interval = null;

    Runner.prototype.total = 0;

    Runner.prototype.lastTime = 0;

    Runner.prototype.startTime = 0;

    Runner.prototype.lastLap = 0;

    Runner.prototype.lapTime = 0;

    Runner.prototype.settings = {
      autostart: false,
      countdown: false,
      stopAt: null,
      startAt: 0,
      milliseconds: true,
      format: null
    };

    Runner.prototype.value = function(value) {
      var _this = this;
      this.items.each(function(item, element) {
        var action;
        item = $(element);
        action = item.is('input') ? 'val' : 'text';
        item[action](_this.format(value));
      });
    };

    Runner.prototype.format = function(value) {
      var format;
      format = this.settings.format;
      format = $.isFunction(format) ? format : formatTime;
      return format(value, this.settings);
    };

    Runner.prototype.update = function() {
      var countdown, delta, settings, stopAt, time;
      if (!this.updating) {
        this.updating = true;
        settings = this.settings;
        time = $.now();
        stopAt = settings.stopAt;
        countdown = settings.countdown;
        delta = time - this.lastTime;
        this.lastTime = time;
        if (countdown) {
          this.total -= delta;
        } else {
          this.total += delta;
        }
        if (stopAt !== null && ((countdown && this.total <= stopAt) || (!countdown && this.total >= stopAt))) {
          this.total = stopAt;
          this.finished = true;
          this.stop();
          this.fire('runnerFinish');
        }
        this.value(this.total);
        this.updating = false;
      }
    };

    Runner.prototype.fire = function(event) {
      this.items.trigger(event, this.info());
    };

    Runner.prototype.start = function() {
      var step,
        _this = this;
      if (!this.running) {
        this.running = true;
        if (!this.startTime || this.finished) {
          this.reset();
        }
        this.lastTime = $.now();
        step = function() {
          if (_this.running) {
            _this.update();
            _requestAnimationFrame(step);
          }
        };
        _requestAnimationFrame(step);
        this.fire('runnerStart');
      }
    };

    Runner.prototype.stop = function() {
      if (this.running) {
        this.running = false;
        this.update();
        this.fire('runnerStop');
      }
    };

    Runner.prototype.toggle = function() {
      if (this.running) {
        this.stop();
      } else {
        this.start();
      }
    };

    Runner.prototype.lap = function() {
      var lap, last;
      last = this.lastTime;
      lap = last - this.lapTime;
      if (this.settings.countdown) {
        lap = -lap;
      }
      if (this.running || lap) {
        this.lastLap = lap;
        this.lapTime = last;
      }
      last = this.format(this.lastLap);
      this.fire('runnerLap');
      return last;
    };

    Runner.prototype.reset = function(stop) {
      var nowTime;
      if (stop) {
        this.stop();
      }
      nowTime = $.now();
      if (typeof this.settings.startAt === 'number' && !this.settings.countdown) {
        nowTime -= this.settings.startAt;
      }
      this.startTime = this.lapTime = this.lastTime = nowTime;
      this.total = this.settings.startAt;
      this.value(this.total);
      this.finished = false;
      this.fire('runnerReset');
    };

    Runner.prototype.info = function() {
      var lap;
      lap = this.lastLap || 0;
      return {
        running: this.running,
        finished: this.finished,
        time: this.total,
        formattedTime: this.format(this.total),
        startTime: this.startTime,
        lapTime: lap,
        formattedLapTime: this.format(lap),
        settings: this.settings
      };
    };

    return Runner;

  })();

  if ($) {
    $.fn.runner = function(method, options, start) {
      var id, runner;
      if (!method) {
        method = 'init';
      }
      if (typeof method === 'object') {
        start = options;
        options = method;
        method = 'init';
      }
      id = this.data('runner');
      runner = id ? runners[id] : false;
      switch (method) {
        case 'init':
          new Runner(this, options, start);
          break;
        case 'info':
          if (runner) {
            return runner.info();
          }
          break;
        case 'reset':
          if (runner) {
            runner.reset(options);
          }
          break;
        case 'lap':
          if (runner) {
            return runner.lap();
          }
          break;
        case 'start':
        case 'stop':
        case 'toggle':
          if (runner) {
            return runner[method]();
          }
          break;
        case 'version':
          return meta.version;
        default:
          $.error('[' + meta.name + '] Method ' + method + ' does not exist');
      }
      return this;
    };
    $.fn.runner.format = formatTime;
  } else {
    throw '[' + meta.name + '] jQuery library is required for this plugin to work';
  }

}).call(this);

},{}],3:[function(require,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (root, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else {
    var mustache = {};
    factory(mustache);
    if (typeof define === "function" && define.amd) {
      define(mustache); // AMD
    } else {
      root.Mustache = mustache; // <script>
    }
  }
}(this, function (mustache) {

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function escapeTags(tags) {
    if (!isArray(tags) || tags.length !== 2) {
      throw new Error('Invalid tags: ' + tags);
    }

    return [
      new RegExp(escapeRegExp(tags[0]) + "\\s*"),
      new RegExp("\\s*" + escapeRegExp(tags[1]))
    ];
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    tags = tags || mustache.tags;
    template = template || '';

    if (typeof tags === 'string') {
      tags = tags.split(spaceRe);
    }

    var tagRes = escapeTags(tags);
    var scanner = new Scanner(template);

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) {
          delete tokens[spaces.pop()];
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(tagRes[0]);
      if (value) {
        for (var i = 0, len = value.length; i < len; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push(['text', chr, start, start + 1]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n') {
            stripSpace();
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(tagRes[0])) break;
      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(tagRes[1]);
      } else if (type === '{') {
        value = scanner.scanUntil(new RegExp('\\s*' + escapeRegExp('}' + tags[1])));
        scanner.scan(curlyRe);
        scanner.scanUntil(tagRes[1]);
        type = '&';
      } else {
        value = scanner.scanUntil(tagRes[1]);
      }

      // Match the closing tag.
      if (!scanner.scan(tagRes[1])) {
        throw new Error('Unclosed tag at ' + scanner.pos);
      }

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection) {
          throw new Error('Unopened section "' + value + '" at ' + start);
        }
        if (openSection[1] !== value) {
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
        }
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        tagRes = escapeTags(tags = value.split(spaceRe));
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();
    if (openSection) {
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
    }

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (match && match.index === 0) {
      var string = match[0];
      this.tail = this.tail.substring(string.length);
      this.pos += string.length;
      return string;
    }

    return "";
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view == null ? {} : view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function (name) {
    var value;
    if (name in this.cache) {
      value = this.cache[name];
    } else {
      var context = this;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;

          var names = name.split('.'), i = 0;
          while (value != null && i < names.length) {
            value = value[names[i++]];
          }
        } else {
          value = context.view[name];
        }

        if (value != null) break;

        context = context.parent;
      }

      this.cache[name] = value;
    }

    if (isFunction(value)) {
      value = value.call(this.view);
    }

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null) {
      tokens = cache[template] = parseTemplate(template, tags);
    }

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function (tokens, context, partials, originalTemplate) {
    var buffer = '';

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    var self = this;
    function subRender(template) {
      return self.render(template, context, partials);
    }

    var token, value;
    for (var i = 0, len = tokens.length; i < len; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
        value = context.lookup(token[1]);
        if (!value) continue;

        if (isArray(value)) {
          for (var j = 0, jlen = value.length; j < jlen; ++j) {
            buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
          }
        } else if (typeof value === 'object' || typeof value === 'string') {
          buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
        } else if (isFunction(value)) {
          if (typeof originalTemplate !== 'string') {
            throw new Error('Cannot use higher-order sections without the original template');
          }

          // Extract the portion of the original template that the section contains.
          value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

          if (value != null) buffer += value;
        } else {
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }

        break;
      case '^':
        value = context.lookup(token[1]);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || (isArray(value) && value.length === 0)) {
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }

        break;
      case '>':
        if (!partials) continue;
        value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
        if (value != null) buffer += this.renderTokens(this.parse(value), context, partials, value);
        break;
      case '&':
        value = context.lookup(token[1]);
        if (value != null) buffer += value;
        break;
      case 'name':
        value = context.lookup(token[1]);
        if (value != null) buffer += mustache.escape(value);
        break;
      case 'text':
        buffer += token[1];
        break;
      }
    }

    return buffer;
  };

  mustache.name = "mustache.js";
  mustache.version = "0.8.1";
  mustache.tags = [ "{{", "}}" ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

},{}],4:[function(require,module,exports){
// Modules
require('../../../components/bootstrap/js/tooltip.js');
var countdown = require('./countdown.js');
var Mustache = require('../../../components/mustache/mustache.js');

var humanize = function(seconds){
  var string;
  var hours;
  var minutes;

  if (seconds >= 60 && seconds < 3600) {
    minutes = Math.floor(seconds/60);
    string = minutes + ' minute';

    if (minutes > 1) {
      string += 's';
    }
  }

  if (seconds >= 3600) {
    hours = Math.floor(seconds/3600);
    minutes = Math.floor((seconds - (hours * 3600))/60);

    if (hours >= 1) {
      string += hours + ' hour';
    }

    if (hours > 1) {
      string += 's';
    }

    if (minutes >= 1) {
      string += 'and ' + minutes + ' minute';
    }

    if (minutes > 1) {
      string += 's';
    }
  }

  string += ' in';

  if (seconds < 60) {
    string = 'immediately';
  }

  return string;
};

var Template = {
  load: function(time, callback) {
    $.get('/custom/js/templates/audio.mst', function(template) {
      var rendered = Mustache.render(template, {time: time, humanizedTime: humanize(time.start)});

      callback(rendered);
    });
  },
  init: function($template, $audio, times) {
    var $playBtn = $template.find('.play');
    var $playBtnIcon = $playBtn.find('.glyphicon');
    var $timeBtn = $template.find('.countdown');
    var $muteBtn = $template.find('.mute');
    var $muteBtnIcon = $muteBtn.find('.glyphicon');
    var $volumeSlider = $template.find('.volume input');
    var $countdown = $template.find('.countdown');
    var player = $audio[0];
    var self = this;

    var checkVolume = function() {
      if (player.volume > 0.5 && !player.muted) {
        $muteBtnIcon
          .removeClass('glyphicon-volume-down glyphicon-volume-off')
          .addClass('glyphicon-volume-up');
      } else if (player.volume < 0.5 && player.volume > 0 && !player.muted) {
        $muteBtnIcon
          .removeClass('glyphicon-volume-up glyphicon-volume-off')
          .addClass('glyphicon-volume-down');
      } else {
        $muteBtnIcon
          .removeClass('glyphicon-volume-down glyphicon-volume-up')
          .addClass('glyphicon-volume-off');
      }
    };

    // Initialize the time counter
    countdown.init($countdown, times.duration * 1000);

    // Handle Play Button
    $playBtn.on('click', function() {
      if (player.paused === false) {
        $playBtnIcon
          .removeClass('glyphicon-pause')
          .addClass('glyphicon-play');

        player.pause();
      } else {
        $playBtnIcon
          .removeClass('glyphicon-play')
          .addClass('glyphicon-pause');

        player.play();
      }
    });

    // Handle Time Button
    // When clicked, reset the playhead
    $timeBtn.click(function () {
      player.pause();
      player.currentTime = times.start;
      self.reset($template);
    });

    // Show a tooltip on hover
    $timeBtn.tooltip({'container': 'body', 'placement': 'right', 'html': true});

    // Handle Volume Control
    $muteBtn.on('click', function() {
      if (player.muted) {
        player.muted = false;
        player.volume = player.oldvolume;
      } else {
        player.muted = true;
        player.oldvolume = player.volume;
        player.volume = 0;
      }
      checkVolume();
    });

    $volumeSlider.on('change', function() {
      player.muted = false;
      player.volume = $volumeSlider.val();
    });

    $audio.on('volumechange', function() {
      checkVolume();
      $volumeSlider.val(player.volume);
    });

    // Set the play position once the audio file is ready
    $audio.on('canplay', function() {
      $(this)[0].currentTime = times.start;
      $(this)[0].pause();
    });

    $audio.on('play', function() {
      countdown.resume($countdown);
    });

    $audio.on('pause', function() {
      countdown.pause($countdown);
    });

    // Reset the clip once the duration has elapsed
    $countdown.on('runnerFinish', function() {
      $audio[0].pause();
      $audio[0].currentTime = times.start;
      self.reset($template);
    });

  },
  reset: function($template, time) {
    var $playBtnIcon = $template.find('.play .glyphicon');
    var $countdown = $template.find('.countdown');

    // Reset play button state
    $playBtnIcon
      .removeClass('glyphicon-pause')
      .addClass('glyphicon-play');

    // Reset time
    $countdown.runner('reset', true);
  }
};

exports.init = function($clip) {
  var $audio = $clip.find('audio');
  var $template;

  // In seconds
  var times = {
    start: parseInt($audio.attr('data-start-time'), 10),
    end: parseInt($audio.attr('data-end-time'), 10),
  };

  times.duration = times.end - times.start;

  // Hide the audio player
  $audio.hide();

  // Load the new audio player template
  Template.load(times, function(template) {
    $template = $(template);

    Template.init($template, $audio, times);
    $audio.before($template);
  });
};

},{"../../../components/bootstrap/js/tooltip.js":1,"../../../components/mustache/mustache.js":3,"./countdown.js":5}],5:[function(require,module,exports){
require('../../../components/jquery-runner/build/jquery.runner.js');

exports.init = function($countdown, duration, callback) {

  $countdown.runner({
    autostart: false,
    countdown: true,
    startAt: duration,
    stopAt: 0,
    milliseconds: false,
    format: function(value) {
      return msToMMSS(value);
    }
  });
};

exports.resume = function($countdown) {
  $countdown.runner('start');
};

exports.pause = function($countdown) {
  $countdown.runner('stop');
};

var msToMMSS = function(ms) {
  var date = new Date(ms);

  var hh = date.getUTCHours();
  var mm = date.getUTCMinutes() + (hh * 60);
  var ss = date.getUTCSeconds();

  if (mm < 10) {
    mm = '0' + mm;
  }

  if (ss < 10) {
    ss = '0' + ss;
  }

  return mm + ':' + ss;
};
},{"../../../components/jquery-runner/build/jquery.runner.js":2}],6:[function(require,module,exports){
// Modules
var audio = require('../../custom/js/lib/audio.js');

// Cached variables
var $clip = $('.clip');

$(document).ready(function() {

  $clip.each(function() {
    audio.init($(this));
  });
});

},{"../../custom/js/lib/audio.js":4}]},{},[6])