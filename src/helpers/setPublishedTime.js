export const setPublishedTime = (object) => {
  const date1 = new Date(object.date);
  const date2 = new Date()
  const difference = date2 - date1;
  const diff_result = new Date(difference);

  const dayDiff = Math.floor(diff_result / (1000 * 60 * 60 * 24));
  const monthDiff = diff_result.getMonth();
  const yearDiff = diff_result.getFullYear() - 1970;

  const hourDiff = Math.floor(diff_result /  60 / 60 / 1000);
  const minuteDiff = diff_result.getMinutes();
  const secondDiff = diff_result.getSeconds();

  if (secondDiff < 30 && minuteDiff < 1) {
    return `Just now`
  } else if (secondDiff < 60 && minuteDiff < 1) {
    if (secondDiff === 1) {
      return "1 second ago"
    }
    return `${secondDiff} seconds ago`
  } else if (minuteDiff < 60 && hourDiff < 1) {
    if (minuteDiff === 1) {
      return "1 minute ago"
    }
    return `${minuteDiff} minutes ago`
  } else if (hourDiff < 24 && dayDiff < 1) {
    if (hourDiff === 1) {
      return "1 hour ago"
    }
    return `${hourDiff} hours ago`
  } else if (dayDiff < 30 && monthDiff < 1) {
    if (dayDiff === 1) {
      return "1 day ago"
    }
    return `${dayDiff} days ago`
  } else if (monthDiff < 12 && yearDiff < 1) {
    if (monthDiff === 1) {
      return "1 month ago"
    }
    return `${monthDiff} months ago`
  } else {
    if (yearDiff === 1) {
      return "1 year ago"
    }
    return `${yearDiff} years ago`
  }
}
