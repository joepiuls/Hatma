import Notification from '../models/Notifications.js';
import { TYPE_CONFIG } from '../config/notificationConfig.js';


export async function createNotification(params) {
  try {
    const config = TYPE_CONFIG[params.type] || TYPE_CONFIG.system;
    return await Notification.create({
      icon: config.icon,
      iconBg: config.bg,
      iconColor: config.color,
      ...params
    });
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
}