import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import API from "../../api";

const LogsTable = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    API.get(`/activity?limit=50`)
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setLogs(data);
      })
      .catch((err) => {
        console.error("Error fetching logs:", err);
        if (mounted) setLogs([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const actionLabel = (action) => {
    const key = `admin.activity_${action}`;
    return t(key) !== key ? t(key) : action;
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="w-full bg-white dark:bg-[#0F1720] overflow-hidden">
        <thead className="bg-gray-200 dark:bg-[#071519]">
          <tr>
            <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.activityAction')}</th>
            <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.activityDetail')}</th>
            <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">{t('admin.activityTime')}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                {t('admin.loadingActivity')}
              </td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                {t('admin.noActivity')}
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr key={log._id || index} className="border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#071519]">
                <td className="py-2 px-4 font-medium">{actionLabel(log.action)}</td>
                <td className="py-2 px-4">
                  {(log.userName ? log.userName + " — " : "") + (log.targetName || "")}
                </td>
                <td className="py-2 px-4">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable;
