import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import type { AvatarOption } from "../lib/data/profileOptions";
import { getInitials } from "../lib/utils/profile";

type Props = {
  fullName: string;
  preferredName?: string;
  avatar: AvatarOption;
  avatarImage?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const COLOR_CLASSES: Record<
  AvatarOption,
  string
> = {
  plum: "bg-plum text-white",
  sage: "bg-sage text-white",
  gold: "bg-gold text-plum-deeper",
  rose: "bg-[#D98A9A] text-white",
  sky: "bg-[#7FA9C4] text-white",
};

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-xl",
};

export function ProfileAvatar({
  fullName,
  preferredName = "",
  avatar,
  avatarImage = null,
  size = "md",
  className = "",
}: Props) {
  const initials = getInitials(
    fullName,
    preferredName
  );

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold shadow-soft ${COLOR_CLASSES[avatar]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {avatarImage ? (
        <Image
          src={avatarImage}
          alt=""
          fill
          unoptimized
          sizes={
            size === "lg"
              ? "80px"
              : size === "md"
                ? "48px"
                : "36px"
          }
          className="object-cover"
        />
      ) : (
        initials || (
          <User
            size={
              size === "lg"
                ? 28
                : size === "md"
                  ? 19
                  : 15
            }
          />
        )
      )}
    </span>
  );
}