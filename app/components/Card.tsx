import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

interface CardProps {
  pokemon: any;
  key: any;
}

const Card = ({ pokemon }: CardProps) => {
  return (
    <>
      <div className="shadow-md rounded-md bg-white">
        <div className="m-auto">
          <Image
            src={pokemon.sprites.front_default}
            alt="Example Image"
            width={200}
            height={200}
            className="rounded-md w-[200px] h-[200px] object-contain m-auto"
          />
        </div>
        <div className="bg-gray-100 rounded-md">
          <div className="text-black font-bold p-6 text-lg h-28 capitalize">
            {pokemon.name}
          </div>
          <div className="p-6">
            <Link
              href={`${pokemon.name}/${pokemon.id}`}
              className="text-blue-500 flex justify-start items-center gap-2"
            >
              Details{" "}
              <FaArrowRightLong className="text-gray fill-blue-500 w-3 h-3 mt-1" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Card;
