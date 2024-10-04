"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const resetPasswordAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const origin = headers().get("origin");
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/change-password`,
  });

  if (error) {
    return encodedRedirect("error", "/password-reset", error.message);
  }

  return encodedRedirect(
    "success",
    "/password-reset",
    "Password reset link sent. Please check your email."
  );
};

export const changePasswordAction = async (formData: FormData) => {
  const newPassword = formData.get("new-password") as string;
  const confirmPassword = formData.get("confirm-password") as string;
  const supabase = createClient();

  if (newPassword !== confirmPassword) {
    return encodedRedirect("error", "/change-password", "Passwords do not match.");
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return encodedRedirect("error", "/change-password", error.message);
  }

  return encodedRedirect("success", "/change-password", "Password changed successfully.");
};
