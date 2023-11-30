export const notify = (message: string) => {
  if (hasNotificationPermission()) {
    const notification = new Notification(message);
    return notification;
  } else {
    alert(message);
    return null;
  }
};

export const hasNotificationPermission = () => {
  return "Notification" in window && Notification.permission === "granted";
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return false;
  } else if (Notification.permission === "granted") {
    return true;
  } else if (Notification.permission === "denied") {
    return false;
  } else {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return true;
    } else {
      return false;
    }
  }
};