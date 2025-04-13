import UserProfile from "./user-profile";
import Logo from "./logo";

export default function NavbarHome() {
  return (
    <div className="flex justify-between w-full items-center gap-4 p-4 border-b">
      <div>
        <Logo />
      </div>
      <UserProfile />
    </div>
  );
}
