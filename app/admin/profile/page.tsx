import UserProfile from "@/components/UserProfile";

export default function AdminProfilePage() {
  return (
    <div className="h-screen p-4 flex justify-center items-center">
      <UserProfile className="z-10 bg-[#050505]/80" />
    </div>
  );
}
