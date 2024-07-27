import { useState } from "react";
import styles from "./FlipCard.module.css";
import Image from "next/image";

interface Member {
  image: string;
  name: string;
  role: string;
  github: string;
  linkedIn: string;
  mailId: string;
}

const FlipCard = ({ member }: { member: Member }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative w-48 h-64 ${styles.perspective}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full text-center transition-transform duration-500 transform ${
          isFlipped ? styles.rotate180 : ""
        }`}
      >
        {/* Front Side */}
        <div className={`absolute w-full h-full ${styles.backfacehidden}`}>
          <Image
            src={member.image}
            alt={member.name}
            fill={true}
            className="object-cover"
          />
        </div>

        {/* Back Side */}
        <div
          className={`absolute w-full h-full ${styles.backfacehidden} bg-gray-200 p-4 transform ${styles.rotate180} flex flex-col justify-center gap-2`}
        >
          <div>
            <div className="text-lg font-bold">{member.name}</div>
            <div className="text-sm text-gray-600">{member.role}</div>
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              GitHub
            </a>
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </a>
            <a href={`mailto:${member.mailId}`} className="text-blue-600">
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
