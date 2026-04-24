import { Button } from "@/components/ui/button";
import UserProfile from "@/components/UserProfile";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ClientProfilePage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="absolute top-4 right-4 z-50">
        <Link href="/cliente">
          <Button>
            <ArrowLeft />
            Atrás
          </Button>
        </Link>
      </div>

      <div className="w-full p-4 flex justify-center items-center">
        <UserProfile />
      </div>
    </div>
  );
}
