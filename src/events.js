const { apiSympla, apiProtocol } = require('./api');

const getEvents = async () => {
  const { data } = await apiSympla('events');
  return data;
};

const getTickets = async (eventId) => {
  const { data } = await apiSympla(`events/${eventId}/orders`, 3);
  return data;
};

const checkNewEvents = async (events) => {
  const { results: eventsProtocol } = await apiProtocol('public/events');
  const newEvents = events.filter((event) => {
    return !eventsProtocol.find(
      (eventProtocol) => eventProtocol.referenceId === event.id
    );
  });
  const newEventsPromises = newEvents.map(({ name, id, detail, image }) =>
    apiProtocol(
      'events',
      'post',
      JSON.stringify({
        name,
        referenceId: id,
        data: {
          minimumPrice: 4.5,
          symbol: 'DEMO',
          royaltieFee: 10,
        },
        metadata: {
          name,
          description: detail,
          image,
          banner_image: image,
          featured_image: image,
        },
      })
    )
  );
  await Promise.all(newEventsPromises);
};

module.exports = { getEvents, checkNewEvents, getTickets };
