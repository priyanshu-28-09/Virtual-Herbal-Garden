import React from "react";
import { useTranslation } from "react-i18next";
import LogsTable from "../components/LogsTable";

const Logs = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t('admin.logsTitle')}</h2>
      <LogsTable />
    </div>
  );
};

export default Logs;
