import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { fallbackModeToStaticPathsResult } from "next/dist/lib/fallback";
import accountService from "@/services/accountService";
import { AccountSummary } from "@/types";

import DeleteImg from "@/images/icons/admin/delete.svg";

const UsersAdminTable = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { pathname } = router;

  const [users, setUsers] = useState<AccountSummary[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await accountService.getAllAccounts();
      if (!response.ok) {
        const error = await response.json();
        router.push({
          pathname: router.pathname,
          query: { errorMessage: String(error.message) },
        });
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      router.push({
        pathname: router.pathname,
        query: { errorMessage: String(error) },
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isSelected = (path: string) => pathname.split("?")[0] === path;

  const deleteUser = async (eventId: number) => {
    const confirmRemoval = confirm(t("admin.notifications.sure"));
    if (!confirmRemoval) return;
    try {
      const response = await accountService.deleteUser(eventId);
      if (response.ok) {
        fetchUsers();
        router.push({
          pathname: router.pathname,
          query: { succesMessage: String(t("admin.notifications.success")) },
        });
      } else {
        router.push({
          pathname: router.pathname,
          query: { errorMessage: String(t("admin.notifications.fail")) },
        });
      }
    } catch (error) {
      router.push({
        pathname: router.pathname,
        query: { errorMessage: String(error) },
      });
    }
  };

  return (
    <div className="w-full min-h-screen p-5 flex flex-col gap-5 justify-start items-center">
      <table className="w-full max-w-3xl border rounded-xl box-border overflow-hidden shadow-md">
        <thead className="bg-gray-800">
          <tr>
            <th className="text-white text-lg font-normal p-2">
              {t("profile.username")}
            </th>
            <th className="text-white text-lg font-normal p-2">
              {t("profile.email")}
            </th>
            <th className="text-white text-lg font-normal p-2">
              {t("profile.role")}
            </th>
            <th className="text-white text-lg font-normal p-2">
              {t("admin.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white border border-gray-400">
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-400">
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.type}</td>
              <td className="p-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => deleteUser(user.id)}
                  className=" text-white rounded px-2 py-1 hover:bg-gray-100 transition duration-300"
                  title={t("events.delete")}
                >
                  <Image src={DeleteImg} alt="" className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersAdminTable;
