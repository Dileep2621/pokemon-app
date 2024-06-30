import Detail from "@/app/components/Detail";
import React from "react";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <main className="p-10">
      <Detail params={params} />
    </main>
  );
};

export default page;
