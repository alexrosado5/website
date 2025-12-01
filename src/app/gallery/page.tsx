import { Flex, Meta, Schema } from "@once-ui-system/core";
import ClientPortal from "@/components/portal/ClientPortal";
import { baseURL, gallery, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(gallery.title)}`,
    path: gallery.path,
  });
}

export default function Gallery() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={`/api/og/generate?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {/* The gallery page has been repurposed as a client portal. Instead of
       displaying a masonry of images, users are prompted to log in with
       their email and a password assigned to them. After authenticating
       they can view their purchases and manage active payments. */}
      <ClientPortal />
    </Flex>
  );
}
