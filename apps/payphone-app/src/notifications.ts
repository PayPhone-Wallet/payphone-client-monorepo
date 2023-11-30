export const notify = async (message: string) => {
  const accessGranted = await requestNotificationPermission();
  if (accessGranted) {
    const notification = new Notification(message);
    return notification;
  } else {
    alert(message);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return false;
  } else if (Notification.permission === "granted") {
    return true;
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return true;
    }
  } else {
    return false;
  }
};