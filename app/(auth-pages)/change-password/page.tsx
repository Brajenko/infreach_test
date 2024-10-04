import { changePasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ChangePassword({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Change Password</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          type="password"
          name="new-password"
          placeholder="New password"
          required
          autoComplete="new-password"
        />
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input
          type="password"
          name="confirm-password"
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
        />
        <SubmitButton pendingText="Changing Password..." formAction={changePasswordAction}>
          Change Password
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
