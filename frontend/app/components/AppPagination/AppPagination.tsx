"use client";

import { Pagination } from "antd";

type Props = {
  total    : number;
  page     : number;
  pageSize : number;
  onChange : (page: number) => void;
};

export default function AppPagination({ total, page, pageSize, onChange }: Props) {
  if (total <= pageSize) return null;

  return (
    <div className="d-flex justify-content-center m-4">
      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
      />
    </div>
  );
}
