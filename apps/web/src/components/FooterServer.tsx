import { getSiteContent } from "@/lib/content";
import Footer from "./Footer";

export default async function FooterServer() {
  const content = await getSiteContent();
  return <Footer content={content} />;
}
