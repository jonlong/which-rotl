require('../../../components/countdown/jquery.countdown.js');

exports.init = function($countdown, duration) {

  $countdown.countdown({
    date: +(new Date()) + duration,
    render: function(data) {
      $(this.el).text(this.leadingZeros(data.sec, 2) + " sec");
    }
  });
  $countdown.stop();
};

exports.resume = function($countdown) {
  $countdown.runner('start');
};

exports.pause = function($countdown) {
  $countdown.runner('stop');
};



$('.countdown-callback').countdown({
  date: +(new Date) + 10000,
  render: function(data) {
    $(this.el).text(this.leadingZeros(data.sec, 2) + " sec");
  },
  onEnd: function() {
    $(this.el).addClass('ended');
  }
}).on("click", function() {
  $(this).removeClass('ended').data('countdown').update(+(new Date) + 10000).start();
});
