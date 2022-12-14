import {
  ReadIcon,
  UnreadIcon,
  CommentIcon,
  ActivityIcon,
  CommentAlertIcon,
  InfinityIcon,
  MentionIcon,
} from "components/Icon";

import useI18N from "hooks/use-i18n";
import useType from "hooks/use-type";
import useRequest from "hooks/use-request";

import { getFiltersURL } from "helpers/urls";

import { NotificationActionConstants } from "constants";

const useFilters = ({ type } = {}) => {
  const {
    isPost,
    isNotification,
    isCommentsActivity,
    postType
  } = useType({ type });
  const { i18n } = useI18N();

  const url = isPost
    ? getFiltersURL({ postType })
    : null;
  const request = {
    url,
    method: "GET",
  };
  let { data, error, isValidating, mutate } = useRequest({ request });

  if (isCommentsActivity)
    data = [
      {
        title: i18n.t("global.type"),
        //count: 1350,
        content: [
          {
            ID: "all",
            //count: 1350,
            name: i18n.t("global.all"),
            icon: <InfinityIcon />,
            query: {
              sort: "-last_modified"
            },
            subfilter: false,
          },
          {
            ID: "comments_activity_type_comments_only",
            //count: 450,
            name: i18n.t("global.comments"),
            icon: <CommentIcon />,
            query: {
              "comment_ID": '*',
              sort: "-last_modified"
            },
            subfilter: false,
          },
          {
            ID: "comments_activity_type_activity_only",
            //count: 850,
            name: i18n.t("global.activity"),
            icon: <ActivityIcon />,
            query: {
              "histid": '*',
              sort: "-last_modified"
            },
            subfilter: false,
          },
          /*
        {
          ID: "comments_activity_type_facebook_only",
          //count: 50,
          name: "Facebook",
          query: null,
          subfilter: false
        }
        */
        ],
      },
    ];

  if (isNotification)
    data = [
      {
        title: i18n.t("global.status"),
        //count: 99,
        content: [
          {
            ID: "all",
            //count: 99,
            name: i18n.t("global.all"),
            icon: <InfinityIcon />,
            query: null,
            subfilter: false,
          },
          {
            ID: "notifications_status_unread",
            //count: 76,
            name: i18n.t("global.unread"),
            icon: <UnreadIcon />,
            query: {
              key: "is_new",
              value: "1",
            },
            subfilter: false,
          },
          {
            ID: "notifications_status_read",
            //count: 23,
            name: i18n.t("global.read"),
            icon: <ReadIcon />,
            query: {
              key: "is_new",
              value: "0",
            },
            subfilter: false,
          },
        ],
      },
      {
        title: i18n.t("global.type"),
        //count: 99,
        content: [
          {
            ID: NotificationActionConstants.MENTION,
            //count: 99,
            name: i18n.t("global.mention"),
            icon: <MentionIcon />,
            query: {
              key: "notification_action",
              value: NotificationActionConstants.MENTION,
            },
            subfilter: false,
          },
          {
            ID: NotificationActionConstants.ALERT,
            //count: 19,
            name: i18n.t("global.alert"),
            icon: <CommentAlertIcon />,
            query: {
              key: "notification_action",
              value: NotificationActionConstants.ALERT,
            },
            subfilter: false,
          },
          {
            ID: NotificationActionConstants.COMMENT,
            //count: 19,
            name: i18n.t("global.comments"),
            icon: <CommentIcon />,
            query: {
              key: "notification_action",
              value: NotificationActionConstants.COMMENT,
            },
            subfilter: false,
          },
        ],
      },
    ];

  const mapCustomFiltersByTab = (customFilters, tab) => {
    const mappedCustomFilters = [];
    customFilters?.filters.forEach((filter) => {
      if (filter?.tab === tab) {
        const ID = filter?.ID ?? null;
        const name = filter?.name ?? "";
        const count = filter?.count ?? 0;
        const subfilter = filter?.subfilter ?? false;
        const query = filter?.query ?? {};
        mappedCustomFilters.push({
          ID,
          name,
          count,
          subfilter,
          query,
        });
      }
    });
    return mappedCustomFilters;
  };

  const mapCustomFilters = (customFilters) => {
    const mappedCustomFilters = [];
    customFilters?.tabs.forEach((tab) => {
      const key = tab?.key ?? null;
      const title = tab?.label ?? "";
      let content = [];
      if (title) content = mapCustomFiltersByTab(customFilters, key);
      mappedCustomFilters.push({
        title,
        count: 0,
        content,
      });
    });
    return mappedCustomFilters;
  };

  const filters = data?.filters?.length > 0 ? mapCustomFilters(data) : data;
  return {
    data: filters,
    error,
    isLoading: !error && !data,
    isValidating,
    mutate,
  };
};
export default useFilters;
