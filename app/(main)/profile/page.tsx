"use client";

import React, {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Heart,
  ImagePlus,
  Info,
  Maximize2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AvatarCropper } from "../../../components/AvatarCropper";
import { ChoiceCard } from "../../../components/ChoiceCard";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Modal } from "../../../components/Modal";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { ProfileAvatar } from "../../../components/ProfileAvatar";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { useAppData } from "../../../lib/context/AppContext";
import {
  GENRES,
  NEEDS,
  Genre,
  Need,
} from "../../../lib/data/options";
import {
  AVATAR_OPTIONS,
  PAUSE_FREQUENCY_OPTIONS,
  PAUSE_TIME_OPTIONS,
  WELLNESS_FOCUS_OPTIONS,
  UserProfile,
  WellnessFocus,
} from "../../../lib/data/profileOptions";
import {
  ProfileValidationErrors,
  getDisplayName,
  validateProfile,
} from "../../../lib/utils/profile";

const MAX_PROFILE_PHOTO_BYTES =
  8 * 1024 * 1024;

export default function ProfilePage() {
  const router = useRouter();

  const {
    loading,
    profile,
    favoriteGenres,
    defaultNeed,
    pauseReflections,
    resetEntries,
    updateProfile,
    updatePreferences,
    resetAllData,
  } = useAppData();

  const formRef =
    useRef<HTMLFormElement>(null);

  const photoInputRef =
    useRef<HTMLInputElement>(null);

  const [
    draftProfile,
    setDraftProfile,
  ] = useState<UserProfile>(profile);

  const [
    draftGenres,
    setDraftGenres,
  ] = useState<Genre[]>(
    favoriteGenres
  );

  const [
    draftNeed,
    setDraftNeed,
  ] = useState<Need | null>(
    defaultNeed
  );

  const [errors, setErrors] =
    useState<ProfileValidationErrors>(
      {}
    );

  const [saved, setSaved] =
    useState(false);

  const [resetOpen, setResetOpen] =
    useState(false);

  const [
    avatarViewOpen,
    setAvatarViewOpen,
  ] = useState(false);

  const [
    portalReady,
    setPortalReady,
  ] = useState(false);

  const [
    photoError,
    setPhotoError,
  ] = useState("");

  const [
    cropSource,
    setCropSource,
  ] = useState<string | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    setDraftProfile(profile);
    setDraftGenres(favoriteGenres);
    setDraftNeed(defaultNeed);
  }, [
    loading,
    profile,
    favoriteGenres,
    defaultNeed,
  ]);

  useEffect(() => {
    if (!saved) {
      return;
    }

    const timer =
      window.setTimeout(
        () => setSaved(false),
        2200
      );

    return () =>
      window.clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    return () => {
      if (
        cropSource?.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          cropSource
        );
      }
    };
  }, [cropSource]);

  const mostCommonFeeling =
    useMemo(() => {
      if (!pauseReflections.length) {
        return "—";
      }

      const counts =
        new Map<string, number>();

      pauseReflections.forEach(
        (entry) => {
          counts.set(
            entry.feeling,

            (counts.get(
              entry.feeling
            ) ?? 0) + 1
          );
        }
      );

      return [
        ...counts.entries(),
      ].sort(
        (first, second) =>
          second[1] - first[1]
      )[0][0];
    }, [pauseReflections]);

  const displayName =
    getDisplayName(draftProfile);

  const isDirty =
    JSON.stringify(draftProfile) !==
      JSON.stringify(profile) ||
    JSON.stringify(draftGenres) !==
      JSON.stringify(
        favoriteGenres
      ) ||
    draftNeed !== defaultNeed;

  const updateDraft = <
    Key extends keyof UserProfile,
  >(
    key: Key,
    value: UserProfile[Key]
  ) => {
    setDraftProfile((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  };

  const toggleFocus = (
    focus: WellnessFocus
  ) => {
    const exists =
      draftProfile.wellnessFocus.includes(
        focus
      );

    if (
      !exists &&
      draftProfile.wellnessFocus
        .length >= 3
    ) {
      setErrors((current) => ({
        ...current,

        wellnessFocus:
          "Select up to three wellness focus areas.",
      }));

      return;
    }

    updateDraft(
      "wellnessFocus",

      exists
        ? draftProfile.wellnessFocus.filter(
            (item) =>
              item !== focus
          )
        : [
            ...draftProfile.wellnessFocus,
            focus,
          ]
    );
  };

  const toggleGenre = (
    genre: Genre
  ) => {
    setDraftGenres((current) =>
      current.includes(genre)
        ? current.filter(
            (item) =>
              item !== genre
          )
        : [...current, genre]
    );

    setSaved(false);

    setErrors((current) => ({
      ...current,
      favoriteGenres: undefined,
    }));
  };

  const selectProfilePhoto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setPhotoError(
        "Choose an image file from your device."
      );

      return;
    }

    if (
      file.size >
      MAX_PROFILE_PHOTO_BYTES
    ) {
      setPhotoError(
        "The selected image must be 8 MB or smaller."
      );

      return;
    }

    setPhotoError("");

    setCropSource(
      URL.createObjectURL(file)
    );
  };

  const applyProfilePhoto = (
    croppedImage: string
  ) => {
    updateDraft(
      "avatarImage",
      croppedImage
    );

    setCropSource(null);
    setPhotoError("");
  };

  const removeProfilePhoto = () => {
    updateDraft(
      "avatarImage",
      null
    );

    setCropSource(null);
    setAvatarViewOpen(false);
    setPhotoError("");
  };

  const cancelChanges = () => {
    setDraftProfile(profile);
    setDraftGenres(favoriteGenres);
    setDraftNeed(defaultNeed);
    setCropSource(null);
    setAvatarViewOpen(false);
    setErrors({});
    setPhotoError("");
    setSaved(false);
  };

  const saveProfile = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedProfile: UserProfile =
      {
        ...draftProfile,

        fullName:
          draftProfile.fullName.trim(),

        preferredName:
          draftProfile.preferredName.trim(),

        pauseIntention:
          draftProfile.pauseIntention.trim(),
      };

    const nextErrors =
      validateProfile(
        normalizedProfile,
        draftGenres,
        draftNeed
      );

    if (
      Object.keys(nextErrors).length
    ) {
      setErrors(nextErrors);
      setSaved(false);

      window.setTimeout(() => {
        formRef.current
          ?.querySelector<HTMLElement>(
            "[aria-invalid='true']"
          )
          ?.focus();
      }, 0);

      return;
    }

    updateProfile(
      normalizedProfile
    );

    updatePreferences(
      draftGenres,
      draftNeed as Need
    );

    setDraftProfile(
      normalizedProfile
    );

    setErrors({});
    setPhotoError("");
    setSaved(true);
  };

  const confirmReset = () => {
    resetAllData();
    setResetOpen(false);
    setAvatarViewOpen(false);
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <ScreenHeader
          title="Profile & Preferences"
          subtitle="Personalize your wellness space."
        />

        <div className="h-48 animate-pulse rounded-3xl border border-line bg-surface" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ScreenHeader
        title="Profile & Preferences"
        subtitle="Personalize your wellness space."
      />

      <form
        ref={formRef}
        onSubmit={saveProfile}
        noValidate
        className={
          isDirty
            ? "pb-36 sm:pb-28"
            : ""
        }
      >
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="animate-fade-in-up rounded-3xl border border-line bg-surface p-6 text-center shadow-soft">
              <button
                type="button"
                onClick={() =>
                  setAvatarViewOpen(true)
                }
                aria-label="View profile avatar in full size"
                className="press-scale group relative inline-flex rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25"
              >
                <ProfileAvatar
                  fullName={
                    draftProfile.fullName
                  }
                  preferredName={
                    draftProfile.preferredName
                  }
                  avatar={
                    draftProfile.avatar
                  }
                  avatarImage={
                    draftProfile.avatarImage
                  }
                  size="lg"
                />

                <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-plum text-white shadow-soft transition-transform group-hover:scale-110">
                  <Maximize2 size={13} />
                </span>
              </button>

              <h2 className="mt-4 font-display text-xl font-semibold text-ink">
                {displayName ||
                  "Your profile"}
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                Nurse wellness profile
              </p>

              {draftProfile.pauseIntention && (
                <p className="mt-4 border-t border-line pt-4 text-sm italic leading-relaxed text-plum-deep">
                  &quot;
                  {
                    draftProfile.pauseIntention
                  }
                  &quot;
                </p>
              )}
            </div>

            <div className="animate-fade-in-up stagger-1 rounded-2xl border border-line bg-plum-soft p-4">
              <div className="mb-2 flex items-center gap-2 text-plum-deeper">
                <ShieldCheck
                  size={17}
                />

                <h2 className="text-sm font-semibold">
                  Private by design
                </h2>
              </div>

              <p className="text-xs leading-relaxed text-plum-deep">
                Your profile, photo, and
                reflections are stored only
                in this browser. They are not
                uploaded or shared with other
                users.
              </p>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="animate-fade-in-up rounded-2xl border border-line bg-surface p-5 shadow-soft md:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                Choose how the app should
                address you.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Full name{" "}
                    <span className="text-danger">
                      *
                    </span>
                  </label>

                  <input
                    id="fullName"
                    value={
                      draftProfile.fullName
                    }
                    onChange={(event) =>
                      updateDraft(
                        "fullName",
                        event.target.value
                      )
                    }
                    aria-invalid={
                      !!errors.fullName
                    }
                    aria-describedby={
                      errors.fullName
                        ? "fullName-error"
                        : undefined
                    }
                    maxLength={80}
                    autoComplete="name"
                    className="w-full rounded-xl border border-line bg-canvasAlt px-3.5 py-3 text-[15px] text-ink outline-none transition-all placeholder:text-inkSoft/70 focus:border-plum focus:ring-4 focus:ring-plum/15"
                    placeholder="e.g. Juan Dela Cruz"
                  />

                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      role="alert"
                      className="mt-1.5 text-xs text-danger"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="preferredName"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Preferred name{" "}
                    <span className="font-normal text-inkSoft">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="preferredName"
                    value={
                      draftProfile.preferredName
                    }
                    onChange={(event) =>
                      updateDraft(
                        "preferredName",
                        event.target.value
                      )
                    }
                    maxLength={40}
                    autoComplete="nickname"
                    className="w-full rounded-xl border border-line bg-canvasAlt px-3.5 py-3 text-[15px] text-ink outline-none transition-all placeholder:text-inkSoft/70 focus:border-plum focus:ring-4 focus:ring-plum/15"
                    placeholder="What should we call you?"
                  />
                </div>
              </div>

              <fieldset className="mt-6 rounded-2xl border border-line bg-canvasAlt p-4 sm:p-5">
                <legend className="px-1 font-display text-lg font-semibold text-ink">
                  Profile Avatar
                </legend>

                <p className="mt-1 text-sm text-inkSoft">
                  Use a photo or customize the
                  color shown behind your
                  initials.
                </p>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setAvatarViewOpen(true)
                    }
                    aria-label="View current avatar in full size"
                    className="press-scale group relative inline-flex shrink-0 self-start rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25 sm:self-auto"
                  >
                    <ProfileAvatar
                      fullName={
                        draftProfile.fullName
                      }
                      preferredName={
                        draftProfile.preferredName
                      }
                      avatar={
                        draftProfile.avatar
                      }
                      avatarImage={
                        draftProfile.avatarImage
                      }
                      size="lg"
                    />

                    <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-plum text-white shadow-soft transition-transform group-hover:scale-110">
                      <Maximize2 size={13} />
                    </span>
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      Current avatar
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-inkSoft">
                      Click the avatar to view
                      it in full size. You can
                      also choose a new photo
                      from your files or
                      gallery.
                    </p>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={
                        selectProfilePhoto
                      }
                      className="sr-only"
                      aria-label="Choose profile photo"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      <PrimaryButton
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          photoInputRef.current?.click()
                        }
                        icon={
                          <ImagePlus
                            size={16}
                          />
                        }
                      >
                        {draftProfile.avatarImage
                          ? "Change Photo"
                          : "Choose Photo"}
                      </PrimaryButton>

                      {draftProfile.avatarImage && (
                        <>
                          <PrimaryButton
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setCropSource(
                                draftProfile.avatarImage
                              )
                            }
                          >
                            Adjust Crop
                          </PrimaryButton>

                          <PrimaryButton
                            type="button"
                            variant="ghost"
                            onClick={
                              removeProfilePhoto
                            }
                            icon={
                              <Trash2
                                size={16}
                              />
                            }
                            className="!text-danger hover:!bg-danger/10"
                          >
                            Remove
                          </PrimaryButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {photoError && (
                  <p
                    role="alert"
                    className="mt-3 text-xs text-danger"
                  >
                    {photoError}
                  </p>
                )}

                {cropSource && (
                  <AvatarCropper
                    src={cropSource}
                    onApply={
                      applyProfilePhoto
                    }
                    onCancel={() =>
                      setCropSource(null)
                    }
                  />
                )}

                <div className="mt-5 border-t border-line pt-5">
                  <p className="text-sm font-semibold text-ink">
                    Avatar color
                  </p>

                  <p className="mt-1 text-xs text-inkSoft">
                    This color appears behind
                    your initials when no
                    profile photo is selected.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {AVATAR_OPTIONS.map(
                      (option) => {
                        const selected =
                          draftProfile.avatar ===
                          option.value;

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              updateDraft(
                                "avatar",
                                option.value
                              )
                            }
                            aria-label={`${option.label} avatar`}
                            aria-pressed={
                              selected
                            }
                            className={`press-scale rounded-full p-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-plum/25 ${
                              selected
                                ? "bg-plum-soft ring-2 ring-plum"
                                : "hover:bg-plum-soft/60"
                            }`}
                          >
                            <ProfileAvatar
                              fullName={
                                draftProfile.fullName
                              }
                              preferredName={
                                draftProfile.preferredName
                              }
                              avatar={
                                option.value
                              }
                              avatarImage={
                                null
                              }
                              size="md"
                            />
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </fieldset>
            </section>

            <section className="animate-fade-in-up stagger-1 rounded-2xl border border-line bg-surface p-5 shadow-soft md:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Wellness Goals
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                Select up to three areas you
                want this space to support.
              </p>

              <fieldset className="mt-5">
                <legend className="sr-only">
                  Wellness focus areas
                </legend>

                <div
                  className="grid gap-3 sm:grid-cols-2"
                  aria-invalid={
                    !!errors.wellnessFocus
                  }
                  aria-describedby={
                    errors.wellnessFocus
                      ? "wellnessFocus-error"
                      : undefined
                  }
                  tabIndex={
                    errors.wellnessFocus
                      ? -1
                      : undefined
                  }
                >
                  {WELLNESS_FOCUS_OPTIONS.map(
                    (option) => (
                      <ChoiceCard
                        key={option.value}
                        label={option.label}
                        subLabel={
                          option.description
                        }
                        selected={draftProfile.wellnessFocus.includes(
                          option.value
                        )}
                        onClick={() =>
                          toggleFocus(
                            option.value
                          )
                        }
                      />
                    )
                  )}
                </div>

                {errors.wellnessFocus && (
                  <p
                    id="wellnessFocus-error"
                    role="alert"
                    className="mt-2 text-xs text-danger"
                  >
                    {
                      errors.wellnessFocus
                    }
                  </p>
                )}
              </fieldset>

              <div className="mt-5">
                <label
                  htmlFor="pauseIntention"
                  className="mb-1.5 block text-sm font-semibold text-ink"
                >
                  Personal pause intention{" "}
                  <span className="font-normal text-inkSoft">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="pauseIntention"
                  value={
                    draftProfile.pauseIntention
                  }
                  onChange={(event) =>
                    updateDraft(
                      "pauseIntention",
                      event.target.value
                    )
                  }
                  aria-invalid={
                    !!errors.pauseIntention
                  }
                  aria-describedby="pauseIntention-help"
                  maxLength={120}
                  rows={3}
                  className="w-full rounded-xl border border-line bg-canvasAlt p-3 text-[15px] text-ink outline-none transition-all placeholder:text-inkSoft/70 focus:border-plum focus:ring-4 focus:ring-plum/15"
                  placeholder="e.g. I want to give myself a few quiet minutes after every shift."
                />

                <div
                  id="pauseIntention-help"
                  className="mt-1 flex justify-between gap-3 text-xs"
                >
                  <span
                    className={
                      errors.pauseIntention
                        ? "text-danger"
                        : "text-inkSoft"
                    }
                  >
                    {errors.pauseIntention ??
                      "A short reminder of why you want to pause."}
                  </span>

                  <span className="shrink-0 text-inkSoft">
                    {
                      draftProfile
                        .pauseIntention.length
                    }
                    /120
                  </span>
                </div>
              </div>
            </section>

            <section className="animate-fade-in-up stagger-2 rounded-2xl border border-line bg-surface p-5 shadow-soft md:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Listening Preferences
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                These are the same preferences
                used in My Rhythm and playlist
                recommendations.
              </p>

              <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-semibold text-ink">
                  Favorite genres{" "}
                  <span className="text-danger">
                    *
                  </span>
                </legend>

                <div
                  className="flex flex-wrap gap-2"
                  aria-invalid={
                    !!errors.favoriteGenres
                  }
                  aria-describedby={
                    errors.favoriteGenres
                      ? "favoriteGenres-error"
                      : undefined
                  }
                  tabIndex={
                    errors.favoriteGenres
                      ? -1
                      : undefined
                  }
                >
                  {GENRES.map((genre) => (
                    <ChoiceCard
                      key={genre}
                      label={genre}
                      compact
                      selected={draftGenres.includes(
                        genre
                      )}
                      onClick={() =>
                        toggleGenre(genre)
                      }
                    />
                  ))}
                </div>

                {errors.favoriteGenres && (
                  <p
                    id="favoriteGenres-error"
                    role="alert"
                    className="mt-2 text-xs text-danger"
                  >
                    {
                      errors.favoriteGenres
                    }
                  </p>
                )}
              </fieldset>

              <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-semibold text-ink">
                  What do you usually look for?{" "}
                  <span className="text-danger">
                    *
                  </span>
                </legend>

                <div
                  className="flex flex-wrap gap-2"
                  aria-invalid={
                    !!errors.defaultNeed
                  }
                  aria-describedby={
                    errors.defaultNeed
                      ? "defaultNeed-error"
                      : undefined
                  }
                  tabIndex={
                    errors.defaultNeed
                      ? -1
                      : undefined
                  }
                >
                  {NEEDS.map((need) => (
                    <ChoiceCard
                      key={need}
                      label={need}
                      compact
                      selected={
                        draftNeed === need
                      }
                      onClick={() => {
                        setDraftNeed(need);
                        setSaved(false);

                        setErrors(
                          (current) => ({
                            ...current,

                            defaultNeed:
                              undefined,
                          })
                        );
                      }}
                    />
                  ))}
                </div>

                {errors.defaultNeed && (
                  <p
                    id="defaultNeed-error"
                    role="alert"
                    className="mt-2 text-xs text-danger"
                  >
                    {errors.defaultNeed}
                  </p>
                )}
              </fieldset>
            </section>

            <section className="animate-fade-in-up stagger-3 rounded-2xl border border-line bg-surface p-5 shadow-soft md:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Pause Habits
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                These optional choices help
                describe the pause routine you
                want to build.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pauseTime"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Preferred pause time
                  </label>

                  <select
                    id="pauseTime"
                    value={
                      draftProfile.pauseTime ??
                      ""
                    }
                    onChange={(event) =>
                      updateDraft(
                        "pauseTime",

                        (event.target.value ||
                          null) as UserProfile["pauseTime"]
                      )
                    }
                    className="w-full rounded-xl border border-line bg-canvasAlt px-3.5 py-3 text-[15px] text-ink outline-none transition-all focus:border-plum focus:ring-4 focus:ring-plum/15"
                  >
                    <option value="">
                      No preference
                    </option>

                    {PAUSE_TIME_OPTIONS.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="pauseFrequency"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Pause frequency goal
                  </label>

                  <select
                    id="pauseFrequency"
                    value={
                      draftProfile.pauseFrequency ??
                      ""
                    }
                    onChange={(event) =>
                      updateDraft(
                        "pauseFrequency",

                        (event.target.value ||
                          null) as UserProfile["pauseFrequency"]
                      )
                    }
                    className="w-full rounded-xl border border-line bg-canvasAlt px-3.5 py-3 text-[15px] text-ink outline-none transition-all focus:border-plum focus:ring-4 focus:ring-plum/15"
                  >
                    <option value="">
                      No goal yet
                    </option>

                    {PAUSE_FREQUENCY_OPTIONS.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-canvasAlt p-3 text-xs text-inkSoft">
                <Info
                  size={15}
                  className="mt-0.5 shrink-0 text-plum"
                />

                These preferences do not
                schedule notifications yet.
                They will be ready for a future
                reminder feature.
              </div>
            </section>

            <section className="animate-fade-in-up stagger-4 rounded-2xl border border-line bg-surface p-5 shadow-soft md:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Your Progress
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                A summary based on your saved
                local activity.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Total Pauses",

                    value:
                      pauseReflections.length,

                    icon: Heart,
                  },
                  {
                    label: "Total Resets",

                    value:
                      resetEntries.length,

                    icon: RotateCcw,
                  },
                  {
                    label:
                      "Common Feeling",

                    value:
                      mostCommonFeeling,

                    icon: TrendingUp,
                  },
                ].map((stat) => {
                  const Icon =
                    stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-line bg-canvasAlt p-4"
                    >
                      <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-plum-soft">
                        <Icon
                          size={16}
                          className="text-plum"
                        />
                      </span>

                      <p className="break-words font-display text-xl font-semibold text-plum-deep">
                        {stat.value}
                      </p>

                      <p className="mt-0.5 text-xs text-inkSoft">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="animate-fade-in-up stagger-5 rounded-2xl border border-danger/25 bg-danger/5 p-5 md:p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Privacy & Data
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-inkSoft">
                Clearing local data removes
                your profile, photo,
                preferences, reflections, and
                reset entries from this
                browser. This action cannot be
                undone.
              </p>

              <PrimaryButton
                type="button"
                variant="outline"
                onClick={() =>
                  setResetOpen(true)
                }
                className="mt-4 !border-danger !text-danger hover:!bg-danger/10"
              >
                Clear All Local Data
              </PrimaryButton>
            </section>
          </div>
        </div>
      </form>

      {portalReady &&
        isDirty &&
        createPortal(
          <div className="pointer-events-none fixed bottom-3 left-0 right-0 z-40 px-4 md:left-64 md:px-8 lg:left-72 lg:px-10">
            <div className="pointer-events-auto mx-auto flex max-w-5xl animate-fade-in-up flex-col gap-3 rounded-2xl border border-line bg-surface/95 p-3 shadow-elevated backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <p className="text-center text-sm font-medium text-inkSoft sm:text-left">
                You have unsaved changes.
              </p>

              <div className="flex gap-2">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  onClick={
                    cancelChanges
                  }
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </PrimaryButton>

                <PrimaryButton
                  type="button"
                  onClick={() =>
                    formRef.current?.requestSubmit()
                  }
                  icon={
                    <Sparkles
                      size={16}
                    />
                  }
                  className="flex-1 sm:flex-none"
                >
                  Save Profile
                </PrimaryButton>
              </div>
            </div>
          </div>,
          document.body
        )}

      {portalReady &&
        saved &&
        !isDirty &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 md:left-64 lg:left-72">
            <div
              role="status"
              aria-live="polite"
              className="flex animate-pop-in items-center gap-2 rounded-full bg-success px-4 py-2.5 text-sm font-semibold text-white shadow-elevated"
            >
              <Check size={16} />
              Profile saved.
            </div>
          </div>,
          document.body
        )}

      <ConfirmDialog
        open={resetOpen}
        title="Clear all local data?"
        description="Your profile, photo, preferences, reflections, and resets will be permanently removed from this browser."
        confirmLabel="Clear Data"
        cancelLabel="Keep My Data"
        onConfirm={confirmReset}
        onCancel={() =>
          setResetOpen(false)
        }
      />

      <Modal
        open={avatarViewOpen}
        onClose={() =>
          setAvatarViewOpen(false)
        }
        title="Profile Avatar"
        widthClassName="max-w-md"
      >
        <div className="flex flex-col items-center px-2 py-4 text-center">
          <ProfileAvatar
            fullName={
              draftProfile.fullName
            }
            preferredName={
              draftProfile.preferredName
            }
            avatar={
              draftProfile.avatar
            }
            avatarImage={
              draftProfile.avatarImage
            }
            size="lg"
            className="!h-64 !w-64 !text-5xl sm:!h-72 sm:!w-72 sm:!text-6xl"
          />

          <h3 className="mt-5 font-display text-xl font-semibold text-ink">
            {displayName ||
              "Your profile"}
          </h3>

          <p className="mt-1 text-sm text-inkSoft">
            {draftProfile.avatarImage
              ? "Profile photo"
              : "Initials avatar"}
          </p>
        </div>
      </Modal>
    </div>
  );
}