import { getSiteContent } from "@/lib/content";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  const content = await getSiteContent();
  return <Navbar content={content} />;
}
