module.exports = {

  desk: function(data) {

    // Create the case object for desk.com
    var entry = {
      subject: data.topic,
      description: data.description,
      priority: 5,
      status: 'new',
      type: 'email',
      labels: ['Submission'],
      custom_fields: {
        episode_number: data.episode_number,
        time_start: data.time_start,
        time_stop: data.time_stop,
        author_link: data.author_link
      },
      message: {
        to: 'support@whichrotl.desk-mail.com',
        direction: 'in',
        status: 'received',
        subject: data.topic,
        body: data.description
      },
      _links: {
        customer: {
          href: data.customer_link,
          'class': 'customer'
        }
      }
    };

    return entry;
  },

  db: function(data) {
    var entry = {
      topic: data.topic,
      episode_number: data.episode_number,
      time_start: data.time_start,
      time_stop: data.time_stop,
      author_name: data.author_name,
      author_link: data.author_link
    };

    return entry;
  }
};
