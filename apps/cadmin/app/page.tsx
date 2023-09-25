"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import type { Database } from "@/lib/database.types";
import LoadingSpinner from "@/components/loading-spinner";
import { Input } from "@nextui-org/react";

export default function Login() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOtp({
      email,
    });
    setLoading(true)
  };

  useEffect(() => {
    const checkIfSessionExists = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session !== null) {
        router.push("/events");
      } else {
        setLoading(false);
      }
    };
    checkIfSessionExists();
  }, [supabase, router]);

  if (loading) return <LoadingSpinner />;
  return (
    <div className="h-screen flex justify-center items-center flex-col gap-5">
      <h1>Welcome to our Guest manager</h1>
      <h2>Login to visualize all guest&apos;s data </h2>
      <div className="w-1/5">
        <Input
          name="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <Button color="primary" size="md" onClick={handleSignIn}>
        Sign in
      </Button>
    </div>
  );
}
