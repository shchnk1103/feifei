export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);

  // 判断日期是否有效
  if (isNaN(dateObj.getTime())) {
    console.warn("Invalid date:", date);
    return "";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};
