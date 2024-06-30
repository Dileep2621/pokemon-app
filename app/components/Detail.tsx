"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import Loader from "./Loader";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: any;
  };
  types: any;
  stats: any;
  abilities: any;
  moves: any;
  // Add other properties as needed
}

interface RouteParams {
  slug: string;
  id: string;
}

interface DetailProps {
  params: any;
}

const Detail = ({ params }: DetailProps) => {
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params?.slug;
  const id = params?.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Pokemon>(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setData(response.data);
      } catch (err) {
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, id]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <ul className="flex items-center gap-2">
              <li>
                <Link href={"/"}>Home</Link>
              </li>
              <FaChevronLeft className="fill-slate-400 w-3 h-3 m-0 p-0 mt-1" />
              <li className="text-blue-600 capitalize">{slug ? slug : ""}</li>
            </ul>
            <div className="flex w-full justify-center mt-10">
              <div className="shadow-md rounded-md bg-white w-full lg:w-[46%]">
                <div className="">
                  <Image
                    src={data?.sprites?.front_default}
                    alt="Example Image"
                    width={200}
                    height={200}
                    className="rounded-md w-[200px] h-[200px] object-contain m-auto"
                  />
                </div>
                <div className="bg-gray-100 rounded-md">
                  <div className="flex p-2 px-6 items-start gap-2">
                    <p className="text-black font-bold text-lg">Name: </p>
                    <p className="text-black text-lg capitalize">
                      {data?.name}
                    </p>
                  </div>
                  <div className="flex p-2 px-6 items-start gap-2">
                    <p className="text-black font-bold text-lg">Type: </p>
                    <p className="text-black text-lg">
                      {data?.types.length > 0
                        ? data?.types
                            ?.map((type: any) => {
                              return type.type.name;
                            })
                            .join(", ")
                        : ""}
                    </p>
                  </div>
                  <div className="flex p-2 px-6 items-start gap-2">
                    <p className="text-black font-bold text-lg">Stats: </p>
                    <p className="text-black text-lg">
                      {data?.stats.length > 0
                        ? data?.stats
                            ?.map((stat: any) => {
                              return stat.stat.name;
                            })
                            .join(", ")
                        : ""}
                    </p>
                  </div>
                  <div className="flex p-2 px-6 items-start gap-2">
                    <p className="text-black font-bold text-lg">Abilities: </p>
                    <p className="text-black text-lg">
                      {data?.abilities.length > 0
                        ? data?.abilities
                            ?.map((ability: any) => {
                              return ability.ability.name;
                            })
                            .join(", ")
                        : ""}
                    </p>
                  </div>
                  <div className="flex p-2 px-6 items-start gap-2">
                    <p className="text-black font-bold text-lg">Some Moves: </p>
                    <p className="text-black text-lg">
                      {data?.moves.length > 0
                        ? data?.moves
                            ?.map((move: any) => {
                              return move.move.name;
                            })
                            .join(", ")
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
