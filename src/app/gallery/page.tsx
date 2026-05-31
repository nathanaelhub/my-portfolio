import { Flex, Meta } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person } from "@/resources";
import { WebPageSchema } from "@/components";

export const dynamic = "force-static";

export async function generateMetadata() {
  const metadata = Meta.generate({
    title: gallery.title,
    description: gallery.description,
    baseURL: baseURL,
    image: `${baseURL}${person.avatar}`,
    path: gallery.path,
  });
  return {
    ...metadata,
    alternates: { canonical: `${baseURL}${gallery.path}` },
  };
}

export default function Gallery() {
  return (
    <Flex maxWidth="l">
      <WebPageSchema
        path={gallery.path}
        title={gallery.title}
        description={gallery.description}
        image={person.avatar}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <GalleryView />
    </Flex>
  );
}
