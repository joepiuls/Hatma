import AnalyticsEvent from '../models/AnalyticsEvents.js';

export const getTotalVisits = async () => AnalyticsEvent.countDocuments({ type: 'page_visit' });

export const getServicesRequested = async () => AnalyticsEvent.aggregate([
  { $match: { type: 'service_request' } },
  { $group: { _id: '$metadata.service', count: { $sum: 1 } } },
  { $project: { name: '$_id', value: '$count', _id: 0 } },
  { $sort: { value: -1 } },
]);

export const getConversions = async () => {
  const data = await AnalyticsEvent.aggregate([
    { $match: { type: 'conversion' } },
    { $group: { _id: '$metadata.method', count: { $sum: 1 } } },
  ]);
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return data.map(item => ({
    label: item._id,
    percentage: +((item.count / total) * 100).toFixed(1),
  }));
};

export const getTrafficSources = async () => {
  const data = await AnalyticsEvent.aggregate([
    { $match: { type: 'traffic_source' } },
    { $group: { _id: '$metadata.source', count: { $sum: 1 } } },
  ]);
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return data.map(item => ({
    source: item._id,
    percentage: +((item.count / total) * 100).toFixed(1),
  }));
};

export const getTopPages = async () => AnalyticsEvent.aggregate([
  { $match: { type: 'page_visit' } },
  { $group: { _id: '$metadata.page', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 5 },
  { $project: { name: '$_id', value: '$count', _id: 0 } },
]);

export const getAverageSession = async () => {
  const result = await AnalyticsEvent.aggregate([
    { $match: { type: 'session' } },
    { $group: { _id: null, avg: { $avg: '$metadata.duration' } } },
  ]);
  return result[0]?.avg?.toFixed(2) || '0.00';
};

export const getMonthlyTrends = async () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const results = await AnalyticsEvent.aggregate([
    { $match: { type: 'page_visit' } },
    {
      $group: {
        _id: { $month: '$timestamp' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  const data = months.map((label, i) => {
    const found = results.find(r => r._id === i + 1);
    return { month: label, value: found ? found.count : 0 };
  });

  return data;
};

export const getSubscribersCount = async () => 
  AnalyticsEvent.countDocuments({ type: 'subscribe' });



