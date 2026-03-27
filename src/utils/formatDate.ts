import {ONE_DAY_IN_MS, ONE_HOUR_IN_MS, ONE_MINUTE_IN_MS} from "../consts.ts";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / ONE_MINUTE_IN_MS);
  const diffHours = Math.floor(diffMs / ONE_HOUR_IN_MS);
  const diffDays = Math.floor(diffMs / ONE_DAY_IN_MS);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};
